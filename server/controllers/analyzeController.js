const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const fs = require('fs');
const Scan = require('../models/Scan'); // Mongoose model (to be created)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Converts local file to a GoogleGenerativeAI.Part object
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

const analyzeMedia = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const { path: filePath, mimetype } = req.file;

  try {
    let geminiResult;
    let groqAnalysis;

    if (mimetype.startsWith('image/')) {
      const imagePart = fileToGenerativePart(filePath, mimetype);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = "Extract items/prices from this bill. Return JSON in the format: { items: [{ name: string, price: number }], total: number }. Ensure prices are numbers.";
      
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      geminiResult = response.text();
      
      // Attempt to parse Gemini's output
      let parsedGeminiData;
      try {
        parsedGeminiData = JSON.parse(geminiResult);
      } catch (parseError) {
        console.error("Failed to parse Gemini's image extraction output:", parseError);
        console.error("Gemini raw output:", geminiResult);
        // Fallback or error handling if Gemini doesn't return perfect JSON
        parsedGeminiData = { items: [], total: 0, rawText: geminiResult };
      }

      // Pass extracted data to Groq for price logic
      const groqPrompt = `You are an Indian Market Expert. Analyze the following items and prices from a bill. Flag items overcharged by >15% compared to typical Delhi/Mumbai market rates. Return a JSON object with a 'flaggedItems' array, where each item has 'name', 'claimedPrice', 'marketPrice' (your expert estimate), and 'overchargePercentage'. If an item is not overcharged, do not include it in 'flaggedItems'. If no items are overcharged, return an empty 'flaggedItems' array.
      
      Example Input:
      ${JSON.stringify(parsedGeminiData.items)}
      
      Example Output (if overcharged):
      {
        "flaggedItems": [
          {
            "name": "Paneer (200g)",
            "claimedPrice": 120,
            "marketPrice": 100,
            "overchargePercentage": 20
          }
        ]
      }
      
      Analyze this data: ${JSON.stringify(parsedGeminiData.items)}`;

      const groqChatCompletion = await groq.chat.completions.create({
        messages: [{ role: "system", content: groqPrompt }],
        model: "llama3-70b-8192", // Using the updated model
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1024,
      });

      groqAnalysis = JSON.parse(groqChatCompletion.choices[0]?.message?.content || '{}');

    } else if (mimetype.startsWith('audio/')) {
      const audioPart = fileToGenerativePart(filePath, mimetype);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = "Listen to this audio. If it's a mechanical noise, diagnose it. If it's a voice complaint, summarize the legal issue. Return JSON in the format: { type: 'mechanical' | 'voice', analysis: string }. Ensure analysis is a detailed string.";
      
      const result = await model.generateContent([prompt, audioPart]);
      const response = await result.response;
      geminiResult = response.text();
      
      try {
        groqAnalysis = JSON.parse(geminiResult); // Audio analysis from Gemini is the final output
      } catch (parseError) {
        console.error("Failed to parse Gemini's audio analysis output:", parseError);
        groqAnalysis = { type: "unknown", analysis: geminiResult };
      }

    } else {
      fs.unlinkSync(filePath); // Delete the unsupported file
      return res.status(400).json({ error: 'Unsupported file type.' });
    }

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    // Save scan result to DB
    const newScan = new Scan({
      fileType: mimetype.split('/')[0],
      originalFileName: req.file.originalname,
      geminiResponse: geminiResult,
      groqResponse: groqAnalysis,
      // userId: req.user.id, // Assuming user authentication later
      createdAt: new Date(),
    });

    await newScan.save();

    res.status(200).json({
      message: 'Analysis complete',
      scanId: newScan._id,
      analysis: groqAnalysis, // Send Groq analysis or Gemini analysis for audio
    });

  } catch (error) {
    console.error('Error during media analysis:', error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Clean up file on error
    }
    res.status(500).json({ error: 'Failed to analyze media.', details: error.message });
  }
};

module.exports = { analyzeMedia };