"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/layout";
import { useProfileStore } from "@/store/profile-store";
import { calculateSignal } from "@/engine/signal";

export default function Step1Academics() {
  const router = useRouter();
  const { profile, updateAcademics, updateTargetTier } = useProfileStore();

  const [form, setForm] = useState({
    gpaUnweighted: profile.academics.gpaUnweighted || "",
    gpaScale: profile.academics.gpaScale || 4.0,
    courseRigor: profile.academics.courseRigor || 5,
    satScore: profile.academics.satScore || "",
    targetTier: profile.targetTier || "T20",
  });

  const handleNext = () => {
    updateAcademics({
      gpaUnweighted: Number(form.gpaUnweighted),
      gpaScale: Number(form.gpaScale),
      courseRigor: Number(form.courseRigor),
      satScore: form.satScore ? Number(form.satScore) : undefined,
    });
    updateTargetTier(form.targetTier as any);
    router.push("/onboarding/step-2");
  };

  // Live preview calculations
  const tempProfile = {
    ...profile,
    academics: {
      ...profile.academics,
      gpaUnweighted: Number(form.gpaUnweighted) || 0,
      courseRigor: Number(form.courseRigor) || 5,
      satScore: form.satScore ? Number(form.satScore) : undefined,
    },
    targetTier: form.targetTier as any,
  };
  
  const signal = calculateSignal(tempProfile);
  const acadScore = signal.dimensions.academicStrength.score;
  const gap = signal.dimensions.academicStrength.gapToThreshold;

  const isValid = Number(form.gpaUnweighted) > 0 && Number(form.gpaUnweighted) <= Number(form.gpaScale);

  const previewPanel = (
    <div className="space-y-4">
      <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">Academic Strength Score</h4>
        <div className="flex items-end gap-3 mb-2">
          <span className="text-4xl font-bold text-white">{acadScore}</span>
          <span className="text-sm text-white/40 mb-1">/100</span>
        </div>
        
        {gap > 0 ? (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs font-medium text-rose-400 mb-1">Vulnerable for {form.targetTier}</p>
            <p className="text-[11px] text-rose-200/70">{signal.dimensions.academicStrength.fastestLeverageAction}</p>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs font-medium text-emerald-400 mb-1">Competitive for {form.targetTier}</p>
            <p className="text-[11px] text-emerald-200/70">Academic baseline meets historical admitted averages.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <OnboardingLayout currentStep={1} totalSteps={8} previewPanel={previewPanel}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Academic Baseline</h1>
          <p className="text-muted-foreground text-sm">
            Top-tier universities use academics as an initial filter. Let's establish your baseline to see what archetype strategies are viable.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Unweighted GPA</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="e.g. 3.95"
                value={form.gpaUnweighted}
                onChange={(e) => setForm({ ...form, gpaUnweighted: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/80 uppercase tracking-wider">GPA Scale</label>
              <select 
                value={form.gpaScale}
                onChange={(e) => setForm({ ...form, gpaScale: Number(e.target.value) })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition appearance-none"
              >
                <option value={4.0}>4.0 Scale</option>
                <option value={100}>100 Scale</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Course Rigor (Self-Assessment)</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={form.courseRigor}
              onChange={(e) => setForm({ ...form, courseRigor: Number(e.target.value) })}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-[10px] text-white/40">
              <span>Standard</span>
              <span>Max AP/IB/Dual</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Highest SAT/ACT (Optional)</label>
              <input 
                type="number" 
                placeholder="e.g. 1540"
                value={form.satScore}
                onChange={(e) => setForm({ ...form, satScore: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Target Tier</label>
              <select 
                value={form.targetTier}
                onChange={(e) => setForm({ ...form, targetTier: e.target.value as any })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition appearance-none"
              >
                <option value="T5">Top 5 (HYPSM)</option>
                <option value="T10">Top 10</option>
                <option value="T20">Top 20</option>
                <option value="T50">Top 50</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <button 
            onClick={handleNext}
            disabled={!isValid}
            className="bg-white text-black px-8 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Direction
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
