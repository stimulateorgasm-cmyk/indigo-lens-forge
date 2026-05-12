import { useEffect, useRef } from "react";

export function NebulaBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 0,
      ty = 0;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        tx += (x - tx) * 0.08;
        ty += (y - ty) * 0.08;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={ref}
        className="absolute -inset-[10%] nebula-bg"
        style={{ animation: "drift 22s ease-in-out infinite" }}
      />
      <div
        className="absolute -inset-[10%] opacity-60 mix-blend-screen"
        style={{
          background:
            "radial-gradient(40% 35% at 70% 70%, color-mix(in oklab, var(--cyan) 22%, transparent), transparent 70%)",
          animation: "drift-slow 28s ease-in-out infinite",
        }}
      />
      {/* Grain */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 50%, oklch(0.08 0.04 280) 100%)",
        }}
      />
    </div>
  );
}