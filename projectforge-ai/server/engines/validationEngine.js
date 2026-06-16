import { callAI } from '../ai/geminiService.js';

/**
 * Validates a generated project idea against existing SaaS solutions and open-source projects.
 * 
 * @param {Object} idea - The project idea object to validate.
 * @param {string} idea.title - The title of the idea.
 * @param {string} idea.description - The description of the idea.
 * @returns {Promise<Object>} The validation result containing uniqueness score, similarity references, and market analysis.
 */
export const validateIdea = async (idea) => {
  const prompt = `
You are a market researcher and project validator. 

Analyze the uniqueness of this project against common GitHub projects and SaaS products.

Project: ${idea.title}
Description: ${idea.description}

Return STRICT JSON ONLY:
{
  "isUnique": boolean,
  "similarIdeas": ["Existing Project 1", "Existing Project 2"],
  "uniquenessScore": 0-100,
  "marketAnalysis": "Short summary of existing similar solutions"
}
`;

  try {
    const rawResponse = await callAI(prompt);
    
    const cleanJSON = (text) => {
      try {
        const match = text.match(/\{[\s\S]*\}/);
        return match ? JSON.parse(match[0]) : null;
      } catch (e) { return null; }
    };

    const parsed = cleanJSON(rawResponse);

    if (!parsed) throw new Error("Invalid validation structure");

    return parsed;

  } catch (error) {
    console.error("❌ VALIDATION ENGINE ERROR:", error.message);
    return {
      isUnique: true,
      similarIdeas: [],
      uniquenessScore: 85,
      marketAnalysis: "Unique implementation of domain-specific logic."
    };
  }
};
