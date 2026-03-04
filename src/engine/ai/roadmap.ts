import { Schema, Type } from "@google/genai";
import { callAI, AI_MODELS } from "./client";
import { StudentProfile } from "../core/types";

const ROADMAP_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    milestones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          goal: { type: Type.STRING },
          rationale: { type: Type.STRING },
          expectedSignalGain: { type: Type.STRING },
          difficultyLevel: { type: Type.STRING }, // e.g. "Moderate", "High", "Extreme"
          riskFactor: { type: Type.STRING },
          estimatedHours: { type: Type.NUMBER },
        },
        required: [
          "id", 
          "goal", 
          "rationale", 
          "expectedSignalGain", 
          "difficultyLevel", 
          "riskFactor", 
          "estimatedHours"
        ],
      }
    }
  },
  required: ["milestones"],
};

export type AIMilestone = {
  id: string;
  goal: string;
  rationale: string;
  expectedSignalGain: string;
  difficultyLevel: string;
  riskFactor: string;
  estimatedHours: number;
};

export type AIRoadmapResult = {
  milestones: AIMilestone[];
};

export async function generateAIRoadmap(
  profile: StudentProfile,
  targetArchetype: string,
  timeBudgetHours: number
): Promise<AIRoadmapResult> {
  const prompt = `
You are an elite college admissions strategist.
Generate a high-ROI 90-day roadmap for this student based on their profile, target archetype, and weekly time budget.
Propose artifact ideas aligned with the archetype.
Suggest realistic validation pathways and tiered difficulty options.
Ensure the total estimated hours across all active milestones fits within their time budget constraints.

Target Archetype: ${targetArchetype}
Time Budget (Hrs/Week available): ${timeBudgetHours}

Student Profile:
${JSON.stringify(profile, null, 2)}

Output strict JSON matching the schema.
`;

  return await callAI<AIRoadmapResult>(prompt, ROADMAP_SCHEMA, AI_MODELS.FAST);
}
