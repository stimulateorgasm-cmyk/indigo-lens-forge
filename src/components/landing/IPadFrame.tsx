import { Play } from "lucide-react";
import heroVideo from "@/assets/hero-loop.mp4.asset.json";
import heroPoster from "@/assets/hero-poster.jpg";

export function IPadFrame() {
  return (
    <div className="relative mx-auto w-full max-w-[1040px] [perspective:2000px]">
      {/* Halo */}
      <div
        className="pointer-events-none absolute -inset-x-32 -inset-y-24 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--magenta) 40%, transparent), transparent 70%), radial-gradient(40% 40% at 30% 60%, color-mix(in oklab, var(--violet) 35%, transparent), transparent 70%), radial-gradient(35% 35% at 75% 40%, color-mix(in oklab, var(--cyan) 22%, transparent), transparent 70%)",
          filter: "blur(40px)",
          animation: "halo-pulse 7s ease-in-out infinite",
        }}
      />

      {/* iPad body */}
      <div
        className="relative rounded-[42px] p-[10px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7)]"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.42 0.02 280), oklch(0.22 0.02 280) 40%, oklch(0.12 0.02 280))",
          boxShadow:
            "inset 0 0 0 1px color-mix(in oklab, white 14%, transparent), inset 0 1px 0 color-mix(in oklab, white 25%, transparent), 0 60px 120px -30px rgba(0,0,0,0.7)",
        }}
      >
        <div
          className="relative overflow-hidden rounded-[34px]"
          style={{
            background: "oklch(0.08 0.03 280)",
            boxShadow: "inset 0 0 0 1px color-mix(in oklab, white 6%, transparent)",
          }}
        >
          <div className="aspect-[4/3] w-full">
            <video
              className="h-full w-full object-cover"
              src={heroVideo.url}
              poster={heroPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Абстрактная визуализация"
            />
          </div>

          {/* Top glare */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3 mix-blend-screen opacity-50"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, white 22%, transparent), transparent)",
            }}
          />

          {/* Play button */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div
              className="grid h-20 w-20 place-items-center rounded-full glass-strong"
              style={{ animation: "float-y 5s ease-in-out infinite" }}
            >
              <Play className="h-7 w-7 translate-x-0.5 fill-foreground text-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto mt-2 h-24 w-[92%] opacity-40"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--magenta) 35%, transparent), transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}