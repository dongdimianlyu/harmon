import { StudentProfile, ActivityCategory } from "../core/types";
import { calculateArchetype } from "../archetype";

export type OpportunityCategory = "Competition" | "Research Program" | "Fellowship" | "Cold Outreach" | "Project";

export type Opportunity = {
  id: string;
  name: string;
  category: OpportunityCategory;
  archetypeAlignment: number; // 0-100%
  acceptanceProbability: number; // 0-100%
  requiredTimelineWeeks: number;
  signalMagnitude: number; // 0-100
  description: string;
  isUndersaturated: boolean;
};

export type OpportunityResult = {
  recommendedOpportunities: Opportunity[];
  criticalGapsFilled: string[];
};

// Simulated database of opportunities
const OPPORTUNITY_DB: Omit<Opportunity, "archetypeAlignment" | "acceptanceProbability">[] = [
  {
    id: "opp-1", name: "Concord Review", category: "Competition",
    requiredTimelineWeeks: 12, signalMagnitude: 95, isUndersaturated: true,
    description: "Highly prestigious history/policy publication. Low application rate from STEM majors makes it an arbitrage play."
  },
  {
    id: "opp-2", name: "Local Gov Data Fellowship (Cold Email)", category: "Cold Outreach",
    requiredTimelineWeeks: 4, signalMagnitude: 80, isUndersaturated: true,
    description: "Bypass formal programs. Pitch a free data analysis project to a local city council member."
  },
  {
    id: "opp-3", name: "USACO (Math/CS Olympiad)", category: "Competition",
    requiredTimelineWeeks: 24, signalMagnitude: 100, isUndersaturated: false,
    description: "The gold standard for Quant/CS. Highly saturated, but required for top-tier validation."
  },
  {
    id: "opp-4", name: "Independent App Launch (1k MRR)", category: "Project",
    requiredTimelineWeeks: 16, signalMagnitude: 90, isUndersaturated: true,
    description: "Build and monetize a micro-SaaS. Stronger signal than most formal summer programs."
  },
  {
    id: "opp-5", name: "RSI (Research Science Institute)", category: "Research Program",
    requiredTimelineWeeks: 8, signalMagnitude: 100, isUndersaturated: false,
    description: "Tier 1 research program. Extremely competitive."
  }
];

export function generateOpportunities(profile: StudentProfile): OpportunityResult {
  const archetypeResult = calculateArchetype(profile);
  const primaryArchetype = archetypeResult.primary;

  const results: Opportunity[] = [];
  const gapsFilled: string[] = [];

  // Determine gaps based on profile
  const hasTier1Award = profile.awards.some(a => a.tier === "Tier 1" || a.tier === "Tier 2");
  const hasDeployedProject = profile.activities.some(a => a.category === "Engineering/Product" && a.impactLevel !== "Local");

  if (!hasTier1Award) gapsFilled.push("External Validation (Missing Tier 1/2 Award)");
  if (!hasDeployedProject && primaryArchetype.id === "deep-tech-builder") gapsFilled.push("Deployed Artifact");

  OPPORTUNITY_DB.forEach(opp => {
    let alignment = 50;
    let probability = 10; // Base low probability

    // Calculate Alignment based on Archetype
    if (primaryArchetype.id === "deep-tech-builder" && (opp.id === "opp-4" || opp.id === "opp-3")) alignment = 95;
    if (primaryArchetype.id === "policy-innovator" && (opp.id === "opp-1" || opp.id === "opp-2")) alignment = 98;
    if (primaryArchetype.id === "quantitative-researcher" && (opp.id === "opp-3" || opp.id === "opp-5")) alignment = 95;

    // Adjust probability based on academics
    if (profile.academics.gpaUnweighted >= 3.9) probability += 15;
    if (opp.isUndersaturated) probability += 25; // Undersaturated = higher odds

    // Penalize highly saturated, high-signal opps unless profile is perfect
    if (!opp.isUndersaturated && opp.signalMagnitude > 90) {
      if (profile.academics.satScore && profile.academics.satScore < 1500) {
        probability = Math.max(1, probability - 20);
      }
    }

    if (alignment > 70) {
      results.push({
        ...opp,
        archetypeAlignment: alignment,
        acceptanceProbability: Math.min(95, probability)
      });
    }
  });

  // Sort by Leverage (Signal * Probability * Alignment / Time)
  results.sort((a, b) => {
    const leverageA = (a.signalMagnitude * a.acceptanceProbability * a.archetypeAlignment) / Math.max(1, a.requiredTimelineWeeks);
    const leverageB = (b.signalMagnitude * b.acceptanceProbability * b.archetypeAlignment) / Math.max(1, b.requiredTimelineWeeks);
    return leverageB - leverageA;
  });

  return {
    recommendedOpportunities: results.slice(0, 3), // Top 3
    criticalGapsFilled: gapsFilled
  };
}
