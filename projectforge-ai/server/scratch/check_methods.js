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
          console.log("✅ Models supporting generateContent:");
          json.models.forEach(m => {
            if (m.supportedGenerationMethods.includes('generateContent')) {
              console.log(`- ${m.name}`);
            }
          });
        } else {
          console.log("❌ Error:", json);
        }
      } catch (e) { console.error(e); }
    });
  });
}

listModels();
