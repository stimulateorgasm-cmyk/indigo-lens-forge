import { IPadFrame } from "./IPadFrame";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-40 md:pt-48"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--magenta)] shadow-[0_0_12px_var(--magenta)]" />
          Новый стандарт лидерства
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

      <div className="mt-16 w-full md:mt-20">
        <IPadFrame />
      </div>

      <div className="mt-16 flex flex-col items-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <span>scroll</span>
        <ChevronDown
          className="mt-2 h-4 w-4 opacity-60"
          style={{ animation: "float-y 2.4s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}