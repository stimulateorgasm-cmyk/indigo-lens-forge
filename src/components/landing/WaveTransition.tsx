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

  // Turbulent path (jittered)
  const turbPoints: string[] = [];
  for (let x = 0; x <= 600; x += 12) {
    const noise =
      Math.sin(x * 0.08) * 30 +
      Math.sin(x * 0.21 + 1.3) * 22 +
      Math.sin(x * 0.43 + 2.1) * 14;
    turbPoints.push(`${x},${mid + noise}`);
  }
  const turbPath = "M " + turbPoints.join(" L ");

  // Smooth sine
  const sinePoints: string[] = [];
  for (let x = 600; x <= W; x += 6) {
    const y = mid + Math.sin((x - 600) * 0.025) * 60;
    sinePoints.push(`${x},${y}`);
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

        {/* Turbulent layered paths */}
        {[0, 8, -6, 14, -12].map((off, i) => (
          <path
            key={i}
            d={turbPath}
            fill="none"
            stroke="url(#painGrad)"
            strokeWidth={1 + (i % 2)}
            strokeOpacity={active ? 0.55 - i * 0.08 : 0}
            transform={`translate(0 ${off})`}
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
            const y = mid + Math.sin((x - 600) * 0.025) * 60;
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