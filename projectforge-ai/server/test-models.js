import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI("AIzaSyAjZfSik4wFqWpLZa-0fcDlabJIVWLoT8E");

async function run() {
  try {
    const request = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyAjZfSik4wFqWpLZa-0fcDlabJIVWLoT8E');
    const data = await request.json();
    console.log(data.models?.map(m => m.name));
  } catch (err) {
    console.error(err);
  }
}
run();
