import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70 shadow-[0_12px_35px_rgba(3,7,17,0.45)] backdrop-blur-md transition-all duration-200 focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white/10 focus-visible:shadow-[0_18px_40px_rgba(107,140,255,0.35)] disabled:cursor-not-allowed disabled:opacity-60",
          "[background-image:linear-gradient(45deg,transparent_50%,rgba(248,251,255,0.6)_50%),linear-gradient(135deg,rgba(248,251,255,0.6)_50%,transparent_50%)]",
          "[background-position:calc(100%-18px)_calc(50%-2px),calc(100%-12px)_calc(50%-2px)]",
          "[background-size:6px_6px,6px_6px]",
          "[background-repeat:no-repeat]",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
