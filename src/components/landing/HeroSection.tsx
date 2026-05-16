import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { HeroVideo } from "./HeroVideo";
import { track } from "@/lib/track";

const gradientAccent: React.CSSProperties = {
  background: "var(--gradient-cta)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  backgroundSize: "200% 200%",
  animation: "shimmer 14s linear infinite",
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let nextX = 50;
    let nextY = 50;
    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      nextX = ((e.clientX - rect.left) / rect.width) * 100;
      nextY = ((e.clientY - rect.top) / rect.height) * 100;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          glow.style.setProperty("--mx", `${nextX}%`);
          glow.style.setProperty("--my", `${nextY}%`);
          raf = 0;
        });
      }
    };
    const onEnter = () => glow.classList.add("is-active");
    const onLeave = () => glow.classList.remove("is-active");
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToVideo = () => {
    track("cta_click", { source: "hero_video" });
    document
      .getElementById("hero-video")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate flex flex-col items-center justify-center px-6 pb-12 pt-32 md:pt-40"
    >
      <div ref={glowRef} className="hero-cursor-glow" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <span
          className="hero-rise mb-8 inline-flex max-w-3xl items-center gap-2 rounded-full glass px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:text-xs"
          style={{ animationDelay: "0ms" }}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--magenta)] shadow-[0_0_12px_var(--magenta)]" />
          <span className="text-balance">
            Новый уровень эмоциональной устойчивости и адаптивности вашей команды
          </span>
        </span>

        <h1
          className="hero-rise text-balance font-semibold tracking-[-0.04em] text-gradient"
          style={{
            fontSize: "clamp(3rem, 9vw, 9.5rem)",
            lineHeight: 0.92,
            animationDelay: "100ms",
          }}
        >
          Разблокируйте
          <br />
          <span className="italic" style={gradientAccent}>
            скрытую прибыль.
          </span>
        </h1>

        <p
          className="hero-rise mt-8 max-w-xl text-balance text-base text-muted-foreground md:text-lg"
          style={{ animationDelay: "200ms" }}
        >
          Программа для собственников и руководителей, превращающая внутреннее{" "}
          <span className="italic text-foreground/90 whitespace-nowrap" style={gradientAccent}>
            напряжение команды
          </span>{" "}
          в{" "}
          <span className="italic text-foreground/90 whitespace-nowrap" style={gradientAccent}>
            измеримый рост бизнеса
          </span>
          .
        </p>

        <button
          type="button"
          onClick={scrollToVideo}
          className="hero-rise group mt-8 inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-medium text-foreground/90 transition-transform duration-300 hover:-translate-y-0.5"
          style={{ animationDelay: "300ms" }}
          aria-label="Смотреть видео"
        >
          <span className="uppercase tracking-[0.18em] text-xs">Смотреть видео</span>
          <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
        </button>
      </div>

      <div
        id="hero-video"
        className="hero-rise relative mt-14 w-full md:mt-20"
        style={{ animationDelay: "400ms" }}
      >
        <HeroVideo />
      </div>
    </section>
  );
}