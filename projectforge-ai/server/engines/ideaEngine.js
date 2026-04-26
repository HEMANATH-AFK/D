import { callAI } from '../ai/geminiService.js';
import Idea from '../models/Idea.js';
import { safeJSONParse, filterDuplicates } from '../utils/aiHelper.js';

export const generateIdeas = async (userProfile, count = 3) => {
  console.log("🚀 INITIATING IDEA GENERATION...");

  try {
    // 1. Fetch ALL existing ideas for RAG-level duplication avoidance
    const existingIdeas = await Idea.find({}, 'title description').lean();
    const existingTitles = existingIdeas.map(i => i.title);

    const prompt = `
You are a senior innovation architect. 

Your task is to generate ${count} COMPLETELY NEW project ideas.

🚨 STRICT RULES:
1. DO NOT generate common patterns: Chatbots, Recommendation systems, Todo apps, E-commerce, Student Management.
2. These ideas ALREADY EXIST in the system:
${existingTitles.slice(-50).join("\n")}

👉 You MUST NOT generate anything similar to the above.

3. Each idea must introduce a NEW interaction model, data flow, or problem domain.
4. If an idea is even 40% similar to existing patterns, REJECT it internally.

User Context:
- Skills: ${userProfile.skills?.join(', ') || 'General'}
- Domain: ${userProfile.domain || 'Tech'}

Return ONLY a valid JSON array of objects:
[
  {
    "title": "Unique Title",
    "description": "High-level description",
    "problem_statement": "Real world problem",
    "solution": "Technical solution",
    "tech_stack": ["Tech1", "Tech2"],
    "uniqueness_factor": "Why this is a breakthrough"
  }
]
`;

    const rawResponse = await callAI(prompt);
    console.log("AI RAW RESPONSE RECEIVED");

    let parsed = safeJSONParse(rawResponse);

    if (!parsed || !Array.isArray(parsed)) {
      throw new Error("Invalid response structure from AI");
    }

    // 2. Similarity Filtering
    const uniqueIdeas = filterDuplicates(parsed, existingIdeas);
    
    if (uniqueIdeas.length === 0 && parsed.length > 0) {
      console.warn("⚠️ All generated ideas were duplicates. Returning best effort.");
      return parsed; // Best effort if AI fails to be unique
    }

    return uniqueIdeas.length > 0 ? uniqueIdeas : parsed;

  } catch (error) {
    console.error("❌ IDEA ENGINE OVERHAUL ERROR:", error.message);
    
    // 3. Fallback Data (Professional structure)
    return [
      {
        title: "Neural Mesh Sync",
        description: "A peer-to-peer data synchronization protocol for decentralized AI training.",
        problem_statement: "High latency in centralized model weights distribution.",
        solution: "Implementing a gossip-protocol based mesh network for gradient updates.",
        tech_stack: ["Rust", "WebRTC", "TensorFlow"],
        uniqueness_factor: "Decentralizes the training bottleneck without a master node."
      }
    ];
  }
};
