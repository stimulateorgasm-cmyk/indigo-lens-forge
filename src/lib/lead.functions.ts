import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const inputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  contact: z.string().trim().min(3).max(120),
  variant: z.enum(["top", "bottom"]).optional(),
  utm_source: z.string().max(200).optional().nullable(),
  utm_medium: z.string().max(200).optional().nullable(),
  utm_campaign: z.string().max(200).optional().nullable(),
  utm_term: z.string().max(200).optional().nullable(),
  utm_content: z.string().max(200).optional().nullable(),
  referrer: z.string().max(2000).optional().nullable(),
  landing_path: z.string().max(500).optional().nullable(),
  user_agent: z.string().max(500).optional().nullable(),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    // 1. Persist to DB
    const { error: dbError } = await supabaseAdmin.from("leads").insert({
      name: data.name,
      contact: data.contact,
      variant: data.variant ?? null,
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_term: data.utm_term ?? null,
      utm_content: data.utm_content ?? null,
      referrer: data.referrer ?? null,
      landing_path: data.landing_path ?? null,
      user_agent: data.user_agent ?? null,
    });
    if (dbError) {
      console.error("Failed to save lead:", dbError);
    }

    // 2. Notify Telegram
    const botToken = process.env.TELEGRAM_NOTIFY_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (!botToken || !chatId) {
      console.error("Missing TELEGRAM_NOTIFY_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID");
      return { ok: !dbError };
    }

    const source =
      data.variant === "bottom" ? "форма внизу страницы" : "форма вверху страницы";

    const escape = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const utmLine =
      data.utm_source || data.utm_medium || data.utm_campaign
        ? `\n🏷 UTM: <code>${escape(
            [data.utm_source, data.utm_medium, data.utm_campaign]
              .filter(Boolean)
              .join(" / ") || "—",
          )}</code>`
        : "";
    const refLine = data.referrer
      ? `\n🔗 Реферер: <code>${escape(data.referrer.slice(0, 200))}</code>`
      : "";

    const text =
      `🎯 <b>Indigo Lab — заявка на консультацию!</b>\n\n` +
      `👤 Имя: <b>${escape(data.name)}</b>\n` +
      `📱 Контакт: <b>${escape(data.contact)}</b>\n` +
      `📍 Источник: ${escape(source)}` +
      utmLine +
      refLine;

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "HTML",
          }),
        },
      );
      const result = (await res.json()) as { ok: boolean; description?: string };
      if (!result.ok) {
        console.error("Telegram sendMessage failed:", result);
        return { ok: !dbError, error: result.description ?? "Telegram error" };
      }
      return { ok: true };
    } catch (error) {
      console.error("submitLead telegram error:", error);
      return { ok: !dbError, error: "Network error" };
    }
  });
