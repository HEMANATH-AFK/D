import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;

async function listModels() {
  try {
    console.log("🔍 Fetching available models via REST...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const res = await axios.get(url);
    console.log("✅ Models found:");
    res.data.models.forEach(m => {
      console.log(`- ${m.name} (${m.displayName}) [Methods: ${m.supportedGenerationMethods.join(', ')}]`);
    });
  } catch (error) {
    console.error("❌ REST API Failed:", error.response?.data || error.message);
  }
}

listModels();
