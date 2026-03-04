import { Schema, Type } from "@google/genai";
import { callAI, AI_MODELS } from "./client";
import { StudentProfile } from "../core/types";

const ESSAY_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    themeCoherenceScore: { type: Type.NUMBER }, // 0-100
    voiceConsistencyScore: { type: Type.NUMBER }, // 0-100
    structuralCritique: { type: Type.STRING },
    tacticalRevisionInstructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    suggestedInterviewQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: [
    "themeCoherenceScore", 
    "voiceConsistencyScore", 
    "structuralCritique", 
    "tacticalRevisionInstructions", 
    "suggestedInterviewQuestions"
  ],
};

export type AIEssayResult = {
  themeCoherenceScore: number;
  voiceConsistencyScore: number;
  structuralCritique: string;
  tacticalRevisionInstructions: string[];
  suggestedInterviewQuestions: string[];
};

export async function generateAIEssayFeedback(
  profile: StudentProfile,
  essayText: string
): Promise<AIEssayResult> {
  const prompt = `
You are an elite college admissions strategist.
Evaluate this student's essay draft.
Provide structural critique (not grammar-level editing).
Analyze theme coherence with their profile's 'spike' and check voice consistency for authenticity.
Generate interview questions tied to the spike and the claims made in the essay.

Student Profile:
${JSON.stringify(profile, null, 2)}

Essay Draft:
${essayText}

Output strict JSON matching the schema.
`;

  return await callAI<AIEssayResult>(prompt, ESSAY_SCHEMA, AI_MODELS.REASONING);
}
