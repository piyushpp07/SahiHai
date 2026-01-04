import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import fs from "fs";

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

// Initialize Gemini (Backup)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "");
const geminiModel = genAI.getGenerativeModel({
  model: "models/gemini-2.0-flash",
});

// Initialize Groq (Primary)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });

function fileToGenerativePart(pathOrBuffer: string | Buffer, mimeType: string) {
  let data: string;

  if (typeof pathOrBuffer === "string") {
    // File path - read from disk
    data = Buffer.from(fs.readFileSync(pathOrBuffer)).toString("base64");
  } else {
    // Buffer - convert directly
    data = (pathOrBuffer as Buffer).toString("base64");
  }

  return {
    inlineData: {
      data,
      mimeType,
    },
  };
}

export const checkScam = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;

  if (!file) {
    logger.warn("checkScam: No file uploaded");
    return res.status(400).json({ error: "No file uploaded." });
  }

  // Check if GEMINI_KEY is configured
  if (
    !process.env.GEMINI_KEY ||
    process.env.GEMINI_KEY === "YOUR_GEMINI_API_KEY_HERE"
  ) {
    logger.error("checkScam: GEMINI_KEY not configured properly");
    return res.status(500).json({
      error:
        "Gemini API key not configured. Please check server environment variables.",
      missingKey: "GEMINI_KEY",
    });
  }

  const mimetype = file.mimetype || "image/jpeg";
  const fileData = file.path || file.buffer;

  logger.info("checkScam: Processing scam detection", {
    fileSize:
      typeof fileData === "string" ? "file path" : (fileData as Buffer).length,
    mimetype,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });

  const prompt =
    "Analyze this screenshot. Look for keywords like 'Part-time job', 'KYC Update', 'Lottery', or suspicious URLs. Identify if this matches common Indian cyber fraud patterns. Return JSON: { isScam: boolean, riskLevel: 'High'|'Medium'|'Low', reason: string }.";

  let resultData: any = null;

  try {
    // Step 1: Try Groq (Primary)
    try {
      logger.info(
        "checkScam: Attempting Primary Analysis with Groq (llama-4-scout-17b-16e-instruct)"
      );

      let base64Image: string;
      if (typeof fileData === "string") {
        base64Image = `data:${mimetype};base64,${Buffer.from(
          fs.readFileSync(fileData)
        ).toString("base64")}`;
      } else {
        base64Image = `data:${mimetype};base64,${(fileData as Buffer).toString(
          "base64"
        )}`;
      }

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: base64Image,
                },
              },
            ] as any,
          },
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.1,
        max_tokens: 1024,
        response_format: { type: "json_object" },
      });

      const content = chatCompletion.choices[0]?.message?.content;
      if (content) {
        resultData = JSON.parse(content);
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
        logger.debug("checkScam: Converting file to generative part");
        const imagePart = fileToGenerativePart(fileData, mimetype);

        logger.info(
          "checkScam: Calling Gemini API with models/gemini-2.0-flash"
        );
        const result = await geminiModel.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
        resultData = JSON.parse(cleanText);
        logger.info("✅ Gemini API call successful");
      } catch (geminiError: any) {
        logger.error("❌ Both Primary and Backup models failed", {
          error: geminiError.message,
        });
        return res.status(500).json({
          error: "Scam detection temporarily unavailable",
          details: geminiError.message,
          fallbackResponse: {
            isScam: false,
            riskLevel: "Unknown",
            reason:
              "Unable to analyze due to AI service error. Please manually verify any suspicious content.",
          },
        });
      }
    }

    // Return the result
    if (resultData) {
      // Clean up file if it was saved to disk
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.json(resultData);
    }
  } catch (error: any) {
    logger.error("❌ checkScam: Error during analysis", {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      stack: error?.stack?.split("\n")[0],
    });

    // Only delete file if it's a file path
    if (file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkError) {
        logger.warn("checkScam: Failed to delete temp file", unlinkError);
      }
    }

    res.status(500).json({
      error: "Failed to analyze screenshot.",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
