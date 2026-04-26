import { generateIdeas } from './engines/ideaEngine.js';
import dotenv from 'dotenv';
dotenv.config();

const mockUser = {
  skills: ['React', 'Node.js'],
  interests: ['AI', 'Sustainability'],
  domain: 'Full Stack',
  difficulty: 'Intermediate'
};

async function testEngine() {
  try {
    console.log("🚀 Testing Idea Engine...");
    const ideas = await generateIdeas(mockUser);
    console.log("✅ Success! Generated Ideas:", JSON.stringify(ideas, null, 2));
  } catch (error) {
    console.error("❌ Engine Failed:", error.message);
    if (error.stack) console.error(error.stack);
  }
}

testEngine();
