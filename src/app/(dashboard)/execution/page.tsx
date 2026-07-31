"use client";

import { useState, useEffect } from "react";
import { Zap, Clock, ArrowRight, Circle, Loader2, Target, CheckCircle2 } from "lucide-react";
import { generateExecutionOS } from "@/engine/execution";
import { generateCareerPathway } from "@/engine/career";
import { useProfileStore } from "@/store/profile-store";
import { computeAIRoadmapAction } from "@/app/actions/ai";

export default function ExecutionPage() {
  const { profile } = useProfileStore();
  const execution = generateExecutionOS(profile);
  const career = generateCareerPathway(profile);

  const [aiRoadmap, setAiRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmap() {
      const res = await computeAIRoadmapAction(profile, profile.intendedMajorInfo.primary || "Unknown", profile.timeBudget.hoursPerWeekAvailable);
      setAiRoadmap(res);
      setLoading(false);
    }
    loadRoadmap();
  }, [profile]);

  const topPriority = execution.weeklyPriorities[0];
  const otherPriorities = execution.weeklyPriorities.slice(1);

  if (loading || !aiRoadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-white/60">AI architecting strategic 90-day roadmap...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Execution Roadmap</h1>
          <p className="text-muted-foreground">Ruthless prioritization. Only ship what moves the needle.</p>
        </div>
        {execution.focusModeActive && (
          <div className="px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Focus Mode Active
          </div>
        )}
      </div>

      {/* Focus Action */}
      {topPriority && (
        <div className="p-8 rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-[#0a0c12] to-[#05060a] relative overflow-hidden group cursor-pointer hover:border-accent/40 transition-all duration-500 shadow-[0_18px_45px_-35px_rgba(111,140,255,0.2)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-all duration-500" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30 shadow-[0_0_20px_rgba(111,140,255,0.2)]">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h2 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-1">Highest Leverage Action This Week</h2>
                <h3 className="text-2xl font-bold text-white mb-1.5">{topPriority.title}</h3>
                <p className="text-sm text-white/60 flex items-center gap-3">
                  <span>Est. {topPriority.estimatedHours} hours</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>Source: {topPriority.source}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-rose-400 mb-2 justify-end bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Due in 3 days</span>
              </div>
              <ArrowRight className="w-6 h-6 text-accent opacity-0 group-hover:opacity-100 transition-opacity ml-auto transform group-hover:translate-x-1 duration-300" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-white" />
              AI Strategic Milestones (90 Days)
            </h3>
          </div>

          <div className="space-y-4">
            {aiRoadmap.milestones.map((m: any, idx: number) => (
              <div 
                key={m.id || idx}
                className="p-6 rounded-2xl border border-white/10 bg-black/40 hover:bg-white/5 transition relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-white/10 group-hover:bg-accent/50 transition-colors" />
                <div className="pl-2">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-lg text-white group-hover:text-accent transition-colors">{m.goal}</h4>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider border ${
                      m.difficultyLevel.includes("Extreme") || m.difficultyLevel.includes("High") 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {m.difficultyLevel}
                    </span>
                  </div>
                  
                  <p className="text-sm text-white/70 mb-5 leading-relaxed">{m.rationale}</p>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-1.5">Expected Signal Gain</p>
                      <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Zap className="w-3 h-3" />
                        {m.expectedSignalGain}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-1.5">Risk Factor</p>
                      <p className="text-xs font-medium text-rose-400 truncate pr-4" title={m.riskFactor}>{m.riskFactor}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-1.5">Time Estimate</p>
                      <p className="text-xs font-medium text-white/80">{m.estimatedHours} Hours Total</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly & Career */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#11121a] to-[#05060a] space-y-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,1)]">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-1">Weekly Execution</h3>
              <div className="flex items-center gap-2">
                <div className="w-full bg-white/5 rounded-full h-1.5 flex-1">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${execution.momentumScore}%` }} />
                </div>
                <span className="text-xs font-bold text-emerald-400">{execution.momentumScore}% Momentum</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="pt-2 space-y-3">
                {otherPriorities.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Circle className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">{p.title}</p>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/50 mt-1">
                        {p.urgency} Urgency • {p.estimatedHours}h
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#11121a] to-[#05060a] space-y-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,1)]">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-1">Freshman Internship Prep</h3>
              <p className="text-xs text-white/50">Early career positioning.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-white/80">Resume Signal Score</span>
                  <span className="text-xs font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10">{career.resumeSignalScore}/100</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(111,140,255,0.5)]" style={{ width: `${career.resumeSignalScore}%` }} />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-2">Target: {career.freshmanInternshipTarget}</p>
                {career.portfolioGaps.map((gap, i) => (
                   <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <p className="text-xs text-white/70 leading-relaxed">{gap}</p>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition">
              View Placement Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
