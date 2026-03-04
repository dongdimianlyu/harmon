"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/layout";
import { useProfileStore } from "@/store/profile-store";
import { ActivityCategory, ImpactLevel, Activity } from "@/engine/core/types";
import { Plus, X, AlertTriangle } from "lucide-react";
import { calculateSignal } from "@/engine/signal";

const CATEGORIES: ActivityCategory[] = [
  "Research", "Engineering/Product", "Policy/Debate", 
  "Business/Entrepreneurship", "Arts/Humanities", "Athletics", 
  "Community Service", "Other"
];

const IMPACT_LEVELS: ImpactLevel[] = ["Local", "State", "National", "International"];

export default function Step3Activities() {
  const router = useRouter();
  const { profile, addActivity, removeActivity } = useProfileStore();

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<Activity>>({
    name: "",
    category: "Other",
    hoursPerWeek: 5,
    weeksPerYear: 36,
    yearsInvolved: 1,
    impactLevel: "Local",
    role: "",
    initiativeLevel: "Participant",
    isPrestigeTheater: false,
  });

  const handleSaveActivity = () => {
    if (form.name && form.category && form.role) {
      addActivity({
        ...(form as Activity),
        id: `act-${Date.now()}`
      });
      setIsAdding(false);
      setForm({
        name: "", category: "Other", hoursPerWeek: 5, weeksPerYear: 36,
        yearsInvolved: 1, impactLevel: "Local", role: "", initiativeLevel: "Participant",
        isPrestigeTheater: false
      });
    }
  };

  const signal = calculateSignal(profile);
  const initiativeScore = signal.dimensions.initiativeCreation.score;
  const leadershipScore = signal.dimensions.leadershipDepth.score;

  const previewPanel = (
    <div className="space-y-4">
      <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">Signal Depth</h4>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/80">Initiative / Creation</span>
              <span className="text-sm font-bold text-accent">{initiativeScore}/100</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${initiativeScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/80">Leadership Depth</span>
              <span className="text-sm font-bold text-accent">{leadershipScore}/100</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${leadershipScore}%` }} />
            </div>
          </div>
        </div>

        {profile.activities.length > 0 && initiativeScore < 40 && (
          <div className="mt-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-amber-400 mb-1">Participant Trap</p>
              <p className="text-[11px] text-amber-200/70">
                You have hours logged but low initiative. You need activities where you are the founder or creator.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <OnboardingLayout currentStep={3} totalSteps={8} previewPanel={previewPanel}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Core Activities</h1>
          <p className="text-muted-foreground text-sm">
            Input your top 3-5 most significant extracurricular commitments. Quality and scale matter more than quantity.
          </p>
        </div>

        <div className="space-y-4">
          {profile.activities.map((act) => (
            <div key={act.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex justify-between items-center group">
              <div>
                <h4 className="font-medium text-white">{act.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {act.role} • {act.category} • {act.impactLevel}
                </p>
              </div>
              <button 
                onClick={() => removeActivity(act.id)}
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
              <Plus className="w-4 h-4" /> Add Activity
            </button>
          ) : (
            <div className="p-6 rounded-xl border border-accent/30 bg-black/40 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Activity Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Algorithmic Bias Research"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Category</label>
                  <select 
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ActivityCategory })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Your Role</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Founder, Lead Dev"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Hrs/Week</label>
                  <input 
                    type="number" 
                    value={form.hoursPerWeek}
                    onChange={(e) => setForm({ ...form, hoursPerWeek: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Wks/Year</label>
                  <input 
                    type="number" 
                    value={form.weeksPerYear}
                    onChange={(e) => setForm({ ...form, weeksPerYear: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Scale</label>
                  <select 
                    value={form.impactLevel}
                    onChange={(e) => setForm({ ...form, impactLevel: e.target.value as ImpactLevel })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition appearance-none"
                  >
                    {IMPACT_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
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
                  onClick={handleSaveActivity}
                  disabled={!form.name || !form.role}
                  className="bg-accent text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 disabled:opacity-50"
                >
                  Save Activity
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-8 flex justify-between">
          <button 
            onClick={() => router.push("/onboarding/step-2")}
            className="text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition"
          >
            Back
          </button>
          <button 
            onClick={() => router.push("/onboarding/step-4")}
            className="bg-white text-black px-8 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition"
          >
            Continue to Validation
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
