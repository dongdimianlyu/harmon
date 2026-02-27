import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hoverable?: boolean;
}

export function Card({ children, className, padding = "md", hoverable = false }: CardProps) {
  const paddingMap = {
    none: "p-0",
    sm: "p-6",
    md: "p-8",
    lg: "p-12",
    xl: "p-16 md:p-20",
  };
  
  return (
    <div
      className={cn(
        "bg-[var(--color-background)] rounded-[32px] shadow-neumorph transition-all duration-300 ease-out",
        hoverable && "hover:-translate-y-1 hover:shadow-neumorph-hover cursor-pointer",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between mb-8", className)}>
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)] mb-2 font-display">{title}</h3>
        {subtitle && (
          <p className="text-[var(--color-muted)] font-medium">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
