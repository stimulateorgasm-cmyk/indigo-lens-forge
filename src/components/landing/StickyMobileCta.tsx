import { useEffect, useState } from "react";
import { track } from "@/lib/track";

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = window.innerHeight * 0.6;
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = () => {
    track("cta_click", { source: "sticky" });
    document
      .getElementById("lead-top")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      aria-hidden={!visible}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 md:hidden"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120%)",
        opacity: visible ? 1 : 0,
        transition: "transform 300ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease",
        background:
          "linear-gradient(to top, color-mix(in oklab, var(--background) 92%, transparent), transparent)",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto w-full rounded-full cta-gradient text-primary-foreground text-sm font-medium tracking-tight"
        style={{
          height: 56,
          boxShadow:
            "0 18px 50px -12px color-mix(in oklab, var(--magenta) 70%, transparent), inset 0 1px 0 color-mix(in oklab, white 25%, transparent)",
          animation: "shimmer 8s linear infinite",
        }}
      >
        Оставить заявку
      </button>
    </div>
  );
}