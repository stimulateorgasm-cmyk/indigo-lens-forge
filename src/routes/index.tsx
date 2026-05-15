import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import ogCover from "@/assets/og-cover.jpg";
import { NebulaBackground } from "@/components/landing/NebulaBackground";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { LeadFormSection } from "@/components/landing/LeadFormSection";
import { AmplitudeSection } from "@/components/landing/AmplitudeSection";
import { MethodAdvantagesSection } from "@/components/landing/MethodAdvantagesSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { ResearchSection } from "@/components/landing/ResearchSection";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { useTrackPageVisit } from "@/hooks/useTrackPageVisit";

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
      { property: "og:image", content: ogCover },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  useTrackPageVisit();
  return (
    <main className="relative overflow-x-hidden">
      <NebulaBackground />
      <SiteHeader />
      <HeroSection />
      <LeadFormSection id="lead-top" variant="top" />
      <AmplitudeSection />
      <MethodAdvantagesSection />
      <TestimonialSection />
      <ResearchSection />
      <LeadFormSection id="lead-bottom" variant="bottom" />
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
