import { useEffect, useRef, useState } from "react";

export function WaveTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setActive(true),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Build a turbulent path on the left, smooth sine on the right
  const W = 1200;
  const H = 240;
  const mid = H / 2;

  // Deterministic pseudo-random for sharp chaos
  const rand = (seed: number) => {
    const s = Math.sin(seed * 9301 + 49297) * 233280;
    return s - Math.floor(s);
  };

  // Sharp jagged turbulent paths — multiple layers with different seeds
  const buildTurb = (seed: number, amp: number, step: number) => {
    const pts: string[] = [];
    for (let x = 0, i = 0; x <= 600; x += step, i++) {
      const y = mid + (rand(seed + i) - 0.5) * 2 * amp;
      pts.push(`${x},${y}`);
    }
    return "M " + pts.join(" L ");
  };
  const turbLayers = [
    { d: buildTurb(1, 90, 48), w: 2 },
    { d: buildTurb(7, 75, 56), w: 1.5 },
    { d: buildTurb(13, 85, 44), w: 1.25 },
    { d: buildTurb(21, 70, 60), w: 1 },
  ];

  // Stable rising trend with subtle ripple (amplitude side)
  const startY = mid + 50;
  const endY = mid - 80;
  const sinePoints: string[] = [];
  for (let x = 600; x <= W; x += 6) {
    const t = (x - 600) / (W - 600);
    const baseline = startY + (endY - startY) * t;
    const ripple = Math.sin((x - 600) * 0.05) * 5;
    sinePoints.push(`${x},${baseline + ripple}`);
  }
  const sinePath = "M " + sinePoints.join(" L ");

  return (
    <div ref={ref} className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-[200px] w-full md:h-[260px]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="painGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.66 0.18 35)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.66 0.18 35)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="solGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.22 295)" stopOpacity="0" />
            <stop offset="40%" stopColor="oklch(0.72 0.26 330)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 220)" stopOpacity="1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Turbulent jagged layers */}
        {turbLayers.map((layer, i) => (
          <path
            key={i}
            d={layer.d}
            fill="none"
            stroke="url(#painGrad)"
            strokeWidth={layer.w}
            strokeLinejoin="miter"
            strokeLinecap="square"
            strokeOpacity={active ? 0.7 - i * 0.12 : 0}
            style={{
              transition: `stroke-opacity 1.2s ease ${i * 0.08}s`,
            }}
          />
        ))}

        {/* Smooth sine — main */}
        <path
          d={sinePath}
          fill="none"
          stroke="url(#solGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
          strokeDasharray="1200"
          strokeDashoffset={active ? "0" : "1200"}
          style={{
            transition: "stroke-dashoffset 1.8s cubic-bezier(.2,.7,.2,1)",
          }}
        />
        {/* Echo lines */}
        <path
          d={sinePath}
          fill="none"
          stroke="oklch(0.78 0.16 220)"
          strokeWidth="1"
          strokeOpacity={active ? 0.35 : 0}
          transform="translate(0 -10)"
          style={{ transition: "stroke-opacity 1.5s ease 0.4s" }}
        />
        <path
          d={sinePath}
          fill="none"
          stroke="oklch(0.72 0.26 330)"
          strokeWidth="1"
          strokeOpacity={active ? 0.35 : 0}
          transform="translate(0 10)"
          style={{ transition: "stroke-opacity 1.5s ease 0.6s" }}
        />

        {/* Particle dots along sine */}
        {active &&
          Array.from({ length: 6 }).map((_, i) => {
            const x = 620 + i * 90;
            const t = (x - 600) / (W - 600);
            const y = startY + (endY - startY) * t + Math.sin((x - 600) * 0.05) * 5;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="white"
                opacity="0.9"
                filter="url(#glow)"
                style={{
                  animation: `float-y 3s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            );
          })}
      </svg>
    </div>
  );
}