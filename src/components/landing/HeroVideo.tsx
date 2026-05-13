import { useState } from "react";
import { Play, Youtube, Film, PlaySquare, Cloud } from "lucide-react";
import heroVideo from "@/assets/hero-loop.mp4.asset.json";
import heroPoster from "@/assets/hero-poster.jpg";
import { heroVideoSources, youtubeEmbedUrl } from "@/lib/video-sources";
import { PlatformButton } from "./PlatformButton";

export function HeroVideo() {
  const [playing, setPlaying] = useState(false);
  const sources = heroVideoSources;
  const mp4 = sources.mp4 ?? heroVideo.url;
  const useIframe = !!sources.youtube || !!sources.vk || !!sources.rutube;
  const iframeSrc = sources.youtube
    ? youtubeEmbedUrl(sources.youtube)
    : sources.vk ?? sources.rutube;

  return (
    <div className="relative mx-auto w-full max-w-[1040px]">
      {/* Halo */}
      <div
        className="pointer-events-none absolute -inset-x-32 -inset-y-24 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--magenta) 35%, transparent), transparent 70%), radial-gradient(40% 40% at 30% 60%, color-mix(in oklab, var(--violet) 30%, transparent), transparent 70%), radial-gradient(35% 35% at 75% 40%, color-mix(in oklab, var(--cyan) 20%, transparent), transparent 70%)",
          filter: "blur(40px)",
          animation: "halo-pulse 7s ease-in-out infinite",
        }}
      />

      {/* Frame */}
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
          <div className="aspect-[16/9] w-full">
            {playing && useIframe && iframeSrc ? (
              <iframe
                title="Indigo Lab — промо-видео"
                src={iframeSrc}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                key={playing ? "playing" : "idle"}
                className="h-full w-full object-cover"
                src={mp4}
                poster={heroPoster}
                controls={playing}
                autoPlay={playing}
                muted={!playing}
                loop={!playing}
                playsInline
                preload="metadata"
                aria-label="Промо-видео Indigo Lab"
              />
            )}
          </div>

          {!playing && (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 grid place-items-center focus:outline-none"
              aria-label="Смотреть видео"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-1/3 mix-blend-screen opacity-50"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in oklab, white 22%, transparent), transparent)",
                }}
              />
              <span className="relative z-10 flex flex-col items-center gap-3">
                <span
                  className="grid h-28 w-28 place-items-center rounded-full glass-strong transition-transform duration-300 group-hover:scale-105"
                  style={{
                    boxShadow:
                      "0 20px 60px -10px color-mix(in oklab, var(--magenta) 60%, transparent), inset 0 1px 0 color-mix(in oklab, white 30%, transparent)",
                  }}
                >
                  <Play className="h-12 w-12 translate-x-0.5 fill-foreground text-foreground" />
                </span>
                <span className="text-sm font-medium uppercase tracking-[0.25em] text-foreground/90">
                  Смотреть видео
                </span>
              </span>
            </button>
          )}
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

      {/* Platform buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <PlatformButton
          label="YouTube"
          href={sources.youtube}
          icon={<Youtube className="h-4 w-4" />}
        />
        <PlatformButton
          label="VK Видео"
          href={sources.vk}
          icon={<PlaySquare className="h-4 w-4" />}
        />
        <PlatformButton
          label="Rutube"
          href={sources.rutube}
          icon={<Film className="h-4 w-4" />}
        />
        <PlatformButton
          label="Скачать"
          href={sources.cloud}
          icon={<Cloud className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}