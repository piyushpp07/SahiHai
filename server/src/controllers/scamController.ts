import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
    return res.status(400).json({ error: "No file uploaded." });
  }

  const mimetype = file.mimetype || "image/jpeg";
  const fileData = file.path || file.buffer;

  try {
    const imagePart = fileToGenerativePart(fileData, mimetype);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt =
      "Analyze this screenshot. Look for keywords like 'Part-time job', 'KYC Update', 'Lottery', or suspicious URLs. Identify if this matches common Indian cyber fraud patterns. Return JSON: { isScam: boolean, riskLevel: 'High'|'Medium'|'Low', reason: string }.";
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    let scamResult;
    try {
      scamResult = JSON.parse(response.text());
    } catch (e) {
      scamResult = {
        isScam: false,
        riskLevel: "Low",
        reason: "Could not parse AI response.",
      };
    }
    // Only delete file if it's a file path (not in-memory)
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    res.status(200).json(scamResult);
  } catch (error: any) {
    // Only delete file if it's a file path
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    res.status(500).json({
      error: "Failed to analyze screenshot.",
      details: error.message,
    });
  }
};
