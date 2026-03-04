"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/layout";
import { useProfileStore } from "@/store/profile-store";
import { evaluatePsychology } from "@/engine/psych";
import { calculateEV } from "@/engine/ev";

export default function Step5Time() {
  const router = useRouter();
  const { profile, updateTimeBudget, updatePersonal } = useProfileStore();

  const [hours, setHours] = useState(profile.timeBudget.hoursPerWeekAvailable || 20);
  const [constraint, setConstraint] = useState(profile.personal.financialConstraintLevel || "None");

  const handleNext = () => {
    updateTimeBudget({ hoursPerWeekAvailable: hours });
    updatePersonal({ financialConstraintLevel: constraint });
    router.push("/onboarding/step-6");
  };

  // Live preview mapping
  const tempProfile = {
    ...profile,
    timeBudget: { hoursPerWeekAvailable: hours },
    availableHoursPerWeek: hours, // for legacy engine support
    personal: {
      ...profile.personal,
      financialConstraintLevel: constraint,
    }
  };

  const evResult = calculateEV(tempProfile);
  const psych = evaluatePsychology(tempProfile);
  const utilizedHours = evResult.totalWeeklyHours;

  const previewPanel = (
    <div className="space-y-4">
      <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">Operations & Burnout Risk</h4>
        
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Hours Committed vs Capacity</span>
            <span className={utilizedHours > hours ? "text-rose-400 font-medium" : "text-emerald-400 font-medium"}>
              {utilizedHours} / {hours}
            </span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full ${utilizedHours > hours ? 'bg-rose-500' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.min(100, (utilizedHours / Math.max(1, hours)) * 100)}%` }} 
            />
          </div>
        </div>

        {psych.burnoutRiskLevel === "Critical" ? (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs font-medium text-rose-400 mb-1">Critical Burnout Risk</p>
            <p className="text-[11px] text-rose-200/70">
              You are operating above capacity. A roadmap will require dropping activities to execute high-leverage milestones.
            </p>
          </div>
        ) : psych.burnoutRiskLevel === "Moderate" ? (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs font-medium text-amber-400 mb-1">Moderate Burnout Risk</p>
            <p className="text-[11px] text-amber-200/70">
              You are near capacity. We will focus the roadmap on high-ROI maneuvers to avoid academic slip.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs font-medium text-emerald-400 mb-1">Sustainable Execution</p>
            <p className="text-[11px] text-emerald-200/70">
              You have operational bandwidth. You are clear to take on new asymmetric opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <OnboardingLayout currentStep={5} totalSteps={8} previewPanel={previewPanel}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Time Budget & Constraints</h1>
          <p className="text-muted-foreground text-sm">
            Elite outcomes require ruthless time allocation. We need to know your operational limits to generate a realistic roadmap.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-medium text-white/80 uppercase tracking-wider block">
              Hours Available for Extracurriculars / Week
            </label>
            <div className="flex items-center gap-6">
              <input 
                type="range" 
                min="5" 
                max="40" 
                step="1"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="flex-1 accent-accent"
              />
              <div className="w-16 h-12 bg-black/50 border border-white/10 rounded-lg flex items-center justify-center font-mono text-xl font-bold text-accent shrink-0">
                {hours}
              </div>
            </div>
            <p className="text-xs text-white/50">Current activities require {utilizedHours} hours/week.</p>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-medium text-white/80 uppercase tracking-wider block">Financial Constraint Level</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: "None", desc: "Can self-fund projects/travel" },
                { val: "Low", desc: "Standard budget" },
                { val: "Moderate", desc: "Require some financial aid" },
                { val: "High", desc: "Need fully funded opportunities" }
              ].map(c => (
                <div 
                  key={c.val}
                  onClick={() => setConstraint(c.val as any)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    constraint === c.val ? 'bg-accent/10 border-accent/50 text-accent' : 'bg-black/50 border-white/10 text-white hover:bg-white/5'
                  }`}
                >
                  <p className="font-medium text-sm">{c.val}</p>
                  <p className="text-[10px] mt-0.5 opacity-70">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex justify-between">
          <button 
            onClick={() => router.push("/onboarding/step-4")}
            className="text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition"
          >
            Back
          </button>
          <button 
            onClick={handleNext}
            className="bg-white text-black px-8 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition"
          >
            Generate Archetype Profile
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
