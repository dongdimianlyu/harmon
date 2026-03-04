import { Schema, Type } from "@google/genai";
import { callAI, AI_MODELS } from "./client";
import { StudentProfile } from "../core/types";

const NARRATIVE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    spikeDomain: { type: Type.STRING },
    supportingEvidence: { 
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    weakNarrativeAreas: { 
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    suggestedStrengtheningActions: { 
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    replaceabilityRiskScore: { type: Type.NUMBER }, // 0-100, higher = more easily replaceable
    replaceabilityJustification: { type: Type.STRING }
  },
  required: [
    "spikeDomain", 
    "supportingEvidence", 
    "weakNarrativeAreas", 
    "suggestedStrengtheningActions", 
    "replaceabilityRiskScore", 
    "replaceabilityJustification"
  ],
};

export type AINarrativeResult = {
  spikeDomain: string;
  supportingEvidence: string[];
  weakNarrativeAreas: string[];
  suggestedStrengtheningActions: string[];
  replaceabilityRiskScore: number;
  replaceabilityJustification: string;
};

export async function generateAINarrative(
  profile: StudentProfile
): Promise<AINarrativeResult> {
  const prompt = `
You are an elite college admissions strategist.
Analyze this student's activity descriptions holistically.
Detect recurring themes, identify the strongest identity thread (the "spike"), and flag incoherence or scatter.
Crucially, evaluate the "replaceability risk" — how many other applicants have this exact same combination of activities? (e.g. generic debate + piano + tutoring = high replaceability).

Student Profile:
${JSON.stringify(profile, null, 2)}

Output strict JSON matching the schema.
`;

  return await callAI<AINarrativeResult>(prompt, NARRATIVE_SCHEMA, AI_MODELS.REASONING);
}
