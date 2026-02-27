import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "block w-full min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 shadow-[0_12px_35px_rgba(3,7,17,0.45)] backdrop-blur-md transition-all duration-200 focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white/10 focus-visible:shadow-[0_18px_40px_rgba(107,140,255,0.35)] disabled:cursor-not-allowed disabled:opacity-60 resize-y",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
