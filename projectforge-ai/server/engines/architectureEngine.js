import { callAI } from '../ai/geminiService.js';
import { safeJSONParse } from '../utils/aiHelper.js';

/**
 * Generates system design blueprints (frontend, backend, database, services, and deployment strategy) for an idea.
 * 
 * @param {Object} idea - The project idea details.
 * @param {string} idea.title - The title of the project.
 * @param {string[]} idea.tech_stack - The core tech stack components.
 * @returns {Promise<Object>} The system architecture design object.
 */
export const generateArchitecture = async (idea) => {
  if (!idea || !idea.title) {
    throw new Error("Missing idea context for architecture generation");
  }

  const prompt = `
You are a senior system architect. Design a robust architecture for:
Project: ${idea.title}
Tech Stack: ${idea.tech_stack?.join(', ')}

Return STRICT JSON ONLY:
{
  "frontend": {
    "framework": "string",
    "components": ["string"]
  },
  "backend": {
    "framework": "string",
    "components": ["string"]
  },
  "database": {
    "type": "string",
    "collections": ["string"]
  },
  "services": ["string"],
  "deployment": {
    "frontend": "string",
    "backend": "string",
    "database": "string"
  }
}
`;

  try {
    const raw = await callAI(prompt);
    const parsed = safeJSONParse(raw);

    if (!parsed || !parsed.frontend) {
      throw new Error("Architecture parsing failed");
    }

    return parsed;
  } catch (error) {
    console.error("❌ ARCHITECTURE OVERHAUL ERROR:", error.message);
    
    // GUARANTEED FALLBACK
    return {
      frontend: { framework: "React.js + Tailwind", components: ["Neural Interface", "State Manager", "Adaptive UI"] },
      backend: { framework: "Node.js (Express)", components: ["REST API", "Auth Gateway", "Processing Core"] },
      database: { type: "MongoDB Atlas", collections: ["Project_Artifacts", "User_Records"] },
      services: ["Neural Logic Layer", "Vector Store", "JWT Auth"],
      deployment: { frontend: "Vercel Edge", backend: "AWS / Render", database: "Cloud Atlas" }
    };
  }
};
