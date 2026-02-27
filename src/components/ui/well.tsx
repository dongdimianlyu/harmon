import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface WellProps {
  children: ReactNode;
  className?: string;
  depth?: "sm" | "default" | "deep";
}

export function Well({ children, className, depth = "default" }: WellProps) {
  const depthStyles = {
    sm: "shadow-neumorph-inset-sm",
    default: "shadow-neumorph-inset",
    deep: "shadow-neumorph-inset-deep",
  };

  return (
    <div
      className={cn(
        "rounded-[24px] bg-[var(--color-background)] p-6",
        depthStyles[depth],
        className
      )}
    >
      {children}
    </div>
  );
}
