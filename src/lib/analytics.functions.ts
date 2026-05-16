import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const visitSchema = z.object({
  session_id: z.string().max(100).optional().nullable(),
  path: z.string().max(500).optional().nullable(),
  referrer: z.string().max(2000).optional().nullable(),
  utm_source: z.string().max(200).optional().nullable(),
  utm_medium: z.string().max(200).optional().nullable(),
  utm_campaign: z.string().max(200).optional().nullable(),
  utm_term: z.string().max(200).optional().nullable(),
  utm_content: z.string().max(200).optional().nullable(),
  user_agent: z.string().max(500).optional().nullable(),
});

export const trackVisit = createServerFn({ method: "POST" })
  .inputValidator((input) => visitSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("page_visits").insert({
      session_id: data.session_id ?? null,
      path: data.path ?? null,
      referrer: data.referrer ?? null,
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_term: data.utm_term ?? null,
      utm_content: data.utm_content ?? null,
      user_agent: data.user_agent ?? null,
    });
    if (error) {
      console.error("trackVisit error:", error);
      return { ok: false };
    }
    return { ok: true };
  });

const eventSchema = z.object({
  event_name: z.string().min(1).max(100),
  props: z.record(z.string(), z.unknown()).optional().nullable(),
  session_id: z.string().max(100).optional().nullable(),
  path: z.string().max(500).optional().nullable(),
  user_agent: z.string().max(500).optional().nullable(),
});

export const trackEvent = createServerFn({ method: "POST" })
  .inputValidator((input) => eventSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("analytics_events").insert({
      event_name: data.event_name,
      props: (data.props ?? null) as never,
      session_id: data.session_id ?? null,
      path: data.path ?? null,
      user_agent: data.user_agent ?? null,
    });
    if (error) {
      console.error("trackEvent error:", error);
      return { ok: false };
    }
    return { ok: true };
  });