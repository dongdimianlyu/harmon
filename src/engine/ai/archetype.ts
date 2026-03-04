import { Schema, Type } from "@google/genai";
import { callAI, AI_MODELS } from "./client";
import { StudentProfile } from "../core/types";

const ARCHETYPE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    primary: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        justification: { type: Type.STRING },
        differentiationAngle: { type: Type.STRING },
        riskFactors: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["id", "name", "justification", "differentiationAngle", "riskFactors"],
    },
    alternates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          justification: { type: Type.STRING },
        },
        required: ["id", "name", "justification"],
      },
    },
  },
  required: ["primary", "alternates"],
};

export type AIArchetypeResult = {
  primary: {
    id: string;
    name: string;
    justification: string;
    differentiationAngle: string;
    riskFactors: string[];
  };
  alternates: {
    id: string;
    name: string;
    justification: string;
  }[];
};

export async function generateAIArchetype(
  profile: StudentProfile,
  deterministicScores: any // We can pass the deterministic output here to ground the AI
): Promise<AIArchetypeResult> {
  const prompt = `
You are an elite college admissions strategist.
Evaluate this student profile and the initial deterministic archetype scores.
Identify the strongest "Archetype" (positioning lane) for this student to stand out in elite admissions.
Look for latent themes, non-obvious angles, and cross-disciplinary spikes.

Student Profile:
${JSON.stringify(profile, null, 2)}

Deterministic Baseline Scores:
${JSON.stringify(deterministicScores, null, 2)}

Output the primary archetype, two viable alternates, the reasoning, differentiation angle, and risk factors.
Output strict JSON matching the schema.
`;

  return await callAI<AIArchetypeResult>(prompt, ARCHETYPE_SCHEMA, AI_MODELS.REASONING);
}
