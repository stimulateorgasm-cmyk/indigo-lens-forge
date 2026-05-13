import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformButtonProps {
  label: string;
  href?: string;
  icon: React.ReactNode;
  comingSoonLabel?: string;
}

export function PlatformButton({
  label,
  href,
  icon,
  comingSoonLabel = "Скоро",
}: PlatformButtonProps) {
  const disabled = !href;
  const base =
    "group relative inline-flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium transition-all duration-200 sm:w-auto";
  const enabled =
    "text-foreground border border-[color-mix(in_oklab,white_12%,transparent)] bg-[color-mix(in_oklab,white_4%,transparent)] hover:text-white hover:border-transparent hover:shadow-[0_10px_40px_-12px_color-mix(in_oklab,var(--magenta)_55%,transparent)]";
  const inactive =
    "cursor-not-allowed opacity-50 border border-[color-mix(in_oklab,white_8%,transparent)] bg-[color-mix(in_oklab,white_2%,transparent)] text-muted-foreground";

  const content = (
    <>
      {/* Hover gradient overlay (Shumkin Scale style) */}
      {!disabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: "var(--gradient-platform-btn)" }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2.5">
        <span className="grid h-5 w-5 place-items-center">{icon}</span>
        <span>{label}</span>
      </span>
      <span className="relative z-10 flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] opacity-70">
        {disabled ? comingSoonLabel : <ArrowUpRight className="h-4 w-4" />}
      </span>
    </>
  );

  if (disabled) {
    return (
      <button type="button" disabled className={cn(base, inactive)} title={comingSoonLabel}>
        {content}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, enabled, "overflow-hidden")}
    >
      {content}
    </a>
  );
}