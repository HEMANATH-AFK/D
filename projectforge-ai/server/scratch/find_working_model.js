import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const testModels = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite-preview"
];

async function runTest() {
  for (const m of testModels) {
    try {
      console.log(`Testing ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hello");
      console.log(`✅ ${m} works!`);
      return;
    } catch (e) {
      console.log(`❌ ${m} failed: ${e.message}`);
    }
  }
}

runTest();
