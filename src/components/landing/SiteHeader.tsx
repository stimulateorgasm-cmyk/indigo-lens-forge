import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { IndigoLogo } from "./IndigoLogo";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={`mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 md:mt-6 md:px-7 md:py-3 ${scrolled ? "glass-strong" : "glass"}`}
        style={{
          boxShadow: scrolled
            ? "var(--shadow-glass), 0 14px 40px -20px rgba(0,0,0,0.6)"
            : "var(--shadow-glass)",
        }}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <IndigoLogo size={32} />
          <span className="flex flex-col leading-none">
            <span
              className="text-base font-medium text-foreground"
              style={{ letterSpacing: "-0.01em" }}
            >
              Indigo Lab
            </span>
            <span
              className="mt-1 hidden text-[10px] uppercase text-muted-foreground sm:block"
              style={{ letterSpacing: "0.28em" }}
            >
              Психология бизнеса
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"
          style={{ letterSpacing: "0.02em" }}
        >
          <a className="story-link" href="#method">Метод</a>
          <a className="story-link" href="#research">Исследования</a>
        </nav>

        {/* Desktop CTA — compact gradient pill */}
        <a
          href="#lead-top"
          className="group relative hidden h-10 items-center gap-2 overflow-hidden rounded-full px-5 text-sm font-medium tracking-tight text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 sm:inline-flex"
          style={{
            background: "var(--gradient-cta)",
            backgroundSize: "220% 220%",
            boxShadow:
              "0 10px 30px -10px color-mix(in oklab, var(--magenta) 70%, transparent), inset 0 1px 0 color-mix(in oklab, white 25%, transparent)",
            animation: "shimmer 14s linear infinite",
          }}
        >
          <span className="relative z-10">Записаться</span>
          <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>

        {/* Mobile CTA — icon-only gradient circle */}
        <a
          href="#lead-top"
          aria-label="Записаться"
          className="grid h-9 w-9 place-items-center rounded-full text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 sm:hidden"
          style={{
            background: "var(--gradient-cta)",
            backgroundSize: "220% 220%",
            boxShadow:
              "0 8px 24px -8px color-mix(in oklab, var(--magenta) 70%, transparent), inset 0 1px 0 color-mix(in oklab, white 25%, transparent)",
            animation: "shimmer 14s linear infinite",
          }}
        >
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}