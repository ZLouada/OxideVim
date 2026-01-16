import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize standard client only if key is present to avoid immediate crash on load if missing
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateText = async (prompt: string, context: string): Promise<string> => {
  if (!ai) {
    throw new Error("API Key not found. Please check environment configuration.");
  }

  try {
    const modelId = 'gemini-3-flash-preview'; 
    const fullPrompt = `
    Context: You are an AI assistant embedded inside a Vim-like text editor. 
    The user is currently editing a file with the following content:
    ---
    ${context.substring(0, 1000)}... (truncated)
    ---
    
    User Request: ${prompt}
    
    Provide a concise, helpful response that can be directly inserted into the file. Do not wrap in markdown code blocks unless requested.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: fullPrompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service.";
  }
};
