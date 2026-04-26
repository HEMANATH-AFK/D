import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;

function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.models) {
          console.log("✅ Available Models:");
          json.models.forEach(m => console.log(`- ${m.name}`));
        } else {
          console.log("❌ No models found or error:", json);
        }
      } catch (e) {
        console.error("❌ Failed to parse response:", e.message);
      }
    });
  }).on('error', (err) => {
    console.error("❌ Request failed:", err.message);
  });
}

listModels();
