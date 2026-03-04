"use client";

import { useState, useEffect } from "react";
import { Target, AlertTriangle, ShieldCheck, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { computeAIArchetypeAction, computeAIRedundancyAction } from "@/app/actions/ai";
import { generateCareerPathway } from "@/engine/career";
import { useProfileStore } from "@/store/profile-store";

export default function PositioningPage() {
  const { profile } = useProfileStore();
  const career = generateCareerPathway(profile);
  
  const [loading, setLoading] = useState(true);
  const [archetypeResult, setArchetypeResult] = useState<any>(null);
  const [redundancyResult, setRedundancyResult] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const [arch, red] = await Promise.all([
        computeAIArchetypeAction(profile),
        computeAIRedundancyAction(profile)
      ]);
      setArchetypeResult(arch);
      setRedundancyResult(red);
      setLoading(false);
    }
    loadData();
  }, [profile]);

  if (loading || !archetypeResult || !redundancyResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-white/60">AI analyzing strategic positioning and redundancy...</p>
      </div>
    );
  }

  const { primary, alternates, guardrailFlags } = archetypeResult;
  const drops = redundancyResult.recommendedPruning || [];
  const fakeRisk = redundancyResult.lowAuthenticityRiskScore || 0;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Strategic Positioning</h1>
          <p className="text-muted-foreground">Define your undeniable spike and filter out distractions.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Alignment Score</p>
            <p className="text-2xl font-bold text-accent">{primary.alignmentScore}/100</p>
          </div>
        </div>
      </div>

      {fakeRisk > 60 && (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-rose-400">High Authenticity Risk ({fakeRisk}/100)</p>
            <p className="text-xs text-rose-400/80 mt-1">Your profile shows signs of being highly manufactured or padded with prestige theater. Admissions officers heavily penalize this.</p>
          </div>
        </div>
      )}

      {/* Archetype Definition */}
      <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#11121a] via-[#0a0c12] to-[#05060a] relative overflow-hidden shadow-[0_18px_45px_-35px_rgba(15,23,42,1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30 shadow-[0_0_20px_rgba(111,140,255,0.2)]">
            <Target className="w-8 h-8 text-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em]">Target Archetype</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${primary.saturationIndex > 80 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {primary.saturationIndex > 80 ? 'Highly Saturated' : 'Moderately Saturated'} Lane
                </span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">{primary.name}</h3>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
              <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">AI Differentiation Angle</p>
              <p className="text-sm text-white/90 leading-relaxed">{primary.winCondition}</p>
            </div>
            
            <p className="text-sm text-white/60 leading-relaxed max-w-3xl">
              <strong className="text-white/80">Justification:</strong> {primary.justification}
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Profile Strengths</h4>
            <ul className="space-y-2">
              {primary.keyStrengths?.map((str: string, idx: number) => (
                <li key={idx} className="text-sm text-white/80 flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  {str}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-3">Risk Factors</h4>
            <ul className="space-y-2">
              {primary.keyWeaknesses?.map((wk: string, idx: number) => (
                <li key={idx} className="text-sm text-white/80 flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  {wk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Anti-Goals */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            AI Pruning & Anti-Goals
          </h3>
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4 h-[calc(100%-2rem)]">
            {guardrailFlags?.map((flag: string, idx: number) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-rose-50 text-sm mb-1">Time Sink Warning</h4>
                  <p className="text-xs text-rose-200/80 leading-relaxed">{flag}</p>
                </div>
              </div>
            ))}
            {drops.map((drop: any, idx: number) => (
              <div key={`drop-${idx}`} className="flex gap-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-rose-50 text-sm mb-1">Drop Recommendation: {drop.activityName}</h4>
                  <p className="text-xs text-rose-200/80 leading-relaxed">{drop.dropRationale}</p>
                </div>
              </div>
            ))}
            {redundancyResult.prestigeTheaterFlags?.map((flag: string, idx: number) => (
              <div key={`theater-${idx}`} className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-50 text-sm mb-1">Prestige Theater</h4>
                  <p className="text-xs text-amber-200/80 leading-relaxed">{flag}</p>
                </div>
              </div>
            ))}
            {guardrailFlags?.length === 0 && drops.length === 0 && (!redundancyResult.prestigeTheaterFlags || redundancyResult.prestigeTheaterFlags.length === 0) && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-50">
                <ShieldCheck className="w-8 h-8" />
                <p className="text-sm font-medium">No critical pruning needed.</p>
                <p className="text-xs">Time allocation is highly aligned with your target archetype.</p>
              </div>
            )}
          </div>
        </div>

        {/* Alternate Archetypes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Pivot Options (Alternates)
          </h3>
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4 h-[calc(100%-2rem)]">
            {alternates?.map((alt: any) => (
              <div key={alt.id} className="p-5 rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 transition group">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-white text-base group-hover:text-accent transition">{alt.name}</h4>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-white/10 text-white/80">{alt.alignmentScore}% Match</span>
                </div>
                <p className="text-xs text-white/60 mb-4 leading-relaxed">{alt.winCondition}</p>
                <button className="text-xs font-semibold text-accent hover:text-accent/80 transition flex items-center gap-1.5 uppercase tracking-wider">
                  Simulate Pivot <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Early Career Translation */}
      <div className="mt-12 space-y-4">
        <h3 className="text-lg font-semibold uppercase tracking-widest text-white/50 text-xs">Freshman Year Placement Strategy</h3>
        <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-black/60 to-transparent">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Target Industry</p>
              <p className="font-semibold text-white text-lg">{career.industry}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Freshman Internship Target</p>
              <p className="font-semibold text-white text-lg">{career.freshmanInternshipTarget}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Outreach Strategy</p>
              <p className="text-sm text-white/80 leading-relaxed">{career.coldEmailStrategy}</p>
            </div>
          </div>
          {career.portfolioGaps.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">High School Portfolio Gaps for Recruiting</p>
              <div className="flex flex-wrap gap-2">
                {career.portfolioGaps.map((gap, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-amber-200">
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
