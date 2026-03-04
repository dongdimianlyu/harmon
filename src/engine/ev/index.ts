import { StudentProfile, Activity } from "../core/types";
import { calculateArchetype } from "../archetype";

export type ActivityEV = {
  activityId: string;
  activityName: string;
  expectedValue: number; // EV per hour
  signalBoost: number; // 0-100
  timeCost: number; // total hours per year
  alignmentMultiplier: number;
  recommendation: "Double Down" | "Maintain" | "Pivot" | "Drop";
  isRedundant: boolean;
  isPrestigeTheater: boolean;
  reasoning: string[];
};

export type EVResult = {
  activities: ActivityEV[];
  totalWeeklyHours: number;
  availableHoursWarning: boolean;
};

export function calculateEV(profile: StudentProfile): EVResult {
  const archetypeResult = calculateArchetype(profile);
  const primaryArchetype = archetypeResult.primary;
  
  const activitiesEv: ActivityEV[] = [];
  let totalWeeklyHours = 0;

  // Track categories for redundancy detection
  const categoryImpactMap: Record<string, { id: string, impact: number }> = {};

  profile.activities.forEach(act => {
    totalWeeklyHours += act.hoursPerWeek;
    const timeCostYearly = act.hoursPerWeek * act.weeksPerYear;
    
    // 1. Calculate Signal Boost
    let signalBoost = 10; // Base
    
    if (act.impactLevel === "International") signalBoost += 50;
    else if (act.impactLevel === "National") signalBoost += 30;
    else if (act.impactLevel === "State") signalBoost += 15;

    if (act.role.toLowerCase().includes("founder") || act.role.toLowerCase().includes("president")) {
      signalBoost += 20;
    }

    signalBoost += (act.yearsInvolved * 5); // Loyalty/Depth bonus
    signalBoost = Math.min(100, signalBoost);

    // 2. Archetype Alignment Multiplier
    // Need access to core categories of the primary archetype. 
    // We can re-evaluate based on the hardcoded BASE_ARCHETYPES or infer it.
    // For simplicity, if the activity category matches strengths/name keywords, or is core.
    // Let's assume a generic check for now.
    let alignmentMultiplier = 0.5; // low alignment base
    
    // Simple heuristic: if the archetype name implies tech and category is engineering, high multiplier
    const techWords = ["tech", "quantitative", "builder", "research"];
    const isTechArch = techWords.some(w => primaryArchetype.id.includes(w));
    
    if (
      (isTechArch && ["Engineering/Product", "Research"].includes(act.category)) ||
      (primaryArchetype.id.includes("policy") && ["Policy/Debate", "Community Service"].includes(act.category)) ||
      (primaryArchetype.id.includes("founder") && ["Business/Entrepreneurship", "Community Service"].includes(act.category)) ||
      (primaryArchetype.id.includes("creative") && ["Arts/Humanities", "Policy/Debate"].includes(act.category))
    ) {
      alignmentMultiplier = 1.5;
    }

    // 3. Prestige Theater Detection
    // High time, low impact, generic roles
    let isPrestigeTheater = false;
    if (
      (act.category === "Community Service" && act.impactLevel === "Local" && act.hoursPerWeek > 5 && !act.role.includes("Founder")) ||
      (act.name.toLowerCase().includes("model un") && act.impactLevel === "Local" && act.yearsInvolved > 2) ||
      (act.name.toLowerCase().includes("tutoring") && act.impactLevel === "Local")
    ) {
      isPrestigeTheater = true;
      alignmentMultiplier = 0.2; // Massive penalty
    }

    // 4. Calculate EV
    // EV = (Signal Boost * Alignment) / Time Cost (normalized)
    // Avoid division by zero
    const normalizedTime = Math.max(10, timeCostYearly);
    let expectedValue = (signalBoost * alignmentMultiplier * 100) / normalizedTime;
    expectedValue = Math.round(expectedValue * 10) / 10;

    // Track for redundancy
    const impactScore = signalBoost * alignmentMultiplier;
    let isRedundant = false;
    
    if (categoryImpactMap[act.category]) {
      // If there's already an activity in this category with a significantly higher impact
      if (categoryImpactMap[act.category].impact > impactScore * 1.5) {
        isRedundant = true;
      }
    } else {
      categoryImpactMap[act.category] = { id: act.id, impact: impactScore };
    }

    // 5. Generate Recommendation
    let recommendation: ActivityEV["recommendation"] = "Maintain";
    const reasoning: string[] = [];

    if (isPrestigeTheater) {
      recommendation = "Drop";
      reasoning.push("Flagged as Prestige Theater: High effort, low measurable signal.");
    } else if (isRedundant) {
      recommendation = "Drop";
      reasoning.push(`Redundant with higher-impact activity in ${act.category}.`);
    } else if (expectedValue < 2.0 && alignmentMultiplier < 1.0) {
      recommendation = "Drop";
      reasoning.push("Low EV and low alignment with primary archetype.");
    } else if (expectedValue > 10.0 && alignmentMultiplier > 1.0) {
      recommendation = "Double Down";
      reasoning.push("High EV and strong archetype alignment. Increase investment here.");
    } else if (expectedValue < 5.0 && alignmentMultiplier > 1.0) {
      recommendation = "Pivot";
      reasoning.push("Good alignment, but low signal. Pivot to higher impact level (e.g., State/National).");
    } else {
      reasoning.push("Solid baseline activity. Maintain current trajectory.");
    }

    activitiesEv.push({
      activityId: act.id,
      activityName: act.name,
      expectedValue,
      signalBoost,
      timeCost: timeCostYearly,
      alignmentMultiplier,
      recommendation,
      isRedundant,
      isPrestigeTheater,
      reasoning
    });
  });

  return {
    activities: activitiesEv.sort((a, b) => b.expectedValue - a.expectedValue),
    totalWeeklyHours,
    availableHoursWarning: totalWeeklyHours > profile.availableHoursPerWeek
  };
}
