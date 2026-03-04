import { Schema, Type } from "@google/genai";
import { callAI, AI_MODELS } from "./client";
import { StudentProfile } from "../core/types";

const OPPORTUNITY_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    recommendedOpportunities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          alignmentExplanation: { type: Type.STRING },
          asymmetricAdvantage: { type: Type.STRING }, // Why is this asymmetric?
          alternativeIfRejected: { type: Type.STRING },
          signalMagnitude: { type: Type.STRING }, // "Low", "Medium", "High", "Very High"
          acceptanceProbability: { type: Type.NUMBER },
          requiredTimelineWeeks: { type: Type.NUMBER },
        },
        required: [
          "id", 
          "name", 
          "description", 
          "alignmentExplanation", 
          "asymmetricAdvantage", 
          "alternativeIfRejected", 
          "signalMagnitude", 
          "acceptanceProbability", 
          "requiredTimelineWeeks"
        ],
      }
    }
  },
  required: ["recommendedOpportunities"],
};

export type AIOpportunity = {
  id: string;
  name: string;
  description: string;
  alignmentExplanation: string;
  asymmetricAdvantage: string;
  alternativeIfRejected: string;
  signalMagnitude: string;
  acceptanceProbability: number;
  requiredTimelineWeeks: number;
};

export type AIOpportunityResult = {
  recommendedOpportunities: AIOpportunity[];
};

export async function generateAIOpportunities(
  profile: StudentProfile,
  deterministicOpportunities: any // Pass the deterministically filtered list to rank/expand
): Promise<AIOpportunityResult> {
  const prompt = `
You are an elite college admissions strategist.
Evaluate the deterministic opportunity matches and refine them using AI ranking.
Find the highest strategic leverage and differentiation impact that fits the user's constraints.
Produce asymmetric opportunities (high signal, low competition) tailored specifically to their archetype.
Provide the alignment explanation, why it offers an asymmetric advantage, and a contingency alternative.

Student Profile:
${JSON.stringify(profile, null, 2)}

Deterministic Baseline Opportunities:
${JSON.stringify(deterministicOpportunities, null, 2)}

Output strict JSON matching the schema.
`;

  return await callAI<AIOpportunityResult>(prompt, OPPORTUNITY_SCHEMA, AI_MODELS.FAST);
}
