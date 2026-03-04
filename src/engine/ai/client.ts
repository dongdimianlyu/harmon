import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// We assume process.env.GEMINI_API_KEY is set
export const ai = new GoogleGenAI({});

export const AI_MODELS = {
  REASONING: "gemini-2.5-pro",
  FAST: "gemini-2.5-flash",
};

/**
 * Standard utility for AI prompts to ensure consistent JSON formatting.
 */
export async function callAI<T>(
  prompt: string, 
  schema: any, 
  model = AI_MODELS.FAST, 
  systemInstruction?: string
): Promise<T> {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: systemInstruction || "You are an elite college admissions strategist. You must evaluate profiles objectively, identifying true differentiation, redundancy, and risk. Do not output conversational filler. Output strict JSON only.",
      }
    });
    
    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(response.text) as T;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
