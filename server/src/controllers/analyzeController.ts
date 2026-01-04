import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import path from "path";

// Logger utility
const logger = {
  info: (msg: string, data?: any) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, data || ''),
  error: (msg: string, error?: any) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, error || ''),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, data || ''),
  debug: (msg: string, data?: any) => console.log(`[DEBUG] ${new Date().toISOString()} - ${msg}`, data || ''),
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });

// Helper to convert buffer to base64 for Gemini
function fileToGenerativePart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

export const analyzeMedia = async (req: Request, res: Response) => {
  if (!req.file) {
    logger.warn("analyzeMedia: No file uploaded");
    return res.status(400).json({ message: "No file uploaded." });
  }

  const { buffer, mimetype, originalname } = req.file;

  logger.info("analyzeMedia: Processing file", {
    filename: originalname,
    mimetype,
    size: buffer.length
  });

  let geminiOutput: string = "";
  let mediaType: "image" | "audio";

  try {
    logger.info("analyzeMedia: Checking API keys", {
      hasGemini: !!process.env.GEMINI_KEY,
      hasGroq: !!process.env.GROQ_API_KEY
    });

    const chat = geminiModel.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    if (mimetype.startsWith("image/")) {
      mediaType = "image";
      logger.info("analyzeMedia: Processing image with Gemini");
      const prompt =
        'Extract items and prices from this bill. Return the data as a JSON object with \'items\' (an array of objects with \'name\' and \'price\' properties) and \'total\' (a number) properties. Example: { "items": [ { "name": "Item1", "price": 100 }, { "name": "Item2", "price": 200 } ], "total": 300 }';
      const imagePart = fileToGenerativePart(buffer, mimetype);
      const result = await chat.sendMessage([prompt, imagePart]);
      const response = await result.response;
      geminiOutput = response.text();
      logger.debug("analyzeMedia: Gemini response received", { length: geminiOutput.length });
    } else if (mimetype.startsWith("audio/")) {
      mediaType = "audio";
      const prompt =
        'Listen to this. If it\'s a mechanical noise, diagnose it. If it\'s a voice complaint, summarize the legal issue. Return the diagnosis/summary as a JSON object with a single property, \'analysis\', containing the string result. Example: { "analysis": "Engine knocking sound, likely bearing failure." } or { "analysis": "Customer complaining about faulty product, seeking refund." }';
      const audioPart = fileToGenerativePart(buffer, mimetype);
      const result = await chat.sendMessage([prompt, audioPart]);
      const response = await result.response;
      geminiOutput = response.text();
    } else {
      return res.status(400).json({ message: "Unsupported file type." });
    }

    let parsedGeminiOutput;
    try {
      parsedGeminiOutput = JSON.parse(geminiOutput);
    } catch (parseError) {
      console.error("Gemini output is not valid JSON:", geminiOutput);
      return res
        .status(500)
        .json({
          message: "AI analysis failed to return valid JSON.",
          rawOutput: geminiOutput,
        });
    }

    let groqAnalysis = {};
    if (mediaType === "image" && parsedGeminiOutput.items) {
      const groqSystemPrompt =
        "You are an Indian Market Expert. Your task is to analyze a list of items and their prices, and flag any item that appears to be overcharged by more than 15% compared to typical Delhi/Mumbai market rates. Provide a fraud score from 0-100 (0 being fair, 100 being extreme overcharge). Return a JSON object with 'summary' (a brief overall assessment), 'fraudScore' (number), and 'flaggedItems' (an array of items that are potentially overcharged, including their original name, price, and the reason for flagging).";
      const groqUserMessage = `Here are the items extracted from a bill: ${JSON.stringify(
        parsedGeminiOutput.items
      )}. Please analyze them for overcharging.`;

      const groqChatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: groqSystemPrompt },
          { role: "user", content: groqUserMessage },
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.5,
        max_tokens: 1024,
      });
      groqAnalysis = JSON.parse(
        groqChatCompletion.choices[0]?.message?.content || "{}"
      );
    } else if (mediaType === "audio" && parsedGeminiOutput.analysis) {
      // For audio analysis, Groq can further process Gemini's summary if needed.
      // For MVP, we might just return Gemini's direct analysis or ask Groq to refine it.
      // Let's assume for MVP, Gemini's audio analysis is sufficient and Groq is not strictly needed here for "price logic".
      // If further action/legal advice is needed, that would be handled by chatController.
      groqAnalysis = {
        summary: parsedGeminiOutput.analysis,
        fraudScore: 0,
        flaggedItems: [],
      }; // Placeholder for audio
    }

    res.status(200).json({
      mediaType,
      geminiAnalysis: parsedGeminiOutput,
      groqAnalysis: groqAnalysis,
      // You might want to save this to MongoDB here
    });
  } catch (error: unknown) {
    console.error("Error during media analysis:", error);
    res
      .status(500)
      .json({
        message: "Failed to analyze media.",
        error: error instanceof Error ? error.message : String(error),
      });
  }
};
