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
      ? "text-success"
      : scores.trend === "declining"
      ? "text-danger"
      : "text-muted-foreground";

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Strategic overview of your admissions positioning
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Profile Strength Index */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4">
          <Card className="h-full">
            <CardHeader
              title="Profile Strength Index"
              subtitle="Tiered snapshot of your readiness pillars"
            />
            <div className="grid grid-cols-2 gap-3">
              {strengthTiles.map((tile) => {
                const tierDisplay = tile.tier ?? "?";
                return (
                  <div
                    key={tile.key}
                    className="group rounded-3xl border border-white/10 bg-gradient-to-br from-[#11121a] via-[#0a0c12] to-[#05060a] text-white shadow-[0_18px_45px_-35px_rgba(15,23,42,1)] overflow-hidden"
                  >
                    <div className="relative p-4 pb-5 min-h-[150px] flex flex-col justify-between">
                      <div
                        className="pointer-events-none absolute -top-6 -right-6 h-28 w-28 opacity-70 blur-sm"
                        style={{ background: `radial-gradient(circle, ${tile.accent[0]}, transparent)` }}
                      />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-white/70">{tile.label}</p>
                          <p className="text-[11px] text-white/50">{tile.description}</p>
                        </div>
                        <span className="inline-flex items-center rounded-full border border-white/20 px-2 py-0.5 text-[11px] font-semibold text-white/80">
                          Tier
                        </span>
                      </div>
                      <div className="mt-6 text-center">
                        <span className="text-4xl font-bold tracking-tight">
                          {typeof tierDisplay === "number" ? tierDisplay : tierDisplay}
                        </span>
                        {typeof tierDisplay === "number" && (
                          <span className="text-sm text-white/40 ml-1">/5</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="w-full bg-black/70 text-center py-2 text-xs font-semibold tracking-wide text-white/80 transition group-hover:bg-black/80"
                      onClick={() => setSelectedTile(tile)}
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
            <div className={`mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-3 py-2 ${trendColor}`}>
              <TrendIcon size={16} />
              <span className="text-sm font-medium text-white">{trendLabel}</span>
            </div>
            <div className="mt-4 rounded-3xl border border-white/10 bg-gradient-to-b from-black/60 to-black/80 p-4 text-white">
              {selectedTile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/60">Selected Pillar</p>
                      <p className="text-lg font-semibold">{selectedTile.label}</p>
                    </div>
                    <span className="rounded-full border border-white/20 px-2 py-0.5 text-[11px] font-semibold text-white/80">
                      {selectedTile.tier ? `Tier ${selectedTile.tier}` : "Unrated"}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-white/60 mb-1">Why this tier</p>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {selectedTile.explanation}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-white/60 mb-1">Strategic move</p>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {selectedTile.strategicMove}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-white/70 text-center py-4">
                  Tap “View Details” on any pillar to see why it earned its tier and the highest leverage upgrade.
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* Cluster Identity Card */}
          <Card className="h-full overflow-hidden">
            <div className="relative rounded-[30px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-900/30 p-6 text-white shadow-[0_35px_120px_-60px_rgba(15,23,42,1)]">
              <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]" />
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Cluster Identity</p>
                    <p className="text-sm text-white/70">Your competitive positioning among applicant pools</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/80">
                    <Layers size={14} className="text-sky-200" />
                    <span>Cluster Insight</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-lg font-semibold text-white shadow-inner">
                    {cluster.label}
                  </div>
                  <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
                    <Sparkles size={12} className="mr-1 inline text-amber-200" />
                    Differentiation focus • {scores.differentiation}th %
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-white/70">
                    <span>Competitive Saturation</span>
                    <span className="font-semibold text-white">{cluster.saturation}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className={`relative h-full rounded-full ${
                        cluster.saturation > 70
                          ? "bg-gradient-to-r from-rose-500 to-orange-400"
                          : cluster.saturation > 50
                          ? "bg-gradient-to-r from-amber-400 to-yellow-300"
                          : "bg-gradient-to-r from-emerald-400 to-teal-300"
                      }`}
                      style={{ width: `${cluster.saturation}%` }}
                    >
                      <span className="absolute -right-2 -top-1 h-4 w-4 rounded-full border-2 border-white bg-white/80" />
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-white/80">
                  {cluster.insight}
                </p>
              </div>
            </div>
          </Card>

          {/* Strategic Alerts */}
          <Card>
            <CardHeader
              title="Strategic Alerts"
              subtitle="Priority areas requiring attention"
              action={
                <Badge variant="outline">{alerts.length} active</Badge>
              }
            />
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className="mt-0.5">
                    <AlertTriangle
                      size={16}
                      className={
                        alert.severity === "critical"
                          ? "text-danger"
                          : alert.severity === "high"
                          ? "text-warning"
                          : "text-info"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        {alert.title}
                      </span>
                      <Badge variant={severityVariant(alert.severity)} className="text-[10px]">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No critical alerts. Your profile is well-positioned.
                </p>
              )}
            </div>
          </Card>

          {/* High-ROI Moves */}
          <Card>
            <CardHeader
              title="High-ROI Moves This Month"
              subtitle="Ranked actions by estimated impact"
            />
            <div className="space-y-3">
              {moves.map((move, index) => (
                <div
                  key={move.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        {move.title}
                      </span>
                      <Badge variant={priorityVariant(move.priority)} className="text-[10px]">
                        {move.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {move.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Zap size={12} className="text-accent" />
                        <span className="text-xs font-medium text-accent">
                          +{move.estimatedImpact}% impact
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {timeLabel(move.timeIntensity)}
                        </span>
                      </div>
                      <ArrowRight size={12} className="text-muted-foreground ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
