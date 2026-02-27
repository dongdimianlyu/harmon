import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "accent" | "success" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-background)] text-[var(--color-foreground)] shadow-neumorph-sm",
  accent: "bg-[var(--color-accent)] text-white shadow-neumorph-sm",
  success: "bg-[var(--color-accent-secondary)] text-[var(--color-foreground)] shadow-neumorph-sm",
  outline: "bg-[var(--color-background)] text-[var(--color-muted)] shadow-neumorph-inset-sm",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
