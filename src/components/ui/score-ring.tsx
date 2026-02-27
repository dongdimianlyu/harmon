"use client";

import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "var(--color-accent-secondary)"; // Teal
    if (s >= 60) return "var(--color-accent)"; // Violet
    if (s >= 40) return "#fbbf24"; // Amber
    return "#f87171"; // Red
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative rounded-full shadow-neumorph-inset-sm p-1.5 bg-[var(--color-background)]" style={{ width: size + 12, height: size + 12 }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Base Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-background)"
            strokeWidth={strokeWidth}
            className="drop-shadow-[inset_2px_2px_4px_rgba(163,177,198,0.5)]"
          />
          {/* Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out drop-shadow-[0_4px_8px_rgba(108,99,255,0.4)]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold font-display text-[var(--color-foreground)] tracking-tight">{score}</span>
        </div>
      </div>
      {label && (
        <span className="text-sm font-bold text-[var(--color-foreground)] mt-4">{label}</span>
      )}
      {sublabel && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] mt-1">{sublabel}</span>
      )}
    </div>
  );
}
