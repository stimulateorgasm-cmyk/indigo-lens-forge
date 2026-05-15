import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/lead.functions";
import { GradientButton } from "./GradientButton";
import { FloatingLabelInput } from "./FloatingLabelInput";

const schema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80, "Слишком длинное имя"),
  contact: z
    .string()
    .trim()
    .min(3, "Укажите телефон или Telegram")
    .max(120, "Слишком длинное значение")
    .regex(/^[+\d\s\-()@a-zA-Z._]+$/u, "Допустимы цифры, +, @, латиница"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Нужно согласие на обработку данных" }),
  }),
});

interface LeadFormSectionProps {
  id: string;
  variant?: "top" | "bottom";
}

export function LeadFormSection({ id, variant = "top" }: LeadFormSectionProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const submit = useServerFn(submitLead);

  const eyebrow =
    variant === "top" ? "Бесплатная консультация" : "Готовы обсудить?";
  const title =
    variant === "top"
      ? "Давайте обсудим ваши зоны роста"
      : "Оставьте заявку — мы свяжемся";
  const subtitle =
    variant === "top"
      ? "Бесплатная 45-минутная сессия с представителем Indigo Lab."
      : "Бесплатная 45-минутная сессия с партнёром Indigo Lab. Обсудим запрос и подберём формат работы.";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      name: String(fd.get("name") ?? ""),
      contact: String(fd.get("contact") ?? ""),
      consent: consent === true,
    });
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const i of parsed.error.issues) {
        const k = i.path[0] as string;
        if (!map[k]) map[k] = i.message;
      }
      setErrors(map);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const result = await submit({
        data: {
          name: parsed.data.name,
          contact: parsed.data.contact,
          variant,
        },
      });
      if (result?.ok) {
        form.reset();
        setConsent(false);
        toast.success("Заявка принята", {
          description: "Свяжемся в течение одного рабочего дня.",
        });
      } else {
        toast.error("Не удалось отправить заявку", {
          description: "Попробуйте ещё раз или напишите нам в Telegram.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Не удалось отправить заявку", {
        description: "Попробуйте ещё раз или напишите нам в Telegram.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id={id} className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-xl">
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-10 -z-10 rounded-[40px]"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--magenta) 30%, transparent), transparent 70%)",
              filter: "blur(40px)",
              animation: "halo-pulse 6s ease-in-out infinite",
            }}
          />
          <div
            className="relative overflow-hidden rounded-[28px] glass-strong p-8 md:p-10"
            style={{
              boxShadow:
                "var(--shadow-glass), 0 0 0 1px color-mix(in oklab, var(--magenta) 15%, transparent)",
            }}
          >
            <div className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {eyebrow}
            </div>
            <h3
              className="font-semibold tracking-[-0.02em] text-gradient"
              style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)", lineHeight: 1.05 }}
            >
              {title}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-2" noValidate>
              <FloatingLabelInput
                label="Имя"
                name="name"
                autoComplete="name"
                required
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-[color-mix(in_oklab,var(--pain)_85%,white)]">
                  {errors.name}
                </p>
              )}
              <FloatingLabelInput
                label="Телефон или Telegram"
                name="contact"
                autoComplete="tel"
                required
                aria-invalid={!!errors.contact}
              />
              {errors.contact && (
                <p className="text-xs text-[color-mix(in_oklab,var(--pain)_85%,white)]">
                  {errors.contact}
                </p>
              )}

              <label className="flex cursor-pointer items-start gap-3 pt-6 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  name="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 cursor-pointer rounded border-[color-mix(in_oklab,white_25%,transparent)] bg-transparent accent-[var(--magenta)]"
                />
                <span>
                  Я согласен на обработку персональных данных в соответствии с
                  политикой конфиденциальности.
                </span>
              </label>
              {errors.consent && (
                <p className="text-xs text-[color-mix(in_oklab,var(--pain)_85%,white)]">
                  {errors.consent}
                </p>
              )}

              <div className="pt-6">
                <GradientButton type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Отправляем…" : "Записаться"}
                </GradientButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}