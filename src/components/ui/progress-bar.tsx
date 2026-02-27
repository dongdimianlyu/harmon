import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning" | "danger" | "accent";
  showLabel?: boolean;
  className?: string;
}

const colorMap = {
  primary: "bg-[var(--color-primary)]",
  success: "bg-[var(--color-accent-secondary)]",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  accent: "bg-[var(--color-accent)]",
};

const sizeMap = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  color = "accent",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full bg-[var(--color-background)] rounded-full shadow-neumorph-inset-sm overflow-hidden p-0.5", sizeMap[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out shadow-neumorph-sm", colorMap[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-bold text-[var(--color-muted)] mt-1.5 block text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
