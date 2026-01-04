import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import fs from "fs";

// Import logger from a shared location or create a simple console logger
const logger = {
  info: (message: string, meta?: any) =>
    console.log(`[INFO] ${message}`, meta || ""),
  warn: (message: string, meta?: any) =>
    console.warn(`[WARN] ${message}`, meta || ""),
  error: (message: string, meta?: any) =>
    console.error(`[ERROR] ${message}`, meta || ""),
  debug: (message: string, meta?: any) =>
    console.debug(`[DEBUG] ${message}`, meta || ""),
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

export const draftLetter = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const mimetype = file.mimetype || "audio/m4a";
  const fileData = file.path || file.buffer;

  try {
    // Step 1: Transcribe audio (Gemini)
    const audioPart = fileToGenerativePart(fileData, mimetype);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const transcriptPrompt =
      "Transcribe this audio. The user may speak in Hindi, English, or Hinglish.";

    let transcript = "";
    try {
      logger.info("sarkariController: Attempting Gemini transcription");
      const transcriptResult = await model.generateContent([
        transcriptPrompt,
        audioPart,
      ]);
      transcript = (await transcriptResult.response).text();
      logger.info("✅ Gemini transcription successful");
    } catch (geminiError: any) {
      logger.error("❌ Gemini transcription failed", {
        error: geminiError.message,
      });
      transcript =
        "Audio transcription failed. Please provide your complaint in text format.";
    }

    // Step 2: Draft legal letter (Groq with fallback)
    const groqPrompt = `You are an Indian Legal Aide. The user has this complaint: "${transcript}". Draft a formal letter to the relevant department (e.g., Electricity Board, Municipal Corporation) citing relevant Indian Consumer Protection Acts. Keep it professional.`;

    let letter = "";
    try {
      logger.info(
        "sarkariController: Attempting Groq letter drafting with llama-3.3-70b-versatile"
      );
      const groqChatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: groqPrompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "text" },
        temperature: 0.7,
        max_tokens: 1024,
      });
      letter = groqChatCompletion.choices[0]?.message?.content || "";
      logger.info("✅ Groq letter drafting successful");
    } catch (groqError: any) {
      logger.warn("llama-3.3-70b-versatile failed, trying fallback model", {
        error: groqError.message,
      });
      try {
        // Fallback to mixtral if llama fails
        const fallbackCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: groqPrompt }],
          model: "mixtral-8x7b-32768",
          response_format: { type: "text" },
          temperature: 0.7,
          max_tokens: 1024,
        });
        letter = fallbackCompletion.choices[0]?.message?.content || "";
        logger.info(
          "✅ Groq letter drafting successful with fallback model mixtral-8x7b-32768"
        );
      } catch (fallbackError: any) {
        logger.error("Both Groq models failed for letter drafting", {
          error: fallbackError.message,
        });
        letter = `Dear Sir/Madam,

I am writing to formally lodge a complaint regarding: ${transcript}

As per the Consumer Protection Act, 2019, I request your immediate attention to resolve this matter. Please investigate and provide a suitable resolution within the stipulated timeframe.

Thank you for your attention to this matter.

Sincerely,
[Your Name]

(Note: This is a basic template as AI drafting services are temporarily unavailable)`;
      }
    }

    // Only delete file if it's a file path (not in-memory)
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    res.status(200).json({ letter });
  } catch (error: any) {
    // Only delete file if it's a file path
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    res.status(500).json({
      error: "Failed to draft letter.",
      details: error.message,
    });
  }
};
