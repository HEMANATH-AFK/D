import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function listModels() {
  try {
    const modelList = await genAI.listModels();
    console.log("Available Models:");
    modelList.models.forEach(m => console.log(`- ${m.name}`));
  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

listModels();
