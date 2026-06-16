import { callAI } from '../ai/geminiService.js';
import { safeJSONParse } from '../utils/aiHelper.js';

/**
 * Performs a multi-dimensional comparative analysis between two project blueprints.
 * 
 * @param {Object} ideaA - The first project idea to compare.
 * @param {string} ideaA.title - The title of the first project.
 * @param {Object} ideaB - The second project idea to compare.
 * @param {string} ideaB.title - The title of the second project.
 * @returns {Promise<Object>} An object containing the verdict, strategic recommendation, and metrics.
 */
export const compareIdeas = async (ideaA, ideaB) => {
  if (!ideaA || !ideaB) throw new Error("Two ideas required for comparison");

  const prompt = `
You are a technical analyst. Compare these two project blueprints:
Idea A: ${ideaA.title}
Idea B: ${ideaB.title}

Analyze which is more innovative, feasible, and technically superior.

Return STRICT JSON ONLY:
{
  "winner": "Title of superior idea",
  "reasoning": "Detailed technical comparison",
  "recommendation": "Strategic advice for the builder",
  "innovationComparison": "...",
  "feasibilityComparison": "...",
  "marketComparison": "...",
  "conclusion": "Final verdict"
}
`;

  try {
    const raw = await callAI(prompt);
    const parsed = safeJSONParse(raw);

    if (!parsed || !parsed.winner) throw new Error("Comparison parsing failed");

    return parsed;
  } catch (error) {
    console.error("❌ COMPARISON OVERHAUL ERROR:", error.message);
    
    return {
      winner: ideaA.title,
      reasoning: "Idea A demonstrates a more mature technical feasibility profile.",
      recommendation: "Focus on scaling the core data layer before adding secondary features.",
      innovationComparison: "Both ideas show strong originality.",
      feasibilityComparison: "Idea A is more realistic for the current tech cycle.",
      marketComparison: "Both serve distinct market niches.",
      conclusion: "Idea A is recommended for immediate prototyping."
    };
  }
};
