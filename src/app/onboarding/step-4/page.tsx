"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/layout";
import { useProfileStore } from "@/store/profile-store";
import { AwardTier, Award, ActivityCategory } from "@/engine/core/types";
import { Plus, X, Award as AwardIcon } from "lucide-react";
import { calculateSignal } from "@/engine/signal";

const TIERS: { value: AwardTier; label: string; examples: string }[] = [
  { value: "Tier 1", label: "Tier 1 (International)", examples: "IMO, ISEF, RSI, Telluride" },
  { value: "Tier 2", label: "Tier 2 (National Elite)", examples: "USAMO, Coca-Cola Scholar" },
  { value: "Tier 3", label: "Tier 3 (State/Regional)", examples: "State DECA 1st, AIME" },
  { value: "Tier 4", label: "Tier 4 (Local/School)", examples: "School Science Fair, NHS" },
];

export default function Step4Awards() {
  const router = useRouter();
  const { profile, addAward, removeAward } = useProfileStore();

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<Award>>({
    name: "",
    tier: "Tier 4",
    category: "Other",
  });

  const handleSaveAward = () => {
    if (form.name && form.tier) {
      addAward({
        ...(form as Award),
        id: `awd-${Date.now()}`
      });
      setIsAdding(false);
      setForm({ name: "", tier: "Tier 4", category: "Other" });
    }
  };

  const signal = calculateSignal(profile);
  const validationScore = signal.dimensions.externalValidation.score;
  const hasHighTier = profile.awards.some(a => a.tier === "Tier 1" || a.tier === "Tier 2");

  const previewPanel = (
    <div className="space-y-4">
      <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">External Validation</h4>
        
        <div className="flex items-end gap-3 mb-6">
          <span className="text-4xl font-bold text-white">{validationScore}</span>
          <span className="text-sm text-white/40 mb-1">/100</span>
        </div>

        {profile.awards.length === 0 ? (
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
            <p className="text-xs text-white/50">Add awards to calculate validation score.</p>
          </div>
        ) : !hasHighTier && profile.targetTier !== "T50" ? (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs font-medium text-rose-400 mb-1">Validation Gap Detected</p>
            <p className="text-[11px] text-rose-200/70">
              Your target tier typically requires Tier 1 or Tier 2 validation. We will generate arbitrage opportunities to fix this gap in the final roadmap.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs font-medium text-emerald-400 mb-1">Strong Validation Signal</p>
            <p className="text-[11px] text-emerald-200/70">
              You have established objective proof of excellence at the national/international level.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <OnboardingLayout currentStep={4} totalSteps={8} previewPanel={previewPanel}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Awards & Validation</h1>
          <p className="text-muted-foreground text-sm">
            Admissions committees rely on external validation to verify the quality of your activities.
          </p>
        </div>

        <div className="space-y-4">
          {profile.awards.map((awd) => (
            <div key={awd.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex justify-between items-center group">
              <div className="flex items-start gap-3">
                <AwardIcon className={`w-5 h-5 mt-0.5 ${awd.tier === 'Tier 1' || awd.tier === 'Tier 2' ? 'text-accent' : 'text-white/40'}`} />
                <div>
                  <h4 className="font-medium text-white">{awd.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {awd.tier}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => removeAward(awd.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {!isAdding ? (
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full py-4 border border-dashed border-white/20 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Award
            </button>
          ) : (
            <div className="p-6 rounded-xl border border-accent/30 bg-black/40 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Award Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. USACO Silver"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Validation Tier</label>
                <div className="space-y-2">
                  {TIERS.map(t => (
                    <label 
                      key={t.value}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                        form.tier === t.value ? 'bg-accent/10 border-accent/50' : 'bg-black/50 border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="tier"
                        value={t.value}
                        checked={form.tier === t.value}
                        onChange={(e) => setForm({ ...form, tier: e.target.value as AwardTier })}
                        className="mt-1 accent-accent"
                      />
                      <div>
                        <p className={`text-sm font-medium ${form.tier === t.value ? 'text-accent' : 'text-white'}`}>{t.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">e.g. {t.examples}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-sm text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveAward}
                  disabled={!form.name}
                  className="bg-accent text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 disabled:opacity-50"
                >
                  Save Award
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-8 flex justify-between">
          <button 
            onClick={() => router.push("/onboarding/step-3")}
            className="text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition"
          >
            Back
          </button>
          <button 
            onClick={() => router.push("/onboarding/step-5")}
            className="bg-white text-black px-8 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition"
          >
            Continue to Operations
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
