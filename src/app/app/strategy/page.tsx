"use client";

import { useState, useMemo } from "react";
import { useProfileStore } from "@/store/profile-store";
import {
  calculateProfileScores,
  determineCluster,
  analyzeProfileGaps,
  generateHighROIMoves,
  generateWhatIfScenarios,
} from "@/lib/scoring";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ScoreRing } from "@/components/ui/score-ring";
import { Toggle } from "@/components/ui/toggle";
import {
  Target,
  AlertCircle,
  Zap,
  Clock,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function StrategyLabPage() {
  const profile = useProfileStore((s) => s.profile);
  const scores = calculateProfileScores(profile);
  const cluster = determineCluster(profile);
  const gaps = analyzeProfileGaps(profile);
  const moves = generateHighROIMoves(profile);
  const initialScenarios = generateWhatIfScenarios(profile);

  const [scenarios, setScenarios] = useState(initialScenarios);

  const toggleScenario = (id: string) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const simulatedScores = useMemo(() => {
    let compositeBoost = 0;
    let diffBoost = 0;
    for (const s of scenarios) {
      if (s.enabled) {
        compositeBoost += s.compositeChange;
        diffBoost += s.differentiationChange;
      }
    }
    return {
      composite: Math.min(scores.composite + compositeBoost, 100),
      differentiation: Math.min(scores.differentiation + diffBoost, 100),
    };
  }, [scenarios, scores]);

  const hasActiveScenarios = scenarios.some((s) => s.enabled);

  const activeScenarios = scenarios.filter((s) => s.enabled);
  const totalCompositeDelta = activeScenarios.reduce((sum, s) => sum + s.compositeChange, 0);
  const totalDifferentiationDelta = activeScenarios.reduce(
    (sum, s) => sum + s.differentiationChange,
    0
  );

  const impactBadge = (value: number) => {
    if (value >= 22) {
      return {
        label: "High Leverage",
        activeClass: "text-success border-success/40 bg-success/10",
        inactiveClass: "text-emerald-700 border-emerald-100 bg-emerald-50",
      };
    }
    if (value >= 12) {
      return {
        label: "Meaningful Lift",
        activeClass: "text-warning border-warning/40 bg-warning/10",
        inactiveClass: "text-amber-700 border-amber-100 bg-amber-50",
      };
    }
    return {
      label: "Quick Win",
      activeClass: "text-muted-foreground border-border/70 bg-background/60",
      inactiveClass: "text-slate-700 border-slate-200 bg-slate-50",
    };
  };

  const severityColor = (severity: number) => {
    if (severity >= 75) return "danger" as const;
    if (severity >= 50) return "warning" as const;
    return "accent" as const;
  };

  const severityLabel = (severity: number) => {
    if (severity >= 75) return "Critical";
    if (severity >= 50) return "Moderate";
    return "Low";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Strategy Lab</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Deep analytical engine for admissions positioning and optimization
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Cluster & Differentiation Analysis */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="overflow-hidden">
            <div className="relative rounded-3xl border border-white/20 ring-1 ring-white/25 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900/60 p-6 text-white">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
              <div className="relative z-10 grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/60">Cluster Snapshot</p>
                      <p className="text-sm text-white/70">How you stack up in your archetype</p>
                    </div>
                    <div className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold"> <Target size={14} className="inline text-sky-200 mr-1" /> Live data</div>
                  </div>
                  <div className="rounded-2xl border border-white/30 bg-white/5 px-4 py-3 text-lg font-semibold shadow-inner shadow-black/30">
                    {cluster.label}
                    <span className="ml-2 text-xs font-normal text-white/60">{cluster.saturation}% saturation</span>
                  </div>
                  {[{
                    label: "Composite Percentile",
                    value: `${scores.composite}th`,
                    percent: scores.composite,
                    color: "from-emerald-400 to-teal-300",
                  }, {
                    label: "Differentiation Percentile",
                    value: `${scores.differentiation}th`,
                    percent: scores.differentiation,
                    color: "from-sky-400 to-indigo-400",
                  }, {
                    label: "Cluster Saturation",
                    value: `${cluster.saturation}%`,
                    percent: cluster.saturation,
                    color: cluster.saturation > 70 ? "from-rose-500 to-orange-400" : "from-amber-400 to-yellow-300",
                  }].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                        <span>{stat.label}</span>
                        <span className="font-semibold text-white">{stat.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                          style={{ width: `${stat.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/5/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/60 mb-3">
                    Profile Elements Heatmap
                  </p>
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {profile.activities.map((act) => {
                      const isStandout =
                        act.initiativeOwnership ||
                        act.leadershipLevel === "founder" ||
                        act.leadershipLevel === "president" ||
                        act.impactScope === "national" ||
                        act.impactScope === "international";
                      return (
                        <div
                          key={act.id}
                          className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
                            isStandout
                              ? "border-emerald-400/30 bg-emerald-400/5"
                              : "border-white/10 bg-white/5"
                          }`}
                        >
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                              isStandout ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10 text-white/70"
                            }`}
                          >
                            {isStandout ? "★" : "•"}
                          </span>
                          <span className={isStandout ? "font-semibold" : "text-white/70"}>{act.title}</span>
                          {isStandout && (
                            <Badge variant="success" className="ml-auto text-[10px]">
                              Standout
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Scores */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full">
            <div className="rounded-3xl border border-white/20 ring-1 ring-white/25 bg-gradient-to-b from-slate-900 to-slate-900/70 p-6 text-white">
              <CardHeader title="Current Position" subtitle="Based on profile data" />
              <div className="mt-3 flex flex-wrap justify-center gap-6">
                <ScoreRing score={scores.composite} size={110} strokeWidth={10} label="Composite" />
                <ScoreRing score={scores.differentiation} size={110} strokeWidth={10} label="Differentiation" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-white/70">
                <div className="rounded-2xl border border-white/25 bg-white/5 p-3 shadow-inner shadow-black/20">
                  <p className="uppercase tracking-[0.25em] text-[10px]">Trend</p>
                  <div className="mt-2 flex items-center gap-2 text-white">
                    <ArrowDownRight size={14} className={scores.trend === "declining" ? "text-rose-400" : "text-emerald-300"} />
                    <span className="text-sm font-semibold capitalize">{scores.trend}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-3">
                  <p className="uppercase tracking-[0.25em] text-[10px]">Cluster tier</p>
                  <div className="mt-2 flex items-center gap-2 text-white">
                    <ShieldCheck size={14} className="text-amber-300" />
                    <span className="text-sm font-semibold">{cluster.saturation > 70 ? "Highly competitive" : "Emerging"}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Gaps */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="overflow-hidden">
            <CardHeader
              title="Profile Gaps"
              subtitle="Areas requiring strategic attention"
              action={<AlertCircle size={18} className="text-muted-foreground" />}
            />
            <div className="rounded-3xl border border-white/20 ring-1 ring-white/10 bg-gradient-to-b from-slate-950 to-slate-900/70 p-5 text-white">
              <div className="divide-y divide-white/10">
                {gaps.map((gap) => (
                  <div key={gap.category} className="space-y-3 py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{gap.category}</span>
                      <Badge
                        variant={gap.severity >= 75 ? "accent" : gap.severity >= 50 ? "default" : "outline"}> 

                        {severityLabel(gap.severity)} — {gap.severity}%
                      </Badge>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${
                          severityColor(gap.severity) === "danger"
                            ? "bg-gradient-to-r from-rose-500 to-orange-400"
                            : severityColor(gap.severity) === "warning"
                            ? "bg-gradient-to-r from-amber-400 to-yellow-300"
                            : "bg-gradient-to-r from-sky-400 to-indigo-400"
                        }`}
                        style={{ width: `${gap.severity}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {gap.suggestedAction}
                    </p>
                  </div>
                ))}
              </div>
              {gaps.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No significant gaps detected. Your profile is well-rounded.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* High-ROI Activity Recommendations */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="overflow-hidden">
            <CardHeader
              title="High-ROI Activity Recommendations"
              subtitle="Ranked by estimated differentiation impact"
              action={<Zap size={18} className="text-muted-foreground" />}
            />
            <div className="rounded-3xl border border-white/20 ring-1 ring-white/10 bg-slate-950/80 p-4">
              <div className="divide-y divide-white/10">
                {moves.map((move, i) => (
                  <div
                    key={move.id}
                    className="group relative overflow-hidden py-4 first:pt-0 last:pb-0"
                  >
                    <div className="absolute inset-0 opacity-30 blur-3xl bg-gradient-to-r from-accent to-transparent" />
                    <div className="relative flex items-start gap-3 text-white">
                      <div className="w-8 h-8 rounded-xl border border-white/15 flex items-center justify-center shrink-0 mt-0.5 font-semibold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold mb-1">{move.title}</p>
                        <p className="text-xs text-white/70 leading-relaxed mb-2">
                          {move.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <div className="flex items-center gap-1 text-emerald-300">
                            <ArrowUpRight size={12} />
                            <span className="font-semibold">+{move.estimatedImpact}% differentiation</span>
                          </div>
                          <div className="flex items-center gap-1 text-white/70">
                            <Clock size={12} />
                            <span className="capitalize">{move.timeIntensity} effort</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* What-If Simulator */}
        <div className="col-span-12">
          <Card>
            <CardHeader
              title="What-If Simulator"
              subtitle="Toggle scenarios to see projected impact on your scores"
              action={<SlidersHorizontal size={18} className="text-muted-foreground" />}
            />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-7">
                <div className="space-y-4">
                  {scenarios.map((scenario) => {
                    const isEnabled = scenario.enabled;
                    const impactScore = scenario.compositeChange + scenario.differentiationChange;
                    const impactMeta = impactBadge(impactScore);
                    const badgeClass = isEnabled ? impactMeta.activeClass : impactMeta.inactiveClass;
                    return (
                      <div
                        key={scenario.id}
                        className={`group relative overflow-hidden rounded-2xl border ring-1 ring-white/15 transition-all ${
                          isEnabled
                            ? "border-accent/40 bg-accent/5 shadow-[0_18px_65px_-30px_rgba(15,118,110,0.8)]"
                            : "border-slate-800/80 bg-gradient-to-br from-[#101828] via-[#0b1220] to-[#050915] shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)]"
                        }`}
                      >
                        <div
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-60"
                          style={{
                            background:
                              "radial-gradient(circle at top right, rgba(15,118,110,0.18), transparent 55%)",
                          }}
                        />
                        <div className="relative flex flex-col gap-4 p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p
                                  className={`text-sm font-semibold ${
                                    isEnabled ? "text-foreground" : "text-slate-100"
                                  }`}
                                >
                                  {scenario.label}
                                </p>
                                <span
                                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badgeClass}`}
                                >
                                  {impactMeta.label}
                                </span>
                              </div>
                              <p
                                className={`text-xs mt-1 leading-relaxed ${
                                  isEnabled ? "text-muted-foreground" : "text-slate-400"
                                }`}
                              >
                                {scenario.description}
                              </p>
                            </div>
                            <Toggle
                              enabled={isEnabled}
                              onChange={() => toggleScenario(scenario.id)}
                            />
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                            <div
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 ${
                                isEnabled
                                  ? "border-success/30 bg-success/10 text-success"
                                  : "border-slate-700 bg-[#11182a] text-slate-100"
                              }`}
                            >
                              <ArrowUpRight size={12} />
                              <span>+{scenario.compositeChange} composite</span>
                            </div>
                            <div
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 ${
                                isEnabled
                                  ? "border-accent/30 bg-accent/10 text-accent"
                                  : "border-slate-700 bg-[#11182a] text-slate-100"
                              }`}
                            >
                              <ArrowUpRight size={12} />
                              <span>+{scenario.differentiationChange} differentiation</span>
                            </div>
                            {isEnabled && (
                              <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
                                Applied to projection
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5">
                <div className="sticky top-8">
                  <div className="rounded-2xl border border-white/15 ring-1 ring-white/20 bg-gradient-to-br from-slate-900/5 via-background to-background p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Scenario Outlook
                        </p>
                        <p className="text-base font-semibold text-foreground">
                          {hasActiveScenarios ? "Simulation in progress" : "Baseline view"}
                        </p>
                      </div>
                      <Badge
                        variant={hasActiveScenarios ? "success" : "outline"}
                        className="text-[11px]"
                      >
                        {hasActiveScenarios
                          ? `${activeScenarios.length} active`
                          : "No scenarios"}
                      </Badge>
                    </div>
                    <div className="mt-5 flex flex-wrap justify-center gap-6">
                      <ScoreRing
                        score={simulatedScores.composite}
                        size={100}
                        strokeWidth={8}
                        label="Composite"
                      />
                      <ScoreRing
                        score={simulatedScores.differentiation}
                        size={100}
                        strokeWidth={8}
                        label="Differentiation"
                      />
                    </div>
                    <div className="mt-6 space-y-4">
                      {[{
                        label: "Composite",
                        baseline: scores.composite,
                        projected: simulatedScores.composite,
                        color: "accent",
                      }, {
                        label: "Differentiation",
                        baseline: scores.differentiation,
                        projected: simulatedScores.differentiation,
                        color: "success",
                      }].map((metric) => (
                        <div key={metric.label} className="rounded-xl border border-white/15 bg-background/90 p-4">
                          <div className="flex items-center justify-between text-sm font-semibold">
                            <span>{metric.label}</span>
                            <span>
                              {metric.baseline}
                              <span className="mx-1 text-muted-foreground">→</span>
                              {metric.projected}
                            </span>
                          </div>
                          <div className="mt-3 space-y-2 text-xs">
                            <div className="flex items-center justify-between text-muted-foreground">
                              <span>Current</span>
                              <span>{metric.baseline}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted/60">
                              <div
                                className={`h-full rounded-full ${
                                  metric.color === "accent" ? "bg-accent" : "bg-success"
                                }/60`}
                                style={{ width: `${metric.baseline}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-muted-foreground">
                              <span>Projected</span>
                              <span
                                className={`font-semibold ${
                                  metric.color === "accent" ? "text-accent" : "text-success"
                                }`}
                              >
                                {metric.projected}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted/40">
                              <div
                                className={`h-full rounded-full ${
                                  metric.color === "accent" ? "bg-accent" : "bg-success"
                                }`}
                                style={{ width: `${metric.projected}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 rounded-2xl border border-dashed border-white/20 p-4">
                      {hasActiveScenarios ? (
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {activeScenarios.map((scenario) => (
                              <Badge
                                key={scenario.id}
                                variant="outline"
                                className="border-accent/40 text-foreground"
                              >
                                {scenario.label}
                              </Badge>
                            ))}
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Composite delta</span>
                              <span className="font-semibold text-success flex items-center gap-1">
                               <ArrowUpRight size={14} />+{totalCompositeDelta}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Differentiation delta</span>
                              <span className="font-semibold text-accent flex items-center gap-1">
                                <ArrowUpRight size={14} />+{totalDifferentiationDelta}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center">
                          Toggle scenarios to stack moves and preview their combined lift.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
