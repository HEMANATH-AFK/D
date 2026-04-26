import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const generateEmbedding = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
};

export const generateIdea = async (userProfile, existingTitles) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
    
    const prompt = `
      You are an expert AI project generator.
      User Profile: 
      - Domain: ${userProfile.domain || 'General'}
      - Skills: ${userProfile.skills?.join(', ') || 'None specified'}
      - Interests: ${userProfile.interests?.join(', ') || 'None specified'}
      
      Existing ideas to avoid: ${existingTitles.join(', ')}
      
      Generate a highly innovative, unique project idea. The idea MUST NOT be similar to the existing ideas.
      Return the output as a valid JSON object with the following fields:
      {
        "title": "Project Title",
        "description": "Detailed description of the project and the problem it solves",
        "techStack": ["Tech1", "Tech2"],
        "difficultyLevel": "Beginner/Intermediate/Advanced",
        "innovationScore": 8,
        "feasibilityScore": 7,
        "cost": "Low/Medium/High",
        "resumeValue": "Explanation of why this looks good on a resume",
        "impact": "Explanation of real-world impact"
      }
      Do not include any markdown block ticks (like \`\`\`json) in your response, just the raw JSON object.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim().replace(/^```json/i, '').replace(/```$/, '').trim();
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error generating idea:", error);
    throw new Error("Failed to generate idea");
  }
};

export const chatWithBot = async (messages, contextIdeas, retries = 2) => {
  try {
    console.log(`[RAG] Initiating chatWithBot. Messages count: ${messages.length}`);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" }); // Using exact available model
    
    const systemPrompt = `You are an AI assistant for ProjectForge AI.
You help students brainstorm and evaluate projects.
Context of their previous ideas:
${contextIdeas.length > 0 ? contextIdeas.map(i => `- ${i.title}: ${i.description}`).join('\n') : 'No previous ideas.'}

Respond helpfully and concisely.`;

    const contents = [];
    contents.push({ role: "user", parts: [{ text: systemPrompt }] });
    contents.push({ role: "model", parts: [{ text: "Understood. I will be helpful and concise." }] });

    let currentRole = null;
    let currentText = "";

    // Group consecutive messages by role to satisfy Gemini's strictly alternating requirement
    for (const msg of messages) {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      if (role === currentRole) {
        currentText += "\n\n" + msg.content;
      } else {
        if (currentRole) {
          contents.push({ role: currentRole, parts: [{ text: currentText }] });
        }
        currentRole = role;
        currentText = msg.content;
      }
    }
    if (currentRole) {
      contents.push({ role: currentRole, parts: [{ text: currentText }] });
    }

    // Must end with user role for generateContent
    if (contents[contents.length - 1].role === 'model') {
      contents.push({ role: "user", parts: [{ text: "Continue." }] });
    }

    console.log(`[RAG] Sending formatted contents to Gemini (length: ${contents.length})`);
    
    const result = await model.generateContent({ contents });
    const text = result.response.text();
    console.log(`[RAG] Received response from Gemini (length: ${text.length})`);
    
    return text;
  } catch (error) {
    console.error(`[RAG Error] chatWithBot failed:`, error.message);
    if (error.stack) console.error(error.stack);
    
    if (retries > 0) {
      console.log(`[RAG] Retrying chatWithBot... (${retries} left)`);
      return chatWithBot(messages, contextIdeas, retries - 1);
    }
    
    throw new Error("Failed to chat after retries: " + error.message);
  }
};
