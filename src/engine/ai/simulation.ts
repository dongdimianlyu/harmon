import { Schema, Type } from "@google/genai";
import { callAI, AI_MODELS } from "./client";
import { StudentProfile } from "../core/types";

const SIMULATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    sensitivityAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          variable: { type: Type.STRING },
          impactMultiplier: { type: Type.NUMBER }, // e.g. 1.5 for 50% more impact
          explanation: { type: Type.STRING },
          realisticPathToMove: { type: Type.STRING },
        },
        required: [
          "variable", 
          "impactMultiplier", 
          "explanation", 
          "realisticPathToMove"
        ],
      }
    },
    riskFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    admissionsProbabilityBand: { type: Type.STRING }, // e.g. "Likely Reject", "Reach", "Target", "Likely"
  },
  required: ["sensitivityAnalysis", "riskFlags", "admissionsProbabilityBand"],
};

export type AISensitivityVariable = {
  variable: string;
  impactMultiplier: number;
  explanation: string;
  realisticPathToMove: string;
};

export type AISimulationResult = {
  sensitivityAnalysis: AISensitivityVariable[];
  riskFlags: string[];
  admissionsProbabilityBand: string;
};

export async function generateAISimulation(
  profile: StudentProfile,
  deterministicSimulation: any
): Promise<AISimulationResult> {
  const prompt = `
You are an elite college admissions strategist.
Evaluate the deterministic admissions simulation. 
Interpret which variable changes produce disproportionate impact (Sensitivity Analysis).
Explain why those variables matter so much for this specific student's archetype.
Suggest realistic paths to move that variable.
Avoid fake numerical precision; use probability bands instead.

Student Profile:
${JSON.stringify(profile, null, 2)}

Deterministic Simulation Output:
${JSON.stringify(deterministicSimulation, null, 2)}

Output strict JSON matching the schema.
`;

  return await callAI<AISimulationResult>(prompt, SIMULATION_SCHEMA, AI_MODELS.REASONING);
}
