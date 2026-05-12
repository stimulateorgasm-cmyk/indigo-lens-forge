import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "neutral" | "pain" | "solution";
}

export function GlassCard({
  className,
  tone = "neutral",
  children,
  ...props
}: GlassCardProps) {
  const toneRing =
    tone === "pain"
      ? "before:bg-[radial-gradient(60%_60%_at_0%_0%,color-mix(in_oklab,var(--pain)_30%,transparent),transparent_70%)]"
      : tone === "solution"
        ? "before:bg-[radial-gradient(60%_60%_at_100%_0%,color-mix(in_oklab,var(--violet)_35%,transparent),transparent_70%)]"
        : "before:bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--magenta)_22%,transparent),transparent_70%)]";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl glass p-7 transition-all duration-500",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-40 before:transition-opacity before:duration-500 group-hover:before:opacity-80",
        "hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,white_18%,transparent)]",
        toneRing,
        className,
      )}
      {...props}
    >
      <div className="relative">{children}</div>
    </div>
  );
}