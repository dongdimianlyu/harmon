import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white shadow-neumorph hover:-translate-y-[1px] hover:shadow-neumorph-hover active:translate-y-[0.5px] active:shadow-neumorph-inset-sm",
  secondary:
    "bg-[var(--color-background)] text-[var(--color-foreground)] shadow-neumorph hover:-translate-y-[1px] hover:shadow-neumorph-hover active:translate-y-[0.5px] active:shadow-neumorph-inset-sm",
  ghost:
    "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-background)] hover:shadow-neumorph-sm active:shadow-neumorph-inset-sm",
  icon:
    "bg-[var(--color-background)] text-[var(--color-foreground)] shadow-neumorph-sm hover:-translate-y-[1px] hover:shadow-neumorph active:translate-y-[0.5px] active:shadow-neumorph-inset-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base font-medium",
  lg: "px-8 py-4 text-lg font-bold",
  icon: "p-3 h-12 w-12",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
}
