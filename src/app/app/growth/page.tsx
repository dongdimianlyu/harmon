"use client";

import { useProfileStore } from "@/store/profile-store";
import {
  generateGrowthData,
  detectPlateaus,
  generateRoadmap,
} from "@/lib/scoring";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";
import {
  TrendingUp,
  AlertCircle,
  Map,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const metricConfig = [
  {
    chartKey: "Leadership" as const,
    dataKey: "leadershipLevel" as const,
    label: "Leadership Momentum",
    blurb: "Influence & initiative",
    gradient: ["#2563eb", "#60a5fa"],
  },
  {
    chartKey: "Impact" as const,
    dataKey: "impactDepth" as const,
    label: "Impact Depth",
    blurb: "Breadth of outcomes",
    gradient: ["#059669", "#34d399"],
  },
  {
    chartKey: "Initiative" as const,
    dataKey: "initiativeOwnership" as const,
    label: "Initiative Ownership",
    blurb: "Self-started efforts",
    gradient: ["#d97706", "#fbbf24"],
  },
  {
    chartKey: "Academics" as const,
    dataKey: "academicRigor" as const,
    label: "Academic Rigor",
    blurb: "Course intensity",
    gradient: ["#7c3aed", "#c084fc"],
  },
] as const;

const MetricTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-border/70 bg-background/90 p-3 shadow-lg backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-3 space-y-2">
        {payload.map((item: Payload<number, string>) => {
          if (!item?.value) return null;
          const metric = metricConfig.find((m) => m.chartKey === item.dataKey);
          if (!metric) return null;
          return (
            <div key={metric.chartKey} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background: `linear-gradient(120deg, ${metric.gradient[0]}, ${metric.gradient[1]})`,
                  }}
                />
                <span className="font-medium">{metric.label}</span>
              </div>
              <span className="font-semibold text-foreground">{item.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function GrowthTrackerPage() {
  const profile = useProfileStore((s) => s.profile);
  const growthData = generateGrowthData(profile);
  const plateaus = detectPlateaus(growthData);
  const roadmap = generateRoadmap(profile);

  const chartData = growthData.map((d) => ({
    name: `Grade ${d.grade}`,
    Leadership: Math.round(d.leadershipLevel),
    Impact: Math.round(d.impactDepth),
    Initiative: Math.round(d.initiativeOwnership),
    Academics: Math.round(d.academicRigor),
  }));

  const currentGradeIndex = growthData.findIndex(
    (d) => d.grade === profile.gradeLevel
  );

  const activeGradeData =
    currentGradeIndex >= 0 ? growthData[currentGradeIndex] : growthData[growthData.length - 1];
  const previousGradeData = currentGradeIndex > 0 ? growthData[currentGradeIndex - 1] : null;
  const highlightedGradeName = chartData[currentGradeIndex]?.name;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Growth Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Long-term progression analysis and strategic roadmap
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Timeline View */}
        <div className="col-span-12">
          <Card>
            <CardHeader
              title="Growth Timeline (Grades 9–12)"
              subtitle="Progression of key profile dimensions over time"
              action={<TrendingUp size={18} className="text-muted-foreground" />}
            />
            {activeGradeData && (
              <div className="mx-6 mb-3 mt-4 rounded-2xl border border-border/70 bg-gradient-to-r from-background via-accent/5 to-background p-4 shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Current Snapshot
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      Grade {profile.gradeLevel}
                    </p>
                  </div>
                  <Badge variant="default" className="gap-1 text-[11px]">
                    <Sparkles size={14} />
                    Live profile data
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {metricConfig.map((metric) => {
                    const currentValue = Math.round(activeGradeData[metric.dataKey]);
                    const prevValue = previousGradeData
                      ? Math.round(previousGradeData[metric.dataKey])
                      : null;
                    const delta = prevValue !== null ? currentValue - prevValue : null;
                    const deltaPositive = (delta ?? 0) >= 0;
                    return (
                      <div
                        key={metric.chartKey}
                        className="rounded-2xl border border-border/80 bg-background/90 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              background: `linear-gradient(120deg, ${metric.gradient[0]}, ${metric.gradient[1]})`,
                            }}
                          />
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {metric.label}
                          </p>
                        </div>
                        <p className="mt-2 text-2xl font-semibold text-foreground">
                          {currentValue}%
                        </p>
                        <p className="text-xs text-muted-foreground">{metric.blurb}</p>
                        {delta !== null && (
                          <p
                            className={`mt-1 text-xs font-semibold ${
                              deltaPositive ? "text-success" : "text-warning"
                            }`}
                          >
                            {deltaPositive ? "+" : ""}
                            {delta}% vs last grade
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="mt-6 h-[370px] rounded-3xl bg-gradient-to-br from-slate-900/5 via-background to-background/80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    {metricConfig.map((metric) => (
                      <linearGradient
                        key={metric.chartKey}
                        id={`${metric.chartKey}-stroke`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor={metric.gradient[0]} />
                        <stop offset="100%" stopColor={metric.gradient[1]} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#475569" }}
                    axisLine={{ stroke: "#cbd5f5" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#475569" }}
                    axisLine={{ stroke: "#cbd5f5" }}
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<MetricTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
                  {highlightedGradeName && (
                    <ReferenceLine
                      x={highlightedGradeName}
                      strokeWidth={2}
                      strokeDasharray="0"
                      stroke="rgba(15,118,110,0.5)"
                      label={{
                        value: "Current grade",
                        position: "insideTopRight",
                        fill: "#0f766e",
                        fontSize: 12,
                      }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="Leadership"
                    stroke="url(#Leadership-stroke)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#2563eb" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Impact"
                    stroke="url(#Impact-stroke)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#059669" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Initiative"
                    stroke="url(#Initiative-stroke)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#d97706" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Academics"
                    stroke="url(#Academics-stroke)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#7c3aed" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {currentGradeIndex < growthData.length - 1 && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Dashed projections beyond Grade {profile.gradeLevel} are based on current trajectory estimates
              </p>
            )}
          </Card>
        </div>

        {/* Plateau Detection */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full">
            <CardHeader
              title="Plateau Detection"
              subtitle="Areas showing stagnation"
              action={<AlertCircle size={18} className="text-muted-foreground" />}
            />
            <div className="space-y-3">
              {plateaus.length > 0 ? (
                <>
                  {plateaus.map((plateau) => (
                    <div
                      key={plateau}
                      className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20"
                    >
                      <AlertCircle size={16} className="text-warning shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{plateau}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Growth has stalled in this dimension. Consider targeted actions to reignite progression.
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Plateaus are detected when a metric shows less than 5% growth between grade levels while remaining below 70%.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 size={28} className="text-success mb-3" />
                  <p className="text-sm font-medium text-foreground">No Plateaus Detected</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All dimensions are showing healthy growth trajectories.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Roadmap Generator */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader
              title="Strategic Roadmap"
              subtitle="Phase-by-phase plan for admissions optimization"
              action={<Map size={18} className="text-muted-foreground" />}
            />
            <div className="space-y-6">
              {roadmap.map((phase, phaseIndex) => {
                const isCurrentPhase =
                  (profile.gradeLevel === 10 && phaseIndex === 0) ||
                  (profile.gradeLevel === 11 && phaseIndex === 1) ||
                  (profile.gradeLevel === 12 && phaseIndex === 2);

                const isPastPhase =
                  (profile.gradeLevel === 11 && phaseIndex === 0) ||
                  (profile.gradeLevel === 12 && (phaseIndex === 0 || phaseIndex === 1));

                return (
                  <div key={phase.phase} className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isCurrentPhase
                            ? "bg-accent text-white"
                            : isPastPhase
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isPastPhase ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <span className="text-xs font-bold">{phaseIndex + 1}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            {phase.phase}
                          </h3>
                          {isCurrentPhase && (
                            <Badge variant="default" className="text-[10px]">
                              Current Phase
                            </Badge>
                          )}
                          {isPastPhase && (
                            <Badge variant="success" className="text-[10px]">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{phase.gradeLevel}</p>
                      </div>
                    </div>
                    <div className="ml-11 space-y-2">
                      {phase.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2 p-2.5 rounded-lg ${
                            isCurrentPhase
                              ? "bg-accent/5 border border-accent/10"
                              : isPastPhase
                              ? "bg-muted/30 border border-border/30"
                              : "bg-muted/50 border border-border/50"
                          }`}
                        >
                          <ArrowRight
                            size={12}
                            className={`mt-0.5 shrink-0 ${
                              isCurrentPhase
                                ? "text-accent"
                                : isPastPhase
                                ? "text-success/50"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span
                            className={`text-sm leading-relaxed ${
                              isPastPhase
                                ? "text-muted-foreground/60"
                                : "text-muted-foreground"
                            }`}
                          >
                            {rec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
