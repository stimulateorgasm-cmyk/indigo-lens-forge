import * as React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, Props>(
  function FloatingLabelInput({ label, id, className, ...props }, ref) {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    return (
      <div className={cn("group relative pt-5", className)}>
        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          className={cn(
            "peer block w-full appearance-none border-0 border-b bg-transparent px-0 pb-3 pt-2",
            "text-base text-foreground placeholder-transparent",
            "border-[color-mix(in_oklab,white_14%,transparent)]",
            "focus:border-[color-mix(in_oklab,var(--magenta)_70%,transparent)] focus:outline-none focus:ring-0",
            "transition-colors",
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-0 top-6 origin-left text-sm text-muted-foreground transition-all duration-200",
            "peer-focus:top-0 peer-focus:scale-90 peer-focus:text-foreground",
            "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-90",
          )}
        >
          {label}
        </label>
        {/* Animated underline */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-px w-0 transition-all duration-500 peer-focus:w-full"
          style={{ background: "var(--gradient-cta)" }}
        />
      </div>
    );
  },
);