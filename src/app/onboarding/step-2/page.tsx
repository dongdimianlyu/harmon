"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/layout";
import { useProfileStore } from "@/store/profile-store";
import { calculateArchetype } from "@/engine/archetype";

const MAJOR_CATEGORIES = [
  "Computer Science",
  "Engineering (Hardware/Mech/Bio)",
  "Mathematics / Statistics",
  "Physics / Hard Sciences",
  "Economics / Finance",
  "Business / Management",
  "Pre-Med / Biology",
  "Political Science / Government",
  "History / Humanities",
  "English / Creative Writing",
  "Fine Arts / Design",
  "Undecided"
];

export default function Step2Direction() {
  const router = useRouter();
  const { profile, updateIntendedMajor } = useProfileStore();

  const [form, setForm] = useState({
    primary: profile.intendedMajorInfo.primary || "Computer Science",
    secondary: profile.intendedMajorInfo.secondary || "",
    certaintyLevel: profile.intendedMajorInfo.certaintyLevel || 3,
  });

  const handleNext = () => {
    updateIntendedMajor({
      primary: form.primary,
      secondary: form.secondary,
      certaintyLevel: form.certaintyLevel,
    });
    router.push("/onboarding/step-3");
  };

  // Live calculation mapping
  const tempProfile = {
    ...profile,
    intendedMajor: form.primary, // for engine compatibility
    intendedMajorInfo: {
      ...profile.intendedMajorInfo,
      primary: form.primary,
    }
  };

  const isHighlySaturated = 
    form.primary.includes("Computer Science") || 
    form.primary.includes("Business") || 
    form.primary.includes("Economics") || 
    form.primary.includes("Pre-Med");

  const previewPanel = (
    <div className="space-y-4">
      <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">Major Competitiveness</h4>
        
        {isHighlySaturated ? (
          <div className="space-y-4">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 w-[95%]" />
            </div>
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <p className="text-xs font-medium text-rose-400 mb-1">Extreme Saturation Detected</p>
              <p className="text-[11px] text-rose-200/70">
                {form.primary} is heavily impacted. You will need a highly differentiated archetype (e.g., Tech + Policy) to avoid blending in with thousands of similar applicants.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 w-[60%]" />
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs font-medium text-amber-400 mb-1">Moderate Saturation</p>
              <p className="text-[11px] text-amber-200/70">
                {form.primary} provides a solid baseline. Cross-pollinating this with a secondary interest (e.g., Data Science + History) will create a strong narrative hook.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <OnboardingLayout currentStep={2} totalSteps={8} previewPanel={previewPanel}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Intended Direction</h1>
          <p className="text-muted-foreground text-sm">
            Your intended major dictates which applicant pool you are compared against.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Primary Major</label>
            <select 
              value={form.primary}
              onChange={(e) => setForm({ ...form, primary: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition appearance-none"
            >
              <option value="" disabled>Select a major category</option>
              {MAJOR_CATEGORIES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Secondary Major / Minor (Optional)</label>
            <select 
              value={form.secondary}
              onChange={(e) => setForm({ ...form, secondary: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition appearance-none"
            >
              <option value="">None</option>
              {MAJOR_CATEGORIES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Certainty Level</label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={form.certaintyLevel}
              onChange={(e) => setForm({ ...form, certaintyLevel: Number(e.target.value) })}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-[10px] text-white/40">
              <span>Exploring</span>
              <span>100% Committed</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex justify-between">
          <button 
            onClick={() => router.push("/onboarding/step-1")}
            className="text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition"
          >
            Back
          </button>
          <button 
            onClick={handleNext}
            disabled={!form.primary}
            className="bg-white text-black px-8 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Activities
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
