import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI("AIzaSyAjZfSik4wFqWpLZa-0fcDlabJIVWLoT8E");
async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
test();
