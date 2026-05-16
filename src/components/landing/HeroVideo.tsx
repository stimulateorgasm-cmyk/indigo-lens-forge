import { useRef, useState } from "react";
import { Volume2, VolumeX, Youtube, Film, PlaySquare, Cloud } from "lucide-react";
import heroVideo from "@/assets/hero-loop.mp4.asset.json";
import heroPoster from "@/assets/hero-poster.jpg";
import { heroVideoSources, youtubeEmbedUrl } from "@/lib/video-sources";
import { PlatformButton } from "./PlatformButton";

export function HeroVideo() {
  const [unmuted, setUnmuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sources = heroVideoSources;
  const mp4Full = sources.mp4 ?? heroVideo.url;
  const mp4_720 = sources.mp4_720;
  const mp4_480 = sources.mp4_480;
  const hasMp4 = !!(sources.mp4 || sources.mp4_720 || sources.mp4_480);
  const useIframe = !hasMp4 && (!!sources.youtube || !!sources.vk || !!sources.rutube);
  const iframeSrc = sources.youtube
    ? youtubeEmbedUrl(sources.youtube)
    : sources.vk ?? sources.rutube;

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !unmuted;
    v.muted = !next;
    if (next) {
      v.controls = true;
      // Поднимаем приоритет загрузки, когда пользователь явно слушает
      v.setAttribute("fetchpriority", "high");
      void v.play();
    }
    setUnmuted(next);
  };

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
            {unmuted && useIframe && iframeSrc ? (
              <iframe
                title="Indigo Lab — промо-видео"
                src={iframeSrc}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                poster={heroPoster}
                controls={unmuted}
                autoPlay
                muted={!unmuted}
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                disableRemotePlayback
                // @ts-expect-error — нестандартный атрибут, поддержан Chromium
                fetchpriority="low"
                aria-label="Промо-видео Indigo Lab"
              >
                {mp4_480 && (
                  <source src={mp4_480} type="video/mp4" media="(max-width: 768px)" />
                )}
                {mp4_720 && <source src={mp4_720} type="video/mp4" />}
                <source src={mp4Full} type="video/mp4" />
              </video>
            )}
          </div>

          {!unmuted && (
            <button
              type="button"
              onClick={toggleSound}
              className="group absolute bottom-4 right-4 flex items-center gap-2 rounded-full glass-strong px-4 py-2.5 text-sm font-medium text-foreground/90 transition-transform duration-300 hover:scale-105 focus:outline-none"
              style={{
                boxShadow:
                  "0 12px 40px -10px color-mix(in oklab, var(--magenta) 60%, transparent), inset 0 1px 0 color-mix(in oklab, white 30%, transparent)",
              }}
              aria-label="Включить звук"
            >
              <VolumeX className="h-4 w-4" />
              <span className="uppercase tracking-[0.2em] text-xs">Включить звук</span>
            </button>
          )}
          {unmuted && (
            <button
              type="button"
              onClick={toggleSound}
              className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full glass-strong text-foreground/90 transition-transform duration-300 hover:scale-105 focus:outline-none"
              aria-label="Выключить звук"
            >
              <Volume2 className="h-4 w-4" />
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