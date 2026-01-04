require("dotenv").config();
const apiKey = process.env.GEMINI_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("No GEMINI_KEY found in environment");
  process.exit(1);
}

console.log(
  `Loaded API Key: ${apiKey.substring(0, 5)}...${apiKey.substring(
    apiKey.length - 4
  )} (Length: ${apiKey.length})`
);

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) {
      console.error("API Error:", JSON.stringify(data.error, null, 2));
    } else {
      console.log("Available Models (supporting generateContent):");
      if (data.models) {
        data.models.forEach((m) => {
          if (
            m.supportedGenerationMethods &&
            m.supportedGenerationMethods.includes("generateContent")
          ) {
            console.log(`- ${m.name}`);
          }
        });
      } else {
        console.log("No models found in response", data);
      }
    }
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

listModels();
