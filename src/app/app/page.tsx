"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profile-store";
import {
  calculateProfileScores,
  determineCluster,
  generateAlerts,
  generateHighROIMoves,
  generateStrengthTiles,
} from "@/lib/scoring";
import { Card, CardHeader } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Well } from "@/components/ui/well";
import type { StrengthTile } from "@/types/profile";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Zap,
  Clock,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const profile = useProfileStore((s) => s.profile);
  const scores = calculateProfileScores(profile);
  const cluster = determineCluster(profile);
  const alerts = generateAlerts(profile);
  const moves = generateHighROIMoves(profile);
  const strengthTiles = generateStrengthTiles(profile);
  const [selectedTile, setSelectedTile] = useState<StrengthTile | null>(null);

  const TrendIcon =
    scores.trend === "rising"
      ? TrendingUp
      : scores.trend === "declining"
      ? TrendingDown
      : Minus;

  const trendColor =
    scores.trend === "rising"
      ? "text-[var(--color-accent-secondary)]"
      : scores.trend === "declining"
      ? "text-red-500"
      : "text-[var(--color-muted)]";

  const trendLabel =
    scores.trend === "rising"
      ? "Upward trajectory"
      : scores.trend === "declining"
      ? "Needs attention"
      : "Holding steady";

  const severityVariant = (s: string) => {
    if (s === "critical") return "danger" as const;
    if (s === "high") return "warning" as const;
    if (s === "medium") return "info" as const;
    return "default" as const;
  };

  const priorityVariant = (p: string) => {
    if (p === "essential") return "danger" as const;
    if (p === "recommended") return "info" as const;
    return "default" as const;
  };

  const timeLabel = (t: string) => {
    if (t === "low") return "Low effort";
    if (t === "medium") return "Moderate effort";
    return "Significant effort";
  };

  return (
    <div>
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-[var(--color-foreground)] font-display tracking-tight">Dashboard</h1>
        <p className="text-[var(--color-muted)] font-medium mt-2 text-lg">
          Strategic overview of your admissions positioning
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Profile Strength Index */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4">
          <Card className="h-full" padding="lg">
            <CardHeader
              title="Profile Strength Index"
              subtitle="Tiered snapshot of your readiness pillars"
            />
            <div className="grid grid-cols-2 gap-4">
              {strengthTiles.map((tile) => {
                const tierDisplay = tile.tier ?? "?";
                return (
                  <div
                    key={tile.key}
                    onClick={() => setSelectedTile(tile)}
                    className="p-5 rounded-2xl bg-[var(--color-background)] shadow-neumorph hover:shadow-neumorph-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col gap-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                        {tile.label}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-extrabold font-display text-[var(--color-foreground)]">
                        {tierDisplay}
                      </span>
                      <span className="text-xs font-bold text-[var(--color-muted)] pb-1">
                        {tile.tier}/100
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedTile && (
              <Well depth="deep" className="mt-6 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-[var(--color-foreground)] capitalize tracking-wider">
                    {selectedTile.label} Focus
                  </h4>
                  <Badge variant="outline" className="text-[10px]">
                    Tier {selectedTile.tier}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--color-muted)] font-medium leading-relaxed">
                  {selectedTile.explanation}
                </p>
              </Well>
            )}
          </Card>
        </div>

        {/* Main Insights Column */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          {/* Topline Metrics */}
          <Card padding="lg">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="shrink-0 relative">
                <Well depth="deep" className="p-4 rounded-full flex items-center justify-center">
                  <ScoreRing score={scores.composite} size={140} strokeWidth={12} />
                </Well>
              </div>

              <div className="flex-1 space-y-8 w-full">
                <div>
                  <h2 className="text-2xl font-extrabold font-display tracking-tight text-[var(--color-foreground)] mb-2">
                    Composite Competitiveness
                  </h2>
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="text-sm py-1.5 px-4 shadow-neumorph-sm">
                      Top {100 - scores.composite}%
                    </Badge>
                    <div className={`flex items-center gap-1.5 text-sm font-bold ${trendColor}`}>
                      <TrendIcon size={18} strokeWidth={2.5} />
                      {trendLabel}
                    </div>
                  </div>
                </div>

                <Well depth="default" className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-muted)] mb-1">Cluster Identity</p>
                      <p className="text-sm font-bold text-[var(--color-foreground)]">Your competitive positioning</p>
                    </div>
                    <Badge variant="accent" className="text-xs">
                      <Layers size={14} className="mr-1.5 inline" />
                      Cluster Insight
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="rounded-xl shadow-neumorph-inset-sm bg-[var(--color-background)] px-4 py-2 text-lg font-extrabold font-display text-[var(--color-accent)]">
                      {cluster.label}
                    </div>
                    <div className="rounded-xl shadow-neumorph-sm bg-[var(--color-background)] px-4 py-2 text-xs font-bold text-[var(--color-foreground)] flex items-center">
                      <Sparkles size={14} className="mr-2 text-[var(--color-accent-secondary)]" />
                      Diff. Focus • {scores.differentiation}th %
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                      <span>Competitive Saturation</span>
                      <span className="text-[var(--color-foreground)]">{cluster.saturation}%</span>
                    </div>
                    <ProgressBar value={cluster.saturation} size="lg" color={cluster.saturation > 70 ? "danger" : cluster.saturation > 50 ? "warning" : "success"} />
                  </div>

                  <p className="text-sm font-medium leading-relaxed text-[var(--color-muted)] mt-5 pt-5 border-t border-[var(--color-muted)]/20 shadow-[0_-1px_1px_rgba(255,255,255,0.5)]">
                    {cluster.insight}
                  </p>
                </Well>
              </div>
            </div>
          </Card>

          {/* Strategic Alerts & Moves */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card padding="lg">
              <CardHeader
                title="Strategic Alerts"
                subtitle="Priority areas requiring attention"
                action={<Badge variant="outline">{alerts.length} active</Badge>}
              />
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--color-background)] shadow-neumorph-inset-sm"
                  >
                    <div className="mt-1 p-2 rounded-xl shadow-neumorph-sm bg-[var(--color-background)]">
                      <AlertTriangle
                        size={18}
                        className={
                          alert.severity === "critical"
                            ? "text-red-500"
                            : alert.severity === "high"
                            ? "text-amber-500"
                            : "text-blue-500"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-sm font-bold text-[var(--color-foreground)]">
                          {alert.title}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[var(--color-muted)] leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <Well depth="default" className="py-8 flex items-center justify-center">
                    <p className="text-sm font-medium text-[var(--color-muted)]">
                      No critical alerts. Your profile is well-positioned.
                    </p>
                  </Well>
                )}
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader
                title="High-ROI Moves"
                subtitle="Ranked actions by estimated impact"
              />
              <div className="space-y-4">
                {moves.map((move, index) => (
                  <div
                    key={move.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--color-background)] shadow-neumorph group hover:shadow-neumorph-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl shadow-neumorph-inset flex items-center justify-center shrink-0 mt-0.5 bg-[var(--color-background)]">
                      <span className="text-sm font-extrabold font-display text-[var(--color-accent)]">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-sm font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                          {move.title}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[var(--color-muted)] leading-relaxed mb-3">
                        {move.description}
                      </p>
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-1.5">
                          <Zap size={14} className="text-[var(--color-accent)]" />
                          <span className="text-xs font-bold text-[var(--color-accent)]">
                            +{move.estimatedImpact}% impact
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-[var(--color-muted)]" />
                          <span className="text-xs font-bold text-[var(--color-muted)]">
                            {timeLabel(move.timeIntensity)}
                          </span>
                        </div>
                        <ArrowRight size={14} className="text-[var(--color-muted)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
