import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import path from "path";

// Logger utility
const logger = {
  info: (msg: string, data?: any) =>
    console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, data || ""),
  error: (msg: string, error?: any) =>
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, error || ""),
  warn: (msg: string, data?: any) =>
    console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, data || ""),
  debug: (msg: string, data?: any) =>
    console.log(`[DEBUG] ${new Date().toISOString()} - ${msg}`, data || ""),
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);
const geminiModel = genAI.getGenerativeModel({
  model: "models/gemini-2.0-flash",
});

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
    size: buffer.length,
  });

  // Standardized JSON Schema for response
  const jsonSchema = `
  {
    "items": [{"name": "string", "price": number}],
    "total": number,
    "scam_score": number,
    "summary": "string"
  }
  `;

  const systemPrompt = `
  You are an expert Indian market bill analyzer and fraud detector.
  Analyze the provided image (bill/invoice).
  Extract items and prices.
  Calculate the total.
  Assess if the prices are fair for the Indian market (Delhi/Mumbai rates).
  Provide a scam_score (0-100) where 0 is fair and 100 is a scam/overcharge.
  Provide a brief summary of your analysis.
  
  Return ONLY valid JSON matching this structure:
  ${jsonSchema}
  `;

  let analysisResult: any = null;
  let usedModel = "";

  try {
    if (mimetype.startsWith("image/")) {
      const base64Image = `data:${mimetype};base64,${buffer.toString(
        "base64"
      )}`;

      // Step 1: Try Groq (Primary)
      try {
        logger.info(
          "analyzeMedia: Attempting Primary Analysis with Groq (llama-3.2-11b-vision-preview)"
        );

        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: systemPrompt },
                {
                  type: "image_url",
                  image_url: {
                    url: base64Image,
                  },
                },
              ] as any,
            },
          ],
          model: "llama-3.2-11b-vision-preview",
          temperature: 0.1,
          max_tokens: 1024,
          response_format: { type: "json_object" },
        });

        const content = chatCompletion.choices[0]?.message?.content;
        if (content) {
          analysisResult = JSON.parse(content);
          usedModel = "Groq (llama-3.2-11b-vision-preview)";
          logger.info("✅ Groq analysis successful");
        } else {
          throw new Error("Empty response from Groq");
        }
      } catch (groqError: any) {
        logger.warn("⚠️ Groq analysis failed, switching to fallback", {
          error: groqError.message,
        });

        // Step 2: Fallback to Gemini
        try {
          logger.info(
            "analyzeMedia: Attempting Backup Analysis with Gemini (models/gemini-2.0-flash)"
          );

          const imagePart = fileToGenerativePart(buffer, mimetype);
          const result = await geminiModel.generateContent([
            systemPrompt,
            imagePart,
          ]);
          const response = await result.response;
          const text = response.text();

          // Clean up markdown code blocks if present
          const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

          analysisResult = JSON.parse(cleanText);
          usedModel = "Gemini (models/gemini-2.0-flash)";
          logger.info("✅ Gemini analysis successful");
        } catch (geminiError: any) {
          logger.error("❌ Both Primary and Backup models failed", {
            error: geminiError.message,
          });
          return res.status(500).json({
            message: "Analysis failed on both primary and backup services.",
            error: geminiError.message,
          });
        }
      }
    } else if (mimetype.startsWith("audio/")) {
      // Audio handling - Gemini only
      try {
        logger.info("analyzeMedia: Processing audio with Gemini");
        const audioPart = fileToGenerativePart(buffer, mimetype);
        const prompt =
          'Listen to this. If it\'s a mechanical noise, diagnose it. If it\'s a voice complaint, summarize the legal issue. Return JSON: { "summary": "string", "scam_score": 0, "items": [], "total": 0 }';

        const result = await geminiModel.generateContent([prompt, audioPart]);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

        analysisResult = JSON.parse(cleanText);
        usedModel = "Gemini (Audio)";
        logger.info("✅ Gemini audio analysis successful");
      } catch (e: any) {
        logger.error("❌ Audio analysis failed", { error: e.message });
        return res
          .status(500)
          .json({ message: "Audio analysis failed", error: e.message });
      }
    } else {
      return res
        .status(400)
        .json({
          message:
            "Unsupported file type. Only images and audio are supported.",
        });
    }

    // Step 3: Standardize Response
    const finalResult = {
      items: analysisResult?.items || [],
      total: analysisResult?.total || 0,
      scam_score: analysisResult?.scam_score || 0,
      summary: analysisResult?.summary || "No summary provided",
      usedModel,
      mediaType: mimetype.startsWith("image/") ? "image" : "audio",
    };

    res.status(200).json(finalResult);
  } catch (error: unknown) {
    logger.error("❌ Error during media analysis:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split("\n")[0] : undefined,
    });
    res.status(500).json({
      message: "Failed to analyze media.",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }
};
