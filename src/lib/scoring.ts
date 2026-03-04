import type { StudentProfile } from "@/engine/core/types";
import { calculateSignal } from "@/engine/signal";
import { calculateArchetype } from "@/engine/archetype";
import { calculateEV } from "@/engine/ev";

// Adapt the legacy UI to use the new Engine outputs

export function calculateProfileScores(profile: StudentProfile) {
  const signal = calculateSignal(profile);
  
  return {
    academic: signal.dimensions.academicStrength.score,
    intellectualVitality: signal.dimensions.intellectualVitality.score,
    extracurricular: signal.dimensions.initiativeCreation.score, // mapped
    leadership: signal.dimensions.leadershipDepth.score,
    narrative: signal.dimensions.narrativeCoherence.score,
    composite: signal.compositeScore,
    differentiation: signal.dimensions.externalValidation.score, // mapped
    trend: "rising" as const, // Hardcoded for now until we build historic tracking
  };
}

export function determineCluster(profile: StudentProfile) {
  const arch = calculateArchetype(profile).primary;
  
  return {
    id: arch.id,
    label: arch.name,
    description: arch.winCondition,
    saturation: arch.saturationIndex,
    insight: `Your profile aligns most closely with ${arch.name}. Saturation is at ${arch.saturationIndex}%. Key strength: ${arch.keyStrengths[0]}`,
  };
}

export function generateAlerts(profile: StudentProfile) {
  const alerts: any[] = [];
  const arch = calculateArchetype(profile);
  
  arch.guardrailFlags.forEach((flag, i) => {
    alerts.push({
      id: `alert-${i}`,
      type: "narrative" as const,
      severity: "high" as const,
      title: "Archetype Misalignment",
      description: flag,
    });
  });

  return alerts;
}

export function generateHighROIMoves(profile: StudentProfile) {
  const ev = calculateEV(profile);
  const moves: any[] = [];
  
  ev.activities.slice(0, 3).forEach((act, i) => {
    moves.push({
      id: `move-${i}`,
      title: act.recommendation === "Drop" ? `Drop ${act.activityName}` : `Scale ${act.activityName}`,
      description: act.reasoning[0] || "Strategic pivot recommended.",
      priority: act.recommendation === "Drop" || act.recommendation === "Double Down" ? "essential" as const : "recommended" as const,
      estimatedImpact: Math.round(act.expectedValue),
      timeIntensity: act.timeCost > 100 ? "high" as const : act.timeCost > 50 ? "medium" as const : "low" as const,
    });
  });
  
  return moves;
}

export function generateStrengthTiles(profile: StudentProfile) {
  const signal = calculateSignal(profile);
  
  const mapToTier = (score: number) => {
    if (score >= 90) return 5;
    if (score >= 80) return 4;
    if (score >= 70) return 3;
    if (score >= 60) return 2;
    return 1;
  };

  return [
    {
      key: "academic",
      label: "Academic Trajectory",
      description: "GPA, Rigor, Testing",
      tier: mapToTier(signal.dimensions.academicStrength.score),
      accent: ["rgba(56, 189, 248, 0.5)", "rgba(56, 189, 248, 0)"],
      explanation: "Derived from GPA, AP count, and intended major competitiveness.",
      strategicMove: signal.dimensions.academicStrength.fastestLeverageAction,
    },
    {
      key: "impact",
      label: "Initiative & Impact",
      description: "Scale of projects/orgs",
      tier: mapToTier(signal.dimensions.initiativeCreation.score),
      accent: ["rgba(167, 139, 250, 0.5)", "rgba(167, 139, 250, 0)"],
      explanation: "Evaluates the independent creation and scale of your extracurriculars.",
      strategicMove: signal.dimensions.initiativeCreation.fastestLeverageAction,
    },
    {
      key: "validation",
      label: "External Validation",
      description: "Awards & Recognition",
      tier: mapToTier(signal.dimensions.externalValidation.score),
      accent: ["rgba(251, 146, 60, 0.5)", "rgba(251, 146, 60, 0)"],
      explanation: "Based on the highest tier of competitions or external review you have passed.",
      strategicMove: signal.dimensions.externalValidation.fastestLeverageAction,
    },
    {
      key: "narrative",
      label: "Theme Coherence",
      description: "Archetype alignment",
      tier: mapToTier(signal.dimensions.narrativeCoherence.score),
      accent: ["rgba(52, 211, 153, 0.5)", "rgba(52, 211, 153, 0)"],
      explanation: "How well your activities map to a single, undeniable archetype.",
      strategicMove: signal.dimensions.narrativeCoherence.fastestLeverageAction,
    },
  ] as any[];
}
