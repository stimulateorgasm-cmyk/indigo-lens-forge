import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  contact: z.string().trim().min(3).max(120),
  variant: z.enum(["top", "bottom"]).optional(),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const botToken = process.env.TELEGRAM_NOTIFY_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (!botToken || !chatId) {
      console.error("Missing TELEGRAM_NOTIFY_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID");
      return { ok: false, error: "Bot configuration missing" };
    }

    const source =
      data.variant === "bottom" ? "форма внизу страницы" : "форма вверху страницы";

    const escape = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const text =
      `🎯 <b>Indigo Lab — заявка на консультацию!</b>\n\n` +
      `👤 Имя: <b>${escape(data.name)}</b>\n` +
      `📱 Контакт: <b>${escape(data.contact)}</b>\n` +
      `📍 Источник: ${escape(source)}`;

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
        return { ok: false, error: result.description ?? "Telegram error" };
      }
      return { ok: true };
    } catch (error) {
      console.error("submitLead error:", error);
      return { ok: false, error: "Network error" };
    }
  });