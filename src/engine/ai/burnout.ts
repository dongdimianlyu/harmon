import { Schema, Type } from "@google/genai";
import { callAI, AI_MODELS } from "./client";
import { StudentProfile } from "../core/types";

const BURNOUT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    distortionDetected: { type: Type.BOOLEAN },
    inauthenticOptimizationScore: { type: Type.NUMBER }, // 0-100
    unsustainablePacingWarning: { type: Type.BOOLEAN },
    interventionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        },
        required: ["action", "reasoning"]
      }
    }
  },
  required: [
    "distortionDetected",
    "inauthenticOptimizationScore",
    "unsustainablePacingWarning",
    "interventionPlan"
  ],
};

export type AIBurnoutResult = {
  distortionDetected: boolean;
  inauthenticOptimizationScore: number;
  unsustainablePacingWarning: boolean;
  interventionPlan: { action: string; reasoning: string }[];
};

export async function detectBurnoutAndOverOptimization(
  profile: StudentProfile,
  deterministicBurnoutScore: number
): Promise<AIBurnoutResult> {
  const prompt = `
You are an elite college admissions strategist.
Evaluate this student's profile for burnout and over-optimization.
Detect "profile distortion" (when a student is doing things purely because an algorithm told them to, losing their authentic voice).
Detect inauthentic optimization and unsustainable pacing based on their weekly workload and activities.
Provide an intervention plan to course-correct back to authenticity and sustainability.

Student Profile:
${JSON.stringify(profile, null, 2)}

Deterministic Burnout Score: ${deterministicBurnoutScore}

Output strict JSON matching the schema.
`;

  return await callAI<AIBurnoutResult>(prompt, BURNOUT_SCHEMA, AI_MODELS.FAST);
}
