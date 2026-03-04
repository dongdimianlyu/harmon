import { StudentProfile } from "../core/types";
import { calculateArchetype } from "../archetype";

export type RecommenderProfile = {
  subject: string;
  alignmentReason: string;
};

export type NarrativeResult = {
  hasSpike: boolean;
  spikeDomain: string | null;
  replaceabilityRisk: "Low" | "Moderate" | "High";
  themeCoherenceScore: number; // 0-100
  lorPlan: RecommenderProfile[];
  interviewQuestions: string[];
};

export function evaluateNarrative(profile: StudentProfile): NarrativeResult {
  const archetypeResult = calculateArchetype(profile);
  const primaryArchetype = archetypeResult.primary;

  // 1. Spike Detection
  const hoursByCategory = profile.activities.reduce((acc, act) => {
    acc[act.category] = (acc[act.category] || 0) + (act.hoursPerWeek * act.weeksPerYear);
    return acc;
  }, {} as Record<string, number>);

  const totalHours = Object.values(hoursByCategory).reduce((a, b) => a + b, 0);
  
  let spikeDomain: string | null = null;
  let hasSpike = false;

  Object.entries(hoursByCategory).forEach(([category, hours]) => {
    if (totalHours > 0 && hours / totalHours > 0.4) {
      hasSpike = true;
      spikeDomain = category;
    }
  });

  // 2. Replaceability Risk (How generic is the profile?)
  let replaceabilityRisk: "Low" | "Moderate" | "High" = "High"; // Default to high risk
  
  const hasNationalValidation = profile.awards.some(a => a.tier === "Tier 1" || a.tier === "Tier 2");
  const hasUniqueInitiative = profile.activities.some(a => a.role.toLowerCase().includes("founder") && a.impactLevel !== "Local");
  
  if (hasNationalValidation && hasUniqueInitiative) {
    replaceabilityRisk = "Low";
  } else if (hasNationalValidation || hasUniqueInitiative) {
    replaceabilityRisk = "Moderate";
  }

  // 3. Theme Coherence Scoring
  // Alignment between Intended Major, Archetype, and Spike Domain
  let themeCoherenceScore = primaryArchetype.alignmentScore;
  
  if (spikeDomain !== null) {
    const domainStr = String(spikeDomain);
    if (!primaryArchetype.name.toLowerCase().includes(domainStr.toLowerCase())) {
      // If their time is spent somewhere else than their declared archetype
      themeCoherenceScore -= 20;
    }
  }
  
  themeCoherenceScore = Math.max(0, Math.min(100, themeCoherenceScore));

  // 4. LOR Planner
  const lorPlan: RecommenderProfile[] = [];
  if (primaryArchetype.id === "deep-tech-builder") {
    lorPlan.push({ subject: "Physics/CS Teacher", alignmentReason: "Validate technical competence and grit." });
    lorPlan.push({ subject: "Humanities/English Teacher", alignmentReason: "Prove communication skills and well-roundedness to counter 'code-monkey' stereotype." });
  } else if (primaryArchetype.id === "policy-innovator") {
    lorPlan.push({ subject: "History/Gov Teacher", alignmentReason: "Validate understanding of systemic issues." });
    lorPlan.push({ subject: "External Mentor (e.g., City Council)", alignmentReason: "Provide external validation of real-world impact." });
  } else {
    lorPlan.push({ subject: "Core Subject Teacher 1", alignmentReason: "Validate academic excellence." });
    lorPlan.push({ subject: "Core Subject Teacher 2", alignmentReason: "Show intellectual vitality." });
  }

  // 5. Interview Simulator
  const interviewQuestions: string[] = [
    "Tell me about a time your project failed and how you recovered.",
    `How does your interest in ${profile.intendedMajor} connect to your work in ${spikeDomain || 'your community'}?`
  ];

  if (primaryArchetype.id === "deep-tech-builder") {
    interviewQuestions.push("Explain a complex technical challenge you overcame to a non-technical audience.");
  } else if (primaryArchetype.id === "policy-innovator") {
    interviewQuestions.push("How do you handle opposition to your policy proposals from established authorities?");
  }

  return {
    hasSpike,
    spikeDomain,
    replaceabilityRisk,
    themeCoherenceScore,
    lorPlan,
    interviewQuestions
  };
}
