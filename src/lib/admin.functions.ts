import { createServerFn } from "@tanstack/react-start";
import { createMiddleware } from "@tanstack/react-start";
import { deleteCookie, getCookie, getRequestHeader, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_SESSION_COOKIE = "indigo_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function getAdminPassword() {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) throw new Error("ADMIN_PASSWORD not configured");
  return expected;
}

async function safeEqual(a: string, b: string) {
  if (!a || a.length !== b.length) return false;
  const { timingSafeEqual } = await import("crypto");
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

async function getAdminSessionToken() {
  const { createHmac } = await import("crypto");
  return createHmac("sha256", getAdminPassword())
    .update("indigo-admin-session:v1")
    .digest("hex");
}

async function isValidAdminPassword(provided: string) {
  return safeEqual(provided, getAdminPassword());
}

async function isValidAdminSession() {
  return safeEqual(getCookie(ADMIN_SESSION_COOKIE) ?? "", await getAdminSessionToken());
}

async function setAdminSessionCookie() {
  setCookie(ADMIN_SESSION_COOKIE, await getAdminSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
}

const requireAdminPassword = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const provided = getRequestHeader("x-admin-key") ?? "";
    if (!(await isValidAdminSession()) && !(await isValidAdminPassword(provided))) {
      throw new Error("Forbidden");
    }
    return next();
  },
);

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ password: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    if (!(await isValidAdminPassword(data.password))) {
      throw new Error("Forbidden");
    }
    await setAdminSessionCookie();
    return { ok: true };
  });

export const verifyAdminSession = createServerFn({ method: "POST" })
  .middleware([requireAdminPassword])
  .handler(async () => ({ ok: true }));

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(ADMIN_SESSION_COOKIE, { path: "/" });
  return { ok: true };
});

export const getAdminStats = createServerFn({ method: "POST" })
  .middleware([requireAdminPassword])
  .handler(async () => {
    const now = new Date();
    const since30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const since7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [leadsRes, visitsRes, leads30Res, visits30Res] = await Promise.all([
      supabaseAdmin.from("leads").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("page_visits").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("leads")
        .select("created_at, variant, utm_source, utm_medium, utm_campaign")
        .gte("created_at", since30),
      supabaseAdmin
        .from("page_visits")
        .select("created_at, session_id, utm_source, utm_medium, utm_campaign")
        .gte("created_at", since30),
    ]);

    const leads30 = leadsRes.count ?? 0;
    const visits30 = visitsRes.count ?? 0;
    const leadsList = leads30Res.data ?? [];
    const visitsList = visits30Res.data ?? [];

    // KPI
    const leads7 = leadsList.filter((l) => l.created_at >= since7).length;
    const visits7 = visitsList.filter((v) => v.created_at >= since7).length;
    const uniqueSessions30 = new Set(
      visitsList.map((v) => v.session_id).filter(Boolean),
    ).size;
    const conversion =
      uniqueSessions30 > 0 ? (leadsList.length / uniqueSessions30) * 100 : 0;

    // Daily series (last 30 days)
    const days: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      days.push(d.toISOString().slice(0, 10));
    }
    const leadsByDay = Object.fromEntries(days.map((d) => [d, 0]));
    const visitsByDay = Object.fromEntries(days.map((d) => [d, 0]));
    for (const l of leadsList) {
      const d = l.created_at.slice(0, 10);
      if (d in leadsByDay) leadsByDay[d]++;
    }
    for (const v of visitsList) {
      const d = v.created_at.slice(0, 10);
      if (d in visitsByDay) visitsByDay[d]++;
    }
    const daily = days.map((d) => ({
      date: d,
      leads: leadsByDay[d],
      visits: visitsByDay[d],
    }));

    // Sources breakdown
    const sourceMap: Record<string, { leads: number; visits: number }> = {};
    const bump = (key: string, kind: "leads" | "visits") => {
      const k = key || "(direct)";
      if (!sourceMap[k]) sourceMap[k] = { leads: 0, visits: 0 };
      sourceMap[k][kind]++;
    };
    for (const l of leadsList) bump(l.utm_source ?? "", "leads");
    for (const v of visitsList) bump(v.utm_source ?? "", "visits");
    const sources = Object.entries(sourceMap)
      .map(([source, v]) => ({ source, ...v }))
      .sort((a, b) => b.visits + b.leads - (a.visits + a.leads));

    // Form variant breakdown
    const variants = { top: 0, bottom: 0, unknown: 0 };
    for (const l of leadsList) {
      if (l.variant === "top") variants.top++;
      else if (l.variant === "bottom") variants.bottom++;
      else variants.unknown++;
    }

    return {
      totals: {
        leads: leads30,
        visits: visits30,
        leads7,
        visits7,
        leads30: leadsList.length,
        visits30: visitsList.length,
        uniqueSessions30,
        conversion: Math.round(conversion * 100) / 100,
      },
      daily,
      sources,
      variants,
    };
  });

const leadsInput = z.object({
  limit: z.number().min(1).max(500).optional(),
  utm_source: z.string().max(200).optional().nullable(),
  variant: z.enum(["top", "bottom"]).optional().nullable(),
  status: z.enum(["new", "in_progress", "closed"]).optional().nullable(),
  search: z.string().max(200).optional().nullable(),
});

export const getAdminLeads = createServerFn({ method: "POST" })
  .middleware([requireAdminPassword])
  .inputValidator((input) => leadsInput.parse(input))
  .handler(async ({ data }) => {
    let q = supabaseAdmin
      .from("leads")
      .select(
        "id, name, contact, variant, utm_source, utm_medium, utm_campaign, referrer, landing_path, created_at, status, notes",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 200);

    if (data.utm_source) q = q.eq("utm_source", data.utm_source);
    if (data.variant) q = q.eq("variant", data.variant);
    if (data.status) q = q.eq("status", data.status);
    if (data.search) {
      const s = data.search.replace(/[%_]/g, "");
      q = q.or(`name.ilike.%${s}%,contact.ilike.%${s}%`);
    }

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { leads: rows ?? [] };
  });

export const updateLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireAdminPassword])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "in_progress", "closed"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("leads")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateLeadNotes = createServerFn({ method: "POST" })
  .middleware([requireAdminPassword])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        notes: z.string().max(5000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("leads")
      .update({ notes: data.notes })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAdminEvents = createServerFn({ method: "POST" })
  .middleware([requireAdminPassword])
  .handler(async () => {
    const now = new Date();
    const since30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: rows, error } = await supabaseAdmin
      .from("analytics_events")
      .select("event_name, props, created_at")
      .gte("created_at", since30)
      .limit(10000);
    if (error) throw new Error(error.message);

    const events = rows ?? [];
    const byName: Record<string, number> = {};
    const ctaBySource: Record<string, number> = {};
    for (const e of events) {
      byName[e.event_name] = (byName[e.event_name] ?? 0) + 1;
      if (e.event_name === "cta_click") {
        const src =
          (e.props as Record<string, unknown> | null)?.source as string | undefined;
        const key = src || "(unknown)";
        ctaBySource[key] = (ctaBySource[key] ?? 0) + 1;
      }
    }
    return {
      totals: {
        cta_click: byName.cta_click ?? 0,
        calculator_use: byName.calculator_use ?? 0,
        faq_open: byName.faq_open ?? 0,
        video_play: byName.video_play ?? 0,
        video_platform_click: byName.video_platform_click ?? 0,
        download_pdf: byName.download_pdf ?? 0,
      },
      byName: Object.entries(byName)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      ctaBySource: Object.entries(ctaBySource)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count),
    };
  });