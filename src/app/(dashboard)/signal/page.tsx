"use client";

import { useState, useEffect } from "react";
import { Activity, ShieldAlert, Crosshair, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { calculateSignal } from "@/engine/signal";
import { useProfileStore } from "@/store/profile-store";
import { 
  computeAISimulationAction, 
  computeAIOpportunityAction, 
  computeAIBurnoutAction 
} from "@/app/actions/ai";

export default function SignalPage() {
  const { profile } = useProfileStore();
  
  const signal = calculateSignal(profile);
  
  const [loading, setLoading] = useState(true);
  const [simResult, setSimResult] = useState<any>(null);
  const [oppResult, setOppResult] = useState<any>(null);
  const [burnoutResult, setBurnoutResult] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const [sim, opp, burn] = await Promise.all([
        computeAISimulationAction(profile),
        computeAIOpportunityAction(profile),
        computeAIBurnoutAction(profile)
      ]);
      setSimResult(sim);
      setOppResult(opp);
      setBurnoutResult(burn);
      setLoading(false);
    }
    loadData();
  }, [profile]);

  if (loading || !simResult || !oppResult || !burnoutResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-white/60">AI running Monte Carlo simulation and opportunity arbitrage...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Signal & Intelligence</h1>
          <p className="text-muted-foreground">Objective benchmarking against top-tier outcomes.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Target: {profile.targetTier}</p>
          <p className="text-3xl font-bold text-white tracking-tighter">{signal.compositeScore}<span className="text-lg text-white/40 font-medium">/100</span></p>
        </div>
      </div>

      {burnoutResult.unsustainablePacingWarning && (
        <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 flex items-start gap-4 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
          <div className="p-2 bg-rose-500/20 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-1">Unsustainable Pacing Warning</p>
            <p className="text-sm text-rose-200/80 leading-relaxed">
              Your weekly hour commitments are tracking towards critical burnout. AI intervention required to prune low-ROI activities before academic performance slips.
            </p>
          </div>
        </div>
      )}

      {burnoutResult.distortionDetected && (
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-start gap-4 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
          <div className="p-2 bg-amber-500/20 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-1">Profile Distortion Detected (Score: {burnoutResult.inauthenticOptimizationScore}/100)</p>
            <p className="text-sm text-amber-200/80 leading-relaxed">
              Your profile looks overly algorithmic. You risk coming across as manufactured to admissions committees. Introduce authentic, slightly misaligned passion projects to humanize your narrative.
            </p>
          </div>
        </div>
      )}

      {/* Primary Signal Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(signal.dimensions).slice(0, 3).map((dim, i) => {
          const isVulnerable = dim.gapToThreshold > 0;
          return (
            <div key={i} className={`p-6 rounded-3xl border relative overflow-hidden group ${isVulnerable ? 'bg-gradient-to-b from-[#1a1112] to-[#0a0505] border-rose-500/20' : 'bg-gradient-to-b from-[#111a15] to-[#050a07] border-emerald-500/20'}`}>
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${isVulnerable ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${isVulnerable ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                    {isVulnerable ? <ShieldAlert className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${isVulnerable ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {dim.percentile}th %ile
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{dim.name}</h3>
                  <p className={`text-4xl font-bold tracking-tighter ${isVulnerable ? 'text-rose-50' : 'text-white'}`}>{dim.score}<span className="text-lg font-medium opacity-40 ml-1">/100</span></p>
                  
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Highest Leverage Fix</p>
                    <p className={`text-xs leading-relaxed ${isVulnerable ? 'text-rose-200/80' : 'text-emerald-200/80'}`}>
                      {dim.fastestLeverageAction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Arbitrage Engine */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
              <Crosshair className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Opportunity Arbitrage</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-0.5">AI-Identified Asymmetric Plays</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {oppResult.recommendedOpportunities?.map((opp: any) => (
              <div key={opp.id} className="p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#11121a] to-[#05060a] hover:border-accent/30 transition-all duration-300 group shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-white text-lg group-hover:text-accent transition-colors duration-300">{opp.name}</h4>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${opp.signalMagnitude.includes('High') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-white/5 text-white/70 border-white/10'}`}>
                    {opp.signalMagnitude} Signal
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-5">{opp.description}</p>
                
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 mb-5 relative overflow-hidden group-hover:bg-accent/10 transition-colors duration-300">
                  <div className="absolute left-0 top-0 w-1 h-full bg-accent opacity-50" />
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" />
                    AI Asymmetric Advantage
                  </p>
                  <p className="text-xs text-white/80 leading-relaxed">{opp.asymmetricAdvantage}</p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">Odds</span>
                    <span className="text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">{opp.acceptanceProbability}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">Timeline</span>
                    <span className="text-white/80">{opp.requiredTimelineWeeks}w Prep</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Forecasting & Simulation */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Sensitivity Analysis</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-0.5">Monte Carlo Simulation</p>
            </div>
          </div>
          
          <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#11121a] via-[#0a0c12] to-[#05060a] shadow-[0_18px_45px_-35px_rgba(15,23,42,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 mb-8 pb-8 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Simulated Outcome</p>
                <p className="text-5xl font-black text-white tracking-tighter">{simResult.admissionsProbabilityBand}</p>
              </div>
              <div className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest shadow-inner ${
                simResult.admissionsProbabilityBand.includes('Reject') ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                For {profile.targetTier}
              </div>
            </div>

            <div className="relative z-10 space-y-8">
              {simResult.sensitivityAnalysis?.map((sens: any, idx: number) => (
                <div key={`sens-${idx}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shadow-[0_0_15px_rgba(111,140,255,0.3)]">
                      <span className="text-accent text-xs font-black">{idx + 1}</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-accent font-bold mb-0.5">Highest Leverage Pivot</p>
                      <h4 className="font-bold text-white text-lg">{sens.variable}</h4>
                    </div>
                  </div>
                  
                  <div className="pl-11 space-y-4">
                    <p className="text-sm text-white/60 leading-relaxed">
                      {sens.explanation}
                    </p>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Path to Execute</p>
                      <p className="text-sm text-white/90 leading-relaxed">{sens.realisticPathToMove}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {simResult.riskFlags?.length > 0 && (
              <div className="relative z-10 mt-8 pt-8 border-t border-rose-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">Critical Auto-Reject Risks</h4>
                </div>
                <div className="space-y-3">
                  {simResult.riskFlags.map((risk: string, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                      <p className="text-xs text-rose-200/90 leading-relaxed">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
