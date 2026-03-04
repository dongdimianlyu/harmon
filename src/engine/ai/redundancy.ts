import { Schema, Type } from "@google/genai";
import { callAI, AI_MODELS } from "./client";
import { StudentProfile } from "../core/types";

const REDUNDANCY_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    redundancyClusters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          activities: { type: Type.ARRAY, items: { type: Type.STRING } },
          reason: { type: Type.STRING },
        },
        required: ["activities", "reason"],
      }
    },
    lowAuthenticityRiskScore: { type: Type.NUMBER }, // 0-100, higher = looks more fake/manufactured
    recommendedPruning: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          activityName: { type: Type.STRING },
          dropRationale: { type: Type.STRING },
        },
        required: ["activityName", "dropRationale"],
      }
    },
    prestigeTheaterFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: [
    "redundancyClusters", 
    "lowAuthenticityRiskScore", 
    "recommendedPruning", 
    "prestigeTheaterFlags"
  ],
};

export type AIRedundancyResult = {
  redundancyClusters: { activities: string[]; reason: string }[];
  lowAuthenticityRiskScore: number;
  recommendedPruning: { activityName: string; dropRationale: string }[];
  prestigeTheaterFlags: string[];
};

export async function detectRedundancy(
  profile: StudentProfile
): Promise<AIRedundancyResult> {
  const prompt = `
You are an elite college admissions strategist.
Evaluate actual contribution vs brand name for this student's activities.
Detect resume padding patterns and compare activity depth against superficial prestige signals.
Find clusters of redundant activities that cannibalize each other's signal (e.g. 3 different coding clubs).
Identify "Prestige Theater" (activities done purely for the resume with no real depth).

Student Profile:
${JSON.stringify(profile, null, 2)}

Output strict JSON matching the schema.
`;

  return await callAI<AIRedundancyResult>(prompt, REDUNDANCY_SCHEMA, AI_MODELS.FAST);
}
