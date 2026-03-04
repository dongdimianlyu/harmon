"use client";

import { useState, useEffect } from "react";
import { Network, FileText, Send, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { computeAINarrativeAction } from "@/app/actions/ai";
import { useProfileStore } from "@/store/profile-store";

export default function NarrativePage() {
  const { profile } = useProfileStore();
  const [narrative, setNarrative] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNarrative() {
      const res = await computeAINarrativeAction(profile);
      setNarrative(res);
      setLoading(false);
    }
    loadNarrative();
  }, [profile]);

  if (loading || !narrative) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-white/60">AI analyzing narrative coherence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Narrative Engineering</h1>
          <p className="text-muted-foreground">Weave execution into a cohesive, undeniable story.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm ${narrative.replaceabilityRiskScore < 50 ? 'bg-accent/10 border-accent/30 shadow-[0_0_15px_rgba(111,140,255,0.15)]' : 'bg-amber-500/10 border-amber-500/30'}`}>
          <Sparkles className={`w-4 h-4 ${narrative.replaceabilityRiskScore < 50 ? 'text-accent' : 'text-amber-400'}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${narrative.replaceabilityRiskScore < 50 ? 'text-accent' : 'text-amber-400'}`}>
            Unique Profile Spike
          </span>
        </div>
      </div>

      {narrative.replaceabilityRiskScore > 70 && (
        <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 flex items-start gap-4 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
          <div className="p-2 bg-rose-500/20 rounded-lg shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-1">High Replaceability Risk ({narrative.replaceabilityRiskScore}/100)</p>
            <p className="text-sm text-rose-200/80 leading-relaxed">{narrative.replaceabilityJustification}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Theme Coherence Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
              <Network className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Spike & Theme Analysis</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-0.5">AI Coherence Mapping</p>
            </div>
          </div>
          
          <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#11121a] via-[#0a0c12] to-[#05060a] relative shadow-[0_18px_45px_-35px_rgba(15,23,42,1)] overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
              <div className="text-center pb-8 border-b border-white/5">
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">Dominant AI-Detected Spike</p>
                <h4 className="text-3xl font-black text-white tracking-tight">{narrative.spikeDomain}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Supporting Evidence</p>
                  </div>
                  <ul className="space-y-3">
                    {narrative.supportingEvidence.map((ev: string, i: number) => (
                      <li key={i} className="text-sm text-white/70 leading-relaxed bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                        {ev}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Weak Narrative Areas</p>
                  </div>
                  <ul className="space-y-3">
                    {narrative.weakNarrativeAreas.map((weak: string, i: number) => (
                      <li key={i} className="text-sm text-white/70 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                        {weak}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-white">Strategic Strengthening Actions</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {narrative.suggestedStrengtheningActions.map((action: string, i: number) => (
                <div key={i} className="p-5 rounded-2xl border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors shadow-sm flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">{action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Synthesis & Action */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <FileText className="w-5 h-5 text-white/50" />
              Interview Scaffold
            </h3>
            <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#11121a] to-[#05060a] space-y-4 shadow-[0_18px_45px_-35px_rgba(15,23,42,1)]">
              <div>
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-4">AI Generated Questions</p>
                <ul className="space-y-5">
                  <li className="text-sm text-white/80 leading-relaxed border-l-2 border-accent pl-4 relative">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-accent" />
                    "Tell me more about your work in <strong className="text-white">{narrative.spikeDomain.toLowerCase()}</strong>. What was the most unexpected challenge you faced?"
                  </li>
                  <li className="text-sm text-white/80 leading-relaxed border-l-2 border-accent pl-4 relative">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-accent" />
                    "How does your background in this area prepare you for the specific rigor of our program?"
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <Send className="w-5 h-5 text-white/50" />
              Recommender Strategy
            </h3>
            <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#11121a] to-[#05060a] space-y-4 shadow-[0_18px_45px_-35px_rgba(15,23,42,1)]">
              <p className="text-sm text-white/70 leading-relaxed">
                Target recommenders who can explicitly validate your <strong className="text-accent bg-accent/10 px-1.5 py-0.5 rounded">{narrative.spikeDomain}</strong> and speak directly to the areas where your narrative is currently weakest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
