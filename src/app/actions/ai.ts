"use server";

import { generateAIArchetype } from "@/engine/ai/archetype";
import { generateAINarrative } from "@/engine/ai/narrative";
import { detectRedundancy } from "@/engine/ai/redundancy";
import { generateAIRoadmap } from "@/engine/ai/roadmap";
import { generateAIOpportunities } from "@/engine/ai/opportunity";
import { generateAISimulation } from "@/engine/ai/simulation";
import { generateAIEssayFeedback } from "@/engine/ai/essay";
import { detectBurnoutAndOverOptimization } from "@/engine/ai/burnout";

import { StudentProfile } from "@/engine/core/types";
import { calculateArchetype } from "@/engine/archetype";
import { generateOpportunities } from "@/engine/opportunity";
import { simulateAdmissions } from "@/engine/simulation";
import { evaluatePsychology } from "@/engine/psych";

export async function computeAIArchetypeAction(profile: StudentProfile) {
  const deterministicResult = calculateArchetype(profile);
  try {
    const aiResult = await generateAIArchetype(profile, deterministicResult);
    return {
      primary: {
        id: aiResult.primary.id,
        name: aiResult.primary.name,
        alignmentScore: deterministicResult.primary.alignmentScore, 
        saturationIndex: deterministicResult.primary.saturationIndex, 
        viabilityScore: deterministicResult.primary.viabilityScore,
        keyStrengths: deterministicResult.primary.keyStrengths, 
        keyWeaknesses: aiResult.primary.riskFactors,
        winCondition: aiResult.primary.differentiationAngle, 
        justification: aiResult.primary.justification,
      },
      alternates: aiResult.alternates.map((alt, i) => ({
        id: alt.id,
        name: alt.name,
        alignmentScore: deterministicResult.alternates[i]?.alignmentScore || 50,
        saturationIndex: deterministicResult.alternates[i]?.saturationIndex || 50,
        viabilityScore: deterministicResult.alternates[i]?.viabilityScore || 50,
        keyStrengths: [],
        keyWeaknesses: [],
        winCondition: alt.justification,
      })),
      guardrailFlags: deterministicResult.guardrailFlags,
    };
  } catch (error) {
    console.error("AI Archetype generation failed:", error);
    return deterministicResult;
  }
}

export async function computeAINarrativeAction(profile: StudentProfile) {
  try {
    return await generateAINarrative(profile);
  } catch (error) {
    console.error("AI Narrative generation failed:", error);
    return null;
  }
}

export async function computeAIRedundancyAction(profile: StudentProfile) {
  try {
    return await detectRedundancy(profile);
  } catch (error) {
    console.error("AI Redundancy detection failed:", error);
    return null;
  }
}

export async function computeAIRoadmapAction(profile: StudentProfile, targetArchetype: string, timeBudgetHours: number) {
  try {
    return await generateAIRoadmap(profile, targetArchetype, timeBudgetHours);
  } catch (error) {
    console.error("AI Roadmap generation failed:", error);
    return null;
  }
}

export async function computeAIOpportunityAction(profile: StudentProfile) {
  const deterministicResult = generateOpportunities(profile);
  try {
    return await generateAIOpportunities(profile, deterministicResult.recommendedOpportunities);
  } catch (error) {
    console.error("AI Opportunity matching failed:", error);
    return deterministicResult; 
  }
}

export async function computeAISimulationAction(profile: StudentProfile) {
  const deterministicResult = simulateAdmissions(profile);
  try {
    return await generateAISimulation(profile, deterministicResult);
  } catch (error) {
    console.error("AI Simulation failed:", error);
    return null;
  }
}

export async function computeAIEssayFeedbackAction(profile: StudentProfile, essayText: string) {
  try {
    return await generateAIEssayFeedback(profile, essayText);
  } catch (error) {
    console.error("AI Essay feedback failed:", error);
    return null;
  }
}

export async function computeAIBurnoutAction(profile: StudentProfile) {
  const deterministicResult = evaluatePsychology(profile);
  try {
    return await detectBurnoutAndOverOptimization(profile, deterministicResult.burnoutRiskScore);
  } catch (error) {
    console.error("AI Burnout detection failed:", error);
    return null;
  }
}

