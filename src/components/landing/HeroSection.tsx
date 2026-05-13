import { HeroVideo } from "./HeroVideo";

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate flex flex-col items-center justify-center px-6 pb-16 pt-36 md:pt-44"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="mb-8 inline-flex max-w-3xl items-center gap-2 rounded-full glass px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:text-xs">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--magenta)] shadow-[0_0_12px_var(--magenta)]" />
          <span className="text-balance">
            Новый уровень эмоциональной устойчивости и адаптивности вашей команды
          </span>
        </span>

        <h1
          className="text-balance font-semibold tracking-[-0.04em] text-gradient"
          style={{ fontSize: "clamp(3rem, 9vw, 9.5rem)", lineHeight: 0.92 }}
        >
          Разблокируйте
          <br />
          <span
            className="italic"
            style={{
              background: "var(--gradient-cta)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              backgroundSize: "200% 200%",
              animation: "shimmer 8s linear infinite",
            }}
          >
            скрытую прибыль.
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
          Программа для собственников и руководителей, превращающая внутреннее
          напряжение команды в измеримый рост бизнеса.
        </p>
      </div>

      <div className="mt-14 w-full md:mt-20">
        <HeroVideo />
      </div>
    </section>
  );
}