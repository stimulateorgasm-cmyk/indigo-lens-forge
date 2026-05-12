import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { NebulaBackground } from "@/components/landing/NebulaBackground";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { SplitRealitySection } from "@/components/landing/SplitRealitySection";
import { ConversionSection } from "@/components/landing/ConversionSection";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "INDIGO — Психология бизнеса. Скрытая прибыль" },
      {
        name: "description",
        content:
          "INDIGO — программа для собственников: превращаем психологическое напряжение команды в измеримый рост прибыли.",
      },
      { property: "og:title", content: "INDIGO — Психология бизнеса" },
      {
        property: "og:description",
        content:
          "Разблокируйте скрытую прибыль. Программа стабилизации команды и лидера.",
      },
      { property: "og:image", content: "/src/assets/og-cover.jpg" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <main className="relative overflow-x-hidden">
      <NebulaBackground />
      <SiteHeader />
      <HeroSection />
      <SplitRealitySection />
      <ConversionSection />
      <SiteFooter />
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "color-mix(in oklab, white 6%, transparent)",
            backdropFilter: "blur(20px)",
            border: "1px solid color-mix(in oklab, white 12%, transparent)",
            color: "var(--foreground)",
          },
        }}
      />
    </main>
  );
}
