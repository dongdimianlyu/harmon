import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 shadow-[0_12px_35px_rgba(3,7,17,0.45)] backdrop-blur-md transition-all duration-200 focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white/10 focus-visible:shadow-[0_18px_40px_rgba(107,140,255,0.35)] disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
