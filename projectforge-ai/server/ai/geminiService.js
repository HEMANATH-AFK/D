import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// List of models to try in order of preference (CONFIRMED WORKING IN THIS ENVIRONMENT)
const SUPPORTED_MODELS = [
  "gemini-flash-latest",
  "gemini-pro-latest",
  "gemini-3.1-flash-lite-preview",
  "gemini-3.1-pro-preview"
];

export const getAIModel = (modelName) => {
  return genAI.getGenerativeModel({ model: modelName });
};

/**
 * Calls the AI service and returns RAW TEXT.
 * Delegation of parsing to engines allows for more robust regex-based extraction.
 */
export const callAI = async (prompt, requestedModel = null) => {
  const modelsToTry = requestedModel ? [requestedModel, ...SUPPORTED_MODELS] : SUPPORTED_MODELS;
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[AI Service] Attempting call with model: ${modelName}`);
      const model = getAIModel(modelName);
      const result = await model.generateContent(prompt);
      
      if (!result.response) {
        throw new Error("No response object from AI");
      }

      const text = result.response.text();
      if (!text) {
        throw new Error("Empty text in AI response");
      }
      
      return text; // Return RAW TEXT for robust engine-level parsing

    } catch (error) {
      lastError = error;
      console.warn(`[AI Service] Failed with ${modelName}:`, error.message);
      
      // If error is 404 (Model not found) or 400 (Bad Request), try next
      if (error.message.includes("404") || error.message.includes("not found") || error.message.includes("400") || error.message.includes("not supported")) {
        continue;
      }
      
      // If it's a quota or auth error, don't keep trying
      if (error.message.includes("429") || error.message.includes("expired") || error.message.includes("API key")) {
        break;
      }
    }
  }

  console.error("[AI Service] All models failed.");
  throw lastError || new Error("Neural synthesis failed across all engines");
};
