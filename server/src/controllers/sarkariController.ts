import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import fs from "fs";
import { generateSimplePDF } from "../utils/pdfGenerator";

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
    // Step 1: Transcribe audio (Gemini Primary -> Groq Whisper Backup)
    const audioPart = fileToGenerativePart(fileData, mimetype);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
    });
    const transcriptPrompt =
      "Transcribe this audio. The user may speak in Hindi, English, or Hinglish.";

    let transcript = "";
    try {
      logger.info(
        "sarkariController: Attempting Gemini transcription with models/gemini-2.0-flash"
      );
      const transcriptResult = await model.generateContent([
        transcriptPrompt,
        audioPart,
      ]);
      transcript = (await transcriptResult.response).text();
      logger.info("✅ Gemini transcription successful");
    } catch (geminiError: any) {
      logger.warn("⚠️ Gemini transcription failed, switching to Groq Whisper", {
        error: geminiError.message,
      });

      try {
        // Fallback to Groq Whisper
        // Note: Groq requires a file stream or buffer for audio
        if (file.path && fs.existsSync(file.path)) {
          const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(file.path),
            model: "whisper-large-v3",
            response_format: "text",
            language: "en", // Or auto-detect if supported/omitted, but 'en' or 'hi' might be needed. Whisper v3 is good at multi-lingual.
            // prompt: "The user may speak in Hindi, English, or Hinglish." // Optional prompt
          });
          transcript = transcription as unknown as string; // response_format: 'text' returns string
          logger.info("✅ Groq Whisper transcription successful");
        } else {
          throw new Error("File path required for Groq Whisper");
        }
      } catch (groqError: any) {
        logger.error("❌ Both Gemini and Groq transcription failed", {
          error: groqError.message,
        });
        transcript =
          "Audio transcription failed. Please provide your complaint in text format.";
      }
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
        logger.warn("Both Groq models failed, trying Gemini fallback", {
          error: fallbackError.message,
        });

        try {
          // Fallback to Gemini
          const geminiResult = await model.generateContent(groqPrompt);
          letter = (await geminiResult.response).text();
          logger.info("✅ Gemini letter drafting successful");
        } catch (geminiDraftError: any) {
          logger.error("All AI models failed for letter drafting", {
            error: geminiDraftError.message,
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

// New endpoint: Generate PDF from letter text
export const generateLetterPDF = async (req: Request, res: Response) => {
  try {
    const { letter, userInfo } = req.body;

    if (!letter || typeof letter !== "string" || letter.trim() === "") {
      logger.warn("generateLetterPDF: No letter content provided");
      return res.status(400).json({ error: "Letter content is required." });
    }

    logger.info("generateLetterPDF: Generating PDF", {
      letterLength: letter.length,
      hasUserInfo: !!userInfo,
    });

    // Generate and stream PDF directly to response
    generateSimplePDF(res, letter);

    logger.info("✅ PDF generation successful");
  } catch (error: any) {
    logger.error("❌ Failed to generate PDF", { error: error.message });
    res.status(500).json({
      error: "Failed to generate PDF.",
      details: error.message,
    });
  }
};

// New endpoint: Draft letter from text (without audio)
export const draftLetterFromText = async (req: Request, res: Response) => {
  try {
    const { complaint } = req.body;

    if (
      !complaint ||
      typeof complaint !== "string" ||
      complaint.trim() === ""
    ) {
      logger.warn("draftLetterFromText: No complaint text provided");
      return res.status(400).json({ error: "Complaint text is required." });
    }

    logger.info("draftLetterFromText: Processing text complaint", {
      complaintLength: complaint.length,
    });

    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
    });

    const groqPrompt = `You are an Indian Legal Aide. The user has this complaint: "${complaint}". Draft a formal letter to the relevant department (e.g., Electricity Board, Municipal Corporation) citing relevant Indian Consumer Protection Acts. Keep it professional.`;

    let letter = "";

    // Try Groq first
    try {
      logger.info("draftLetterFromText: Attempting Groq letter drafting");
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
      logger.warn("Groq failed, trying Gemini fallback", {
        error: groqError.message,
      });

      try {
        // Fallback to Gemini
        const geminiResult = await model.generateContent(groqPrompt);
        letter = (await geminiResult.response).text();
        logger.info("✅ Gemini letter drafting successful");
      } catch (geminiError: any) {
        logger.error("All AI models failed for letter drafting", {
          error: geminiError.message,
        });
        letter = `Dear Sir/Madam,

I am writing to formally lodge a complaint regarding: ${complaint}

As per the Consumer Protection Act, 2019, I request your immediate attention to resolve this matter. Please investigate and provide a suitable resolution within the stipulated timeframe.

Thank you for your attention to this matter.

Sincerely,
[Your Name]

(Note: This is a basic template as AI drafting services are temporarily unavailable)`;
      }
    }

    res.status(200).json({ letter });
  } catch (error: any) {
    logger.error("❌ Failed to draft letter from text", {
      error: error.message,
    });
    res.status(500).json({
      error: "Failed to draft letter.",
      details: error.message,
    });
  }
};
