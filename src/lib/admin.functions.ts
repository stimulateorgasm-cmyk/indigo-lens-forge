import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function ensureAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden");
}

export const getAdminStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.userId);

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
  search: z.string().max(200).optional().nullable(),
});

export const getAdminLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => leadsInput.parse(input))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.userId);

    let q = supabaseAdmin
      .from("leads")
      .select(
        "id, name, contact, variant, utm_source, utm_medium, utm_campaign, referrer, landing_path, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 200);

    if (data.utm_source) q = q.eq("utm_source", data.utm_source);
    if (data.variant) q = q.eq("variant", data.variant);
    if (data.search) {
      const s = data.search.replace(/[%_]/g, "");
      q = q.or(`name.ilike.%${s}%,contact.ilike.%${s}%`);
    }

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { leads: rows ?? [] };
  });