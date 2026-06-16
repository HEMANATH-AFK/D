import { callAI } from '../ai/geminiService.js';
import { safeJSONParse } from '../utils/aiHelper.js';

/**
 * Suggests technical, UX, and market improvements for an existing project idea.
 * 
 * @param {Object} idea - The project idea details.
 * @param {string} idea.title - The title of the project.
 * @param {string} idea.description - The description of the project.
 * @returns {Promise<Object>} An object containing suggestions and next steps.
 */
export const suggestImprovements = async (idea) => {
  if (!idea) throw new Error("Missing idea context");

  const prompt = `
You are a senior product strategist. Suggest technical and UX upgrades for:
Project: ${idea.title}
Description: ${idea.description}

Return STRICT JSON ONLY:
{
  "suggestions": [
    { "title": "Upgrade Title", "description": "Details", "category": "Technical/UX/Market" }
  ],
  "nextSteps": ["Step 1", "Step 2"]
}
`;

  try {
    const raw = await callAI(prompt);
    const parsed = safeJSONParse(raw);

    if (!parsed || !parsed.suggestions) throw new Error("Improvement parsing failed");

    return parsed;
  } catch (error) {
    console.error("❌ IMPROVEMENT OVERHAUL ERROR:", error.message);
    
    return {
      suggestions: [
        { title: "Distributed Caching", description: "Implement Redis for sub-second latency.", category: "Technical" },
        { title: "Neural Feedback Loop", description: "Add a feedback mechanism to tune AI precision.", category: "UX" }
      ],
      nextSteps: ["Define API specs", "Setup CI/CD pipeline", "Initialize Vector Store"]
    };
  }
};
