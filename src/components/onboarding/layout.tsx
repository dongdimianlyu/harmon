import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type OnboardingLayoutProps = {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  previewPanel?: React.ReactNode;
};

const steps = [
  "Academic Baseline",
  "Intended Direction",
  "Activities Deep Input",
  "Awards & Recognition",
  "Time Budget",
  "Archetype Selection",
  "Signal Generation",
  "90-Day Plan",
];

export function OnboardingLayout({ children, currentStep, totalSteps, previewPanel }: OnboardingLayoutProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#05060a] text-white flex flex-col font-sans selection:bg-accent/30 selection:text-white">
      {/* Header / Progress bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#05060a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="h-1 w-full bg-white/5">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
              <span className="text-black text-[10px] font-bold">H</span>
            </div>
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-white/70">Harmon OS</span>
          </div>
          <div className="text-xs font-medium text-white/50">
            Step {currentStep} of {totalSteps}: <span className="text-white/90">{steps[currentStep - 1]}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-28 pb-20 flex gap-12">
        {/* Left: Form Area */}
        <div className="flex-1 max-w-2xl animate-fade-in">
          {children}
        </div>

        {/* Right: Live Preview / Impact Panel */}
        <div className="w-[400px] shrink-0 hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/40 mb-4">Live Impact Preview</h3>
            {previewPanel || (
              <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center min-h-[300px] text-center">
                <p className="text-sm text-white/30">Inputs will generate strategic insights here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
