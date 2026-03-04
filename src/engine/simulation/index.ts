import { StudentProfile } from "../core/types";
import { calculateSignal } from "../signal";
import { calculateArchetype } from "../archetype";

export type SimulationResult = {
  probabilityBand: "Low" | "Moderate" | "Competitive";
  confidenceInterval: [number, number]; // e.g. [15, 35] meaning 15% to 35% chance
  similarityToAdmittedCluster: number; // 0-100
  sensitivityAnalysis: {
    variable: string;
    impactMagnitude: number; // How much this variable moves the needle
    recommendation: string;
  }[];
  riskFlags: string[];
};

export function simulateAdmissions(profile: StudentProfile): SimulationResult {
  const signal = calculateSignal(profile);
  const archetype = calculateArchetype(profile).primary;

  // 1. Calculate Similarity to Admitted Cluster
  // Admitted profiles generally have signal composite > 85, high coherence, high validation
  let similarityScore = signal.compositeScore;
  
  // Penalize for specific severe gaps
  const riskFlags: string[] = [];
  
  if (profile.academics.gpaUnweighted < 3.8 && profile.targetTier === "T10") {
    similarityScore -= 10;
    riskFlags.push("GPA below admitted centroid for T10. High risk of early academic filter.");
  }
  
  if (signal.dimensions.externalValidation.score < 50 && profile.targetTier === "T5") {
    similarityScore -= 15;
    riskFlags.push("Missing Tier 1/2 external validation. Extremely rare to bypass T5 filters without this.");
  }
  
  if (archetype.alignmentScore < 60) {
    similarityScore -= 5;
    riskFlags.push("Archetype alignment is scattered. Narrative is likely too generic.");
  }

  similarityScore = Math.max(0, Math.min(100, similarityScore));

  // 2. Probability Band & CI Mapping
  let probabilityBand: SimulationResult["probabilityBand"] = "Low";
  let baseOdds = 0;

  if (profile.targetTier === "T5") {
    if (similarityScore > 90) { probabilityBand = "Competitive"; baseOdds = 30; }
    else if (similarityScore > 80) { probabilityBand = "Moderate"; baseOdds = 12; }
    else { baseOdds = 2; }
  } else if (profile.targetTier === "T10") {
    if (similarityScore > 85) { probabilityBand = "Competitive"; baseOdds = 35; }
    else if (similarityScore > 75) { probabilityBand = "Moderate"; baseOdds = 15; }
    else { baseOdds = 5; }
  } else if (profile.targetTier === "T20") {
    if (similarityScore > 80) { probabilityBand = "Competitive"; baseOdds = 45; }
    else if (similarityScore > 70) { probabilityBand = "Moderate"; baseOdds = 25; }
    else { baseOdds = 8; }
  } else {
    if (similarityScore > 70) { probabilityBand = "Competitive"; baseOdds = 60; }
    else if (similarityScore > 60) { probabilityBand = "Moderate"; baseOdds = 35; }
    else { baseOdds = 15; }
  }

  // Adjust for saturation
  baseOdds = baseOdds * (1 - (archetype.saturationIndex / 200)); // Highly saturated archetypes get a haircut
  baseOdds = Math.round(baseOdds);

  const confidenceInterval: [number, number] = [
    Math.max(1, baseOdds - 5),
    Math.min(99, baseOdds + 10)
  ];

  // 3. Sensitivity Analysis
  // Determine which variables moving up by 1 tier would increase odds most
  const sensitivityAnalysis = [];

  if (signal.dimensions.externalValidation.score < 80) {
    sensitivityAnalysis.push({
      variable: "External Validation",
      impactMagnitude: 25,
      recommendation: "Securing a Tier 2 award would increase similarity to centroid by 15%."
    });
  }

  if (profile.academics.gpaUnweighted < 3.9) {
    sensitivityAnalysis.push({
      variable: "Academic Trajectory",
      impactMagnitude: 15,
      recommendation: "Demonstrating external rigor (college classes) offsets the sub-3.9 GPA risk."
    });
  }

  if (signal.dimensions.initiativeCreation.score < 70) {
    sensitivityAnalysis.push({
      variable: "Independent Initiative",
      impactMagnitude: 20,
      recommendation: "Deploying a real-world project (non-school club) shifts you from 'participant' to 'creator' cluster."
    });
  }

  // Fallback if perfect
  if (sensitivityAnalysis.length === 0) {
    sensitivityAnalysis.push({
      variable: "Execution & Interview",
      impactMagnitude: 10,
      recommendation: "Profile matches centroid. Outcome now depends entirely on essay execution and interview performance."
    });
  }

  return {
    probabilityBand,
    confidenceInterval,
    similarityToAdmittedCluster: similarityScore,
    sensitivityAnalysis: sensitivityAnalysis.sort((a, b) => b.impactMagnitude - a.impactMagnitude),
    riskFlags
  };
}
