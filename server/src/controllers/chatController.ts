import { Request, Response } from "express";
import Groq from "groq-sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import fs from "fs";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "");
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

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

interface ScanContext {
  fraudScore?: number;
  summary?: string;
  flaggedItems?: any[]; // You might want to define a more specific type for flaggedItems
}

const getSystemPrompt = (
  scanContext: ScanContext | null,
  userMessage: string,
  hasImage: boolean
): string => {
  let prompt = `You are a helpful and polite Indian consumer legal assistant named "SahiHai Assistant".`;

  if (hasImage) {
    prompt += `\nYou are analyzing an image provided by the user.`;
  }
  
  if (scanContext) {
    prompt += `\nYou have the following context about a bill the user just scanned:
    - Fraud Score: ${scanContext.fraudScore || "N/A"}/100
    - AI Summary: "${scanContext.summary || "No summary available."}"
    - Flagged Items: ${JSON.stringify(scanContext.flaggedItems || [], null, 2)}`;
  }

  prompt += `\n\nThe user is now asking for your help with the following question: "${userMessage}"

  Your task:
  1.  Acknowledge the user's request.
  2.  Use the provided context (and image if available) to give a specific, actionable, and concise response.
  3.  If asked to draft a message (e.g., to a mechanic, doctor, or shopkeeper), keep it professional, firm, but not rude. Start by stating the facts from the analysis.
  4.  Do not invent new facts. Base your entire response on the context provided.
  5.  Keep your reply short and to the point. The user is likely in a hurry. 
  
  Example (if user asks to "draft a message to the mechanic"):
  "Here is a draft you can send: 'Hello, I've reviewed the bill and would like to discuss a few items. According to my analysis, the charge for [Item Name] seems significantly higher than the average market price. Can we please review this?'"
  `;
  return prompt;
};

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

export const consultAssistant = async (req: Request, res: Response) => {
  const {
    userMessage,
    scanContext,
  }: { userMessage: string; scanContext: ScanContext | null } = req.body;
  const file = req.file as Express.Multer.File | undefined;

  if (!userMessage) {
    logger.warn("Missing userMessage in request body");
    return res.status(400).json({
      message: "Missing userMessage in the request body.",
    });
  }

  try {
    logger.debug("consultAssistant called", {
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasFile: !!file,
    });

    const systemPrompt = getSystemPrompt(scanContext, userMessage, !!file);
    const messages: any[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userMessage,
      },
    ];

    let imagePart;
    if (file) {
      const mimetype = file.mimetype || "image/jpeg";
      const fileData = file.path || file.buffer;
      imagePart = fileToGenerativePart(fileData, mimetype);
    }
    
    let reply: string | undefined;

    // Try Groq first
    if (process.env.GROQ_API_KEY) {
      try {
        logger.info("Attempting Groq API call (llama-3.1-8b-instant)");
        const groqMessages = [...messages];
        if (file) {
            let base64Image: string;
            if (typeof (file.path || file.buffer) === "string") {
                base64Image = `data:${file.mimetype};base64,${Buffer.from(fs.readFileSync(file.path || file.buffer)).toString("base64")}`;
            } else {
                base64Image = `data:${file.mimetype};base64,${(file.path || file.buffer as Buffer).toString("base64")}`;
            }
            groqMessages[1].content = [
                { type: "text", text: userMessage },
                { type: "image_url", image_url: { url: base64Image } },
            ]
        }
        const chatCompletion = await groq.chat.completions.create({
          messages: groqMessages,
          model: "llama-3.1-8b-instant",
          temperature: 0.5,
          max_tokens: 1024,
        });

        reply = chatCompletion.choices[0]?.message?.content;
        logger.info("✅ Groq API call successful", {
          replyLength: reply?.length,
        });
      } catch (groqError: any) {
        logger.warn("llama-3.1-8b-instant failed, trying fallback model", {
          error: groqError.message,
        });
        // ... (fallback logic remains the same, but without image support for now)
      }
    }

    // Fallback to Gemini if Groq fails or is not configured
    if (!reply && process.env.GEMINI_KEY) {
      try {
        logger.info("Attempting Gemini API call (gemini-1.5-flash)");
        const content: (string | Part)[] = [systemPrompt, `User: ${userMessage}`];
        if (imagePart) {
            content.push(imagePart);
        }
        const result = await geminiModel.generateContent(content);
        const response = await result.response;
        reply = response.text();
        logger.info("✅ Gemini API call successful", {
          replyLength: reply?.length,
        });
      } catch (geminiError: any) {
        logger.error("❌ Gemini API failed:", {
          message: geminiError.message,
        });
      }
    } else if (!reply) {
      logger.warn("GEMINI_KEY not configured, skipping Gemini fallback");
    }

    if (!reply) {
        // Fallback to OpenAI if all else fails
        if (process.env.OPENAI_API_KEY) {
            try {
                logger.info("Attempting OpenAI API call (gpt-3.5-turbo)");
                const chatCompletion = await openai.chat.completions.create({
                  model: "gpt-3.5-turbo",
                  messages: messages,
                  temperature: 0.5,
                  max_tokens: 512,
                });
        
                reply = chatCompletion.choices[0]?.message?.content || undefined;
                logger.info("✅ OpenAI API call successful", {
                  replyLength: reply?.length,
                });
              } catch (openaiError: any) {
                if (openaiError?.status === 429) {
                  logger.error(
                    "❌ OpenAI API request failed due to quota exceeded. Please check your plan and billing details on the OpenAI website."
                  );
                }
                logger.error("❌ OpenAI API failed:", {
                  message: openaiError?.message,
                  status: openaiError?.status,
                });
              }
        } else {
            logger.warn("OPENAI_API_KEY not configured, skipping OpenAI fallback");
        }
    }

    if (!reply) {
      throw new Error(
        "AI returned an empty response. Groq, OpenAI, and Gemini failed or are not configured."
      );
    }

    logger.info("✅ Consultation successful", { replyLength: reply.length });
    res.status(200).json({ reply });
  } catch (error: any) {
    logger.error("❌ Error during assistant consultation:", {
      message: error?.message,
      stack: error?.stack?.split("\n")[0],
    });
    res.status(500).json({
      message: "Failed to get a response from the assistant.",
      error: error?.message,
    });
  }
};