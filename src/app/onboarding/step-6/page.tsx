"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/layout";
import { useProfileStore } from "@/store/profile-store";
import { ShieldCheck, Target, AlertTriangle, Loader2 } from "lucide-react";
import { computeAIArchetypeAction } from "@/app/actions/ai";

export default function Step6Archetype() {
  const router = useRouter();
  const { profile } = useProfileStore();
  
  const [loading, setLoading] = useState(true);
  const [archetypeResult, setArchetypeResult] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const fetchAIArchetype = async () => {
      try {
        const result = await computeAIArchetypeAction(profile);
        setArchetypeResult(result);
        setSelectedId(result.primary.id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAIArchetype();
  }, [profile]);

  const handleNext = () => {
    router.push("/onboarding/step-7");
  };

  if (loading || !archetypeResult) {
    return (
      <OnboardingLayout currentStep={6} totalSteps={8}>
        <div className="space-y-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[400px] text-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Analyzing Profile</h1>
            <p className="text-muted-foreground text-sm">
              Harmon AI is evaluating your activities, detecting latent themes, and determining your optimal admissions archetype.
            </p>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  const allOptions = [archetypeResult.primary, ...archetypeResult.alternates];

  return (
    <OnboardingLayout currentStep={6} totalSteps={8}>
      <div className="space-y-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Archetype Assignment</h1>
          <p className="text-muted-foreground text-sm">
            Based on your inputs, the AI engine has identified your strongest differentiation angle.
          </p>
        </div>

        {archetypeResult.guardrailFlags && archetypeResult.guardrailFlags.length > 0 && (
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-400">Strategic Misalignment Detected</p>
              <ul className="text-xs text-amber-400/80 mt-1 space-y-1 list-disc list-inside">
                {archetypeResult.guardrailFlags.map((flag: string, i: number) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {allOptions.map((arch: any, idx: number) => {
            const isPrimary = idx === 0;
            const isSelected = selectedId === arch.id;

            return (
              <div 
                key={arch.id || idx}
                onClick={() => setSelectedId(arch.id)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-accent/5 border-accent shadow-[0_0_30px_rgba(111,140,255,0.1)]' 
                    : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-accent/20 text-accent' : 'bg-white/10 text-white/40'}`}>
                      {isPrimary ? <Target className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-white/80'}`}>{arch.name}</h3>
                        {isPrimary && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-black font-bold uppercase tracking-wider">
                            Highest Match
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Alignment Score: {arch.alignmentScore}/100 • Saturation: {arch.saturationIndex}%</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-accent' : 'border-white/20'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                  </div>
                </div>

                <div className="pl-13 space-y-3">
                  <p className="text-sm text-white/70 leading-relaxed">
                    <span className="font-medium text-white/90">Win Condition:</span> {arch.winCondition}
                  </p>
                  
                  {isPrimary && arch.justification && (
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80">
                      <span className="font-semibold text-accent block mb-1">AI Strategic Assessment:</span>
                      {arch.justification}
                    </div>
                  )}
                  
                  {isPrimary && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-xs font-medium text-emerald-400 mb-1">Current Strengths</p>
                        <ul className="text-[11px] text-white/60 space-y-1">
                          {arch.keyStrengths?.map((s: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">•</span>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-rose-400 mb-1">Risk Factors</p>
                        <ul className="text-[11px] text-white/60 space-y-1">
                          {arch.keyWeaknesses?.map((w: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5"><span className="text-rose-400 mt-0.5">•</span>{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-8 flex justify-between">
          <button 
            onClick={() => router.push("/onboarding/step-5")}
            className="text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition"
          >
            Back
          </button>
          <button 
            onClick={handleNext}
            className="bg-white text-black px-8 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition"
          >
            Lock Positioning & Generate Signal
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
