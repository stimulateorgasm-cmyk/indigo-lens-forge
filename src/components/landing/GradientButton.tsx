import * as React from "react";
import { cn } from "@/lib/utils";

export const GradientButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function GradientButton({ className, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex h-14 items-center justify-center rounded-full px-8 text-base font-medium tracking-tight",
        "cta-gradient text-primary-foreground",
        "transition-all duration-300 hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      style={{ animation: "shimmer 6s linear infinite" }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow:
            "0 0 50px 0 color-mix(in oklab, var(--magenta) 65%, transparent)",
        }}
      />
    </button>
  );
});