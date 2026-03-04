"use client";

import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/layout";
import { useProfileStore } from "@/store/profile-store";
import { generateExecutionOS } from "@/engine/execution";
import { generateOpportunities } from "@/engine/opportunity";
import { Zap, Clock, ArrowRight, Crosshair, AlertTriangle } from "lucide-react";

export default function Step8Roadmap() {
  const router = useRouter();
  const { profile } = useProfileStore();
  
  const execution = generateExecutionOS(profile);
  const opps = generateOpportunities(profile);

  const priorities = execution.weeklyPriorities;
  const highRiskOpp = opps.recommendedOpportunities[0]; // Top opp

  const handleFinish = () => {
    // In a real app we'd mark onboarding as complete here
    router.push("/app"); // Go to main dashboard
  };

  return (
    <OnboardingLayout currentStep={8} totalSteps={8}>
      <div className="space-y-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">90-Day Operating Plan</h1>
          <p className="text-muted-foreground text-sm">
            Based on your identified gaps and target archetype, here are your immediate execution priorities to maximize expected value (EV) per hour.
          </p>
        </div>

        {execution.burnoutRisk && (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-rose-400">Burnout Constraint</p>
              <p className="text-xs text-rose-400/80 mt-1">
                You do not have enough hours to safely execute this plan without dropping existing low-ROI activities. See Dashboard for Drop recommendations.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Immediate Priorities (Next 2 Weeks)
            </h3>
            <div className="space-y-3">
              {priorities.map((p) => (
                <div key={p.id} className="p-5 rounded-xl border border-white/10 bg-black/40 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/50">
                      {p.urgency.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{p.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Est. {p.estimatedHours} hours • Source: {p.source}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {highRiskOpp && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-amber-400" />
                High-Risk, High-Reward Target (90 Days)
              </h3>
              <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg text-white">{highRiskOpp.name}</h4>
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-bold">
                    {highRiskOpp.signalMagnitude} Signal Boost
                  </span>
                </div>
                <p className="text-sm text-white/70 mb-4 leading-relaxed">{highRiskOpp.description}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-white/60">{highRiskOpp.requiredTimelineWeeks} weeks prep</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">%</div>
                    <span className="text-white/60">{highRiskOpp.acceptanceProbability}% est. odds</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-12 flex justify-between">
          <button 
            onClick={() => router.push("/onboarding/step-7")}
            className="text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition"
          >
            Back
          </button>
          <button 
            onClick={handleFinish}
            className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-white/90 transition flex items-center gap-2"
          >
            Enter Command Center <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
