import { StudentProfile, Activity, Award } from "../core/types";
import { calculateArchetype } from "../archetype";

export type SignalDimension = {
  id: string;
  name: string;
  score: number; // 0-100
  percentile: number; // vs competitive cluster
  gapToThreshold: number; // >0 means below threshold
  fastestLeverageAction: string;
};

export type SignalResult = {
  compositeScore: number;
  dimensions: {
    academicStrength: SignalDimension;
    intellectualVitality: SignalDimension;
    initiativeCreation: SignalDimension;
    leadershipDepth: SignalDimension;
    externalValidation: SignalDimension;
    narrativeCoherence: SignalDimension;
  };
};

export function calculateSignal(profile: StudentProfile): SignalResult {
  const targetThresholds = {
    T5: { academic: 95, vitality: 90, initiative: 95, leadership: 85, validation: 95, coherence: 90 },
    T10: { academic: 92, vitality: 85, initiative: 90, leadership: 80, validation: 90, coherence: 85 },
    T20: { academic: 90, vitality: 80, initiative: 85, leadership: 80, validation: 80, coherence: 80 },
    T50: { academic: 80, vitality: 70, initiative: 70, leadership: 70, validation: 70, coherence: 70 }
  };

  const threshold = targetThresholds[profile.targetTier];

  // 1. Academic Strength
  let academicScore = (profile.academics.gpaUnweighted / 4.0) * 60 + (profile.academics.courseRigor / 10) * 40;
  if (profile.academics.satScore) {
    const satNormalized = Math.max(0, (profile.academics.satScore - 1000) / 600) * 100;
    academicScore = academicScore * 0.7 + satNormalized * 0.3;
  }
  academicScore = Math.min(100, Math.round(academicScore));
  const academicPercentile = Math.max(1, Math.min(99, academicScore - (threshold.academic - 50)));

  // 2. Intellectual Vitality
  // Proxy: Hours spent in Research + unstructured/independent learning (often categorized as Research or niche interests)
  const researchHours = profile.activities
    .filter(a => a.category === "Research")
    .reduce((sum, a) => sum + (a.hoursPerWeek * a.weeksPerYear), 0);
  const vitalityScore = Math.min(100, Math.round((researchHours / 500) * 100)); // 500 hours/yr as benchmark
  const vitalityPercentile = Math.max(1, Math.min(99, vitalityScore - (threshold.vitality - 50)));

  // 3. Initiative/Creation
  // Proxy: Founder/Creator roles, Engineering/Product, Business
  const creationHours = profile.activities
    .filter(a => a.category === "Engineering/Product" || a.category === "Business/Entrepreneurship" || a.role.toLowerCase().includes("founder"))
    .reduce((sum, a) => sum + (a.hoursPerWeek * a.weeksPerYear), 0);
  const initiativeScore = Math.min(100, Math.round((creationHours / 400) * 100));
  const initiativePercentile = Math.max(1, Math.min(99, initiativeScore - (threshold.initiative - 50)));

  // 4. Leadership Depth
  // Proxy: Leadership roles over time + impact level
  const leadershipScoreRaw = profile.activities
    .filter(a => a.role.toLowerCase().includes("president") || a.role.toLowerCase().includes("captain") || a.role.toLowerCase().includes("founder") || a.role.toLowerCase().includes("director"))
    .reduce((sum, a) => {
      let multiplier = 1;
      if (a.impactLevel === "State") multiplier = 1.5;
      if (a.impactLevel === "National") multiplier = 2.5;
      if (a.impactLevel === "International") multiplier = 3.5;
      return sum + (a.yearsInvolved * multiplier * 10);
    }, 0);
  const leadershipScore = Math.min(100, Math.round(leadershipScoreRaw));
  const leadershipPercentile = Math.max(1, Math.min(99, leadershipScore - (threshold.leadership - 50)));

  // 5. External Validation
  // Proxy: Award tiers
  const validationScoreRaw = profile.awards.reduce((sum, a) => {
    switch (a.tier) {
      case "Tier 1": return sum + 100;
      case "Tier 2": return sum + 60;
      case "Tier 3": return sum + 30;
      case "Tier 4": return sum + 10;
      default: return sum;
    }
  }, 0);
  const validationScore = Math.min(100, Math.round(validationScoreRaw));
  const validationPercentile = Math.max(1, Math.min(99, validationScore - (threshold.validation - 50)));

  // 6. Narrative Coherence
  // Proxy: Archetype alignment score
  const archetypeResult = calculateArchetype(profile);
  const coherenceScore = archetypeResult.primary.alignmentScore;
  const coherencePercentile = Math.max(1, Math.min(99, coherenceScore - (threshold.coherence - 50)));

  const compositeScore = Math.round(
    (academicScore * 0.25) + 
    (validationScore * 0.20) + 
    (initiativeScore * 0.15) + 
    (coherenceScore * 0.20) + 
    (vitalityScore * 0.10) + 
    (leadershipScore * 0.10)
  );

  return {
    compositeScore,
    dimensions: {
      academicStrength: {
        id: "academic",
        name: "Academic Strength",
        score: academicScore,
        percentile: academicPercentile,
        gapToThreshold: Math.max(0, threshold.academic - academicScore),
        fastestLeverageAction: academicScore < threshold.academic ? "Increase course rigor via external dual-enrollment." : "Maintain current trajectory."
      },
      intellectualVitality: {
        id: "vitality",
        name: "Intellectual Vitality",
        score: vitalityScore,
        percentile: vitalityPercentile,
        gapToThreshold: Math.max(0, threshold.vitality - vitalityScore),
        fastestLeverageAction: vitalityScore < threshold.vitality ? "Initiate an independent research project or literature review." : "Publish ongoing research."
      },
      initiativeCreation: {
        id: "initiative",
        name: "Initiative / Creation",
        score: initiativeScore,
        percentile: initiativePercentile,
        gapToThreshold: Math.max(0, threshold.initiative - initiativeScore),
        fastestLeverageAction: initiativeScore < threshold.initiative ? "Launch a tangible product, community initiative, or revenue stream." : "Scale current initiative to state level."
      },
      leadershipDepth: {
        id: "leadership",
        name: "Leadership Depth",
        score: leadershipScore,
        percentile: leadershipPercentile,
        gapToThreshold: Math.max(0, threshold.leadership - leadershipScore),
        fastestLeverageAction: leadershipScore < threshold.leadership ? "Pivot from member to founding director of a new school/local chapter." : "Delegate operations to junior members."
      },
      externalValidation: {
        id: "validation",
        name: "External Validation",
        score: validationScore,
        percentile: validationPercentile,
        gapToThreshold: Math.max(0, threshold.validation - validationScore),
        fastestLeverageAction: validationScore < threshold.validation ? "Apply to under-saturated regional/national competitions." : "Target international tier programs."
      },
      narrativeCoherence: {
        id: "coherence",
        name: "Narrative Coherence",
        score: coherenceScore,
        percentile: coherencePercentile,
        gapToThreshold: Math.max(0, threshold.coherence - coherenceScore),
        fastestLeverageAction: coherenceScore < threshold.coherence ? "Drop 1-2 low-impact activities unrelated to primary archetype." : "Ensure application essays map directly to archetype."
      }
    }
  };
}
