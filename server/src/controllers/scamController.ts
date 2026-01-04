import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "");

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

  try {
    logger.debug("checkScam: Converting file to generative part");
    const imagePart = fileToGenerativePart(fileData, mimetype);

    logger.debug("checkScam: Getting Gemini model");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      "Analyze this screenshot. Look for keywords like 'Part-time job', 'KYC Update', 'Lottery', or suspicious URLs. Identify if this matches common Indian cyber fraud patterns. Return JSON: { isScam: boolean, riskLevel: 'High'|'Medium'|'Low', reason: string }.";

    logger.info("checkScam: Calling Gemini API");
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;

    logger.debug("checkScam: Parsing AI response");
    let scamResult;
    try {
      scamResult = JSON.parse(response.text());
      logger.info("✅ checkScam: Successfully parsed response", {
        isScam: scamResult.isScam,
        riskLevel: scamResult.riskLevel,
      });
    } catch (e) {
      logger.warn("checkScam: Could not parse JSON response, using default", {
        rawResponse: response.text().substring(0, 100),
      });
      scamResult = {
        isScam: false,
        riskLevel: "Low",
        reason: "Could not parse AI response.",
      };
    }

    // Only delete file if it's a file path (not in-memory)
    if (file.path && fs.existsSync(file.path)) {
      logger.debug("checkScam: Deleting temporary file", { path: file.path });
      fs.unlinkSync(file.path);
    }

    logger.info("✅ checkScam: Analysis complete");
    res.status(200).json(scamResult);
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
