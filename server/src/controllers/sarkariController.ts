import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const transcriptPrompt =
      "Transcribe this audio. The user may speak in Hindi, English, or Hinglish.";
    const transcriptResult = await model.generateContent([
      transcriptPrompt,
      audioPart,
    ]);
    const transcript = (await transcriptResult.response).text();

    // Step 2: Draft legal letter (Groq)
    const groqPrompt = `You are an Indian Legal Aide. The user has this complaint: "${transcript}". Draft a formal letter to the relevant department (e.g., Electricity Board, Municipal Corporation) citing relevant Indian Consumer Protection Acts. Keep it professional.`;
    const groqChatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: groqPrompt }],
      model: "llama3-70b-8192",
      response_format: { type: "text" },
      temperature: 0.7,
      max_tokens: 1024,
    });
    const letter = groqChatCompletion.choices[0]?.message?.content || "";

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
