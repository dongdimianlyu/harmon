"use client";

import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/layout";
import { useProfileStore } from "@/store/profile-store";
import { calculateSignal } from "@/engine/signal";
import { TrendingUp, ShieldAlert, Activity, ArrowRight } from "lucide-react";

export default function Step7Signal() {
  const router = useRouter();
  const { profile } = useProfileStore();
  
  const signal = calculateSignal(profile);
  const dims = Object.values(signal.dimensions);

  // Find weakest and strongest
  const sortedDims = [...dims].sort((a, b) => a.score - b.score);
  const weakest = sortedDims[0];
  const strongest = sortedDims[sortedDims.length - 1];

  return (
    <OnboardingLayout currentStep={7} totalSteps={8}>
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="w-16 h-16 rounded-full bg-accent/20 mx-auto flex items-center justify-center">
            <Activity className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold">Signal Index Generated</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            We've mapped your profile against historical data for {profile.targetTier} admissions. Here is your baseline reality.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="text-center">
            <p className="text-sm font-medium text-white/60 uppercase tracking-widest mb-2">Composite Score</p>
            <div className="text-7xl font-bold text-white tracking-tighter">
              {signal.compositeScore}
              <span className="text-3xl text-white/30 ml-2">/100</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dims.map((dim) => {
            const isVulnerable = dim.gapToThreshold > 0;
            return (
              <div key={dim.id} className="p-5 rounded-2xl border border-white/10 bg-black/40">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-white/90">{dim.name}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${isVulnerable ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {dim.score}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${isVulnerable ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${dim.score}%` }} 
                    />
                  </div>
                  
                  {isVulnerable ? (
                    <p className="text-xs text-rose-200/70">Gap: -{dim.gapToThreshold} pts to threshold</p>
                  ) : (
                    <p className="text-xs text-emerald-200/70">Meets competitive threshold</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-medium text-emerald-400">Strongest Pillar</h4>
            </div>
            <p className="text-lg font-bold text-white">{strongest.name}</p>
          </div>
          <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-medium text-rose-400">Critical Vulnerability</h4>
            </div>
            <p className="text-lg font-bold text-white">{weakest.name}</p>
          </div>
        </div>

        <div className="pt-12 flex justify-between">
          <button 
            onClick={() => router.push("/onboarding/step-6")}
            className="text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition"
          >
            Back
          </button>
          <button 
            onClick={() => router.push("/onboarding/step-8")}
            className="bg-accent text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-accent/90 transition flex items-center gap-2"
          >
            Generate Operating Plan <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
