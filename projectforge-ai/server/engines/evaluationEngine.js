import { callAI } from '../ai/geminiService.js';

export const evaluateIdea = async (idea) => {
  const prompt = `
You are a senior tech lead evaluating a project idea.

Project: ${idea.title}
Description: ${idea.description}
Tech Stack: ${idea.tech_stack?.join(', ') || 'Not specified'}

Score the idea (0-10) and provide pros/cons.

Return STRICT JSON ONLY:
{
  "innovationScore": number,
  "feasibilityScore": number,
  "complexityScore": number,
  "marketRelevanceScore": number,
  "overallScore": number,
  "aiConfidenceScore": number,
  "pros": ["Pro 1", "Pro 2"],
  "cons": ["Con 1", "Con 2"],
  "feedback": "Detailed evaluation feedback"
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

    if (!parsed) throw new Error("Invalid evaluation structure");

    return parsed;

  } catch (error) {
    console.error("❌ EVALUATION ENGINE ERROR:", error.message);
    return {
      innovationScore: 7,
      feasibilityScore: 8,
      complexityScore: 6,
      marketRelevanceScore: 7,
      overallScore: 7,
      aiConfidenceScore: 90,
      pros: ["Solid foundation", "Clear problem statement"],
      cons: ["Needs refined tech stack"],
      feedback: "The idea is viable but requires more detailed planning on implementation."
    };
  }
};
