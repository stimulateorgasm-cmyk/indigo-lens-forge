import { useState } from "react";
import { toast } from "sonner";
import { GradientButton } from "./GradientButton";
import { FloatingLabelInput } from "./FloatingLabelInput";

export function ConversionSection() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Заявка принята", {
        description: "Мы свяжемся в течение одного рабочего дня.",
      });
    }, 600);
  };

  return (
    <section id="contact" className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-4xl">
        {/* Quote */}
        <figure className="mb-20 text-center md:mb-28">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full glass-strong">
            <span
              className="text-lg font-semibold tracking-tight"
              style={{
                background: "var(--gradient-cta)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              А·К
            </span>
          </div>
          <blockquote
            className="text-balance italic text-foreground"
            style={{
              fontSize: "clamp(1.6rem, 3.4vw, 2.6rem)",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
            }}
          >
            «За три месяца мы вернули то, что теряли годами — внимание команды
            к собственным решениям. Прибыль выросла как побочный эффект.»
          </blockquote>
          <figcaption className="mt-6 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Алексей К. · CEO, портфельная компания
          </figcaption>
        </figure>

        {/* Form card */}
        <div className="relative mx-auto max-w-xl">
          {/* Outer halo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-10 -z-10 rounded-[40px]"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--magenta) 35%, transparent), transparent 70%)",
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
            {/* Inner shimmer border */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[28px]"
              style={{
                padding: "1px",
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--magenta) 50%, transparent), transparent 35%, transparent 65%, color-mix(in oklab, var(--cyan) 35%, transparent))",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />

            <div className="relative">
              <div className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Ограниченный набор
              </div>
              <h3
                className="font-semibold tracking-[-0.02em] text-gradient"
                style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)", lineHeight: 1.05 }}
              >
                Запросить разбор бизнеса
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Бесплатная 45-минутная сессия с партнёром INDIGO. Только для
                компаний с выручкой от 100 М ₽.
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-2">
                <FloatingLabelInput label="Имя" name="name" autoComplete="name" required />
                <FloatingLabelInput label="Email" type="email" name="email" autoComplete="email" required />
                <FloatingLabelInput label="Telegram (необязательно)" name="telegram" />
                <div className="pt-8">
                  <GradientButton type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Отправляем…" : "Отправить заявку"}
                  </GradientButton>
                </div>
              </form>

              <p className="mt-5 text-center text-[11px] tracking-wide text-muted-foreground">
                Ваши данные защищены. Мы не передаём их третьим сторонам.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}