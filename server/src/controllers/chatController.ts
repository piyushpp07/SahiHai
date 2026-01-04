import { Request, Response } from "express";
import Groq from "groq-sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "");
const geminiModel = genAI.getGenerativeModel({
  model: "models/gemini-2.0-flash",
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
  scanContext: ScanContext,
  userMessage: string
): string => {
  return `You are a helpful and polite Indian consumer legal assistant named "SahiHai Assistant". 
  Your goal is to empower the user to handle disputes over unfair billing.
  
  You have the following context about a bill the user just scanned:
  - Fraud Score: ${scanContext.fraudScore || "N/A"}/100
  - AI Summary: "${scanContext.summary || "No summary available."}"
  - Flagged Items: ${JSON.stringify(scanContext.flaggedItems || [], null, 2)}

  The user is now asking for your help with the following question: "${userMessage}"

  Your task:
  1.  Acknowledge the user's request.
  2.  Use the provided bill context to give a specific, actionable, and concise response.
  3.  If asked to draft a message (e.g., to a mechanic, doctor, or shopkeeper), keep it professional, firm, but not rude. Start by stating the facts from the analysis.
  4.  Do not invent new facts. Base your entire response on the context provided.
  5.  Keep your reply short and to the point. The user is likely in a hurry.
  
  Example (if user asks to "draft a message to the mechanic"):
  "Here is a draft you can send: 'Hello, I've reviewed the bill and would like to discuss a few items. According to my analysis, the charge for [Item Name] seems significantly higher than the average market price. Can we please review this?'"
  `;
};

export const consultAssistant = async (req: Request, res: Response) => {
  const {
    userMessage,
    scanContext,
  }: { userMessage: string; scanContext: ScanContext } = req.body;

  if (!userMessage || !scanContext) {
    logger.warn("Missing userMessage or scanContext in request body");
    return res.status(400).json({
      message: "Missing userMessage or scanContext in the request body.",
    });
  }

  try {
    logger.debug("consultAssistant called", {
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    });

    const systemPrompt = getSystemPrompt(scanContext, userMessage);

    let reply: string | undefined;

    // Try Groq first
    if (process.env.GROQ_API_KEY) {
      try {
        logger.info("Attempting Groq API call (llama-3.3-70b-versatile)");
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.5,
          max_tokens: 512,
        });

        reply = chatCompletion.choices[0]?.message?.content;
        logger.info("✅ Groq API call successful", {
          replyLength: reply?.length,
        });
      } catch (groqError: any) {
        logger.warn("llama-3.3-70b-versatile failed, trying fallback model", {
          error: groqError.message,
        });
        try {
          // Fallback to mixtral if llama fails
          const fallbackCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: userMessage,
              },
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.5,
            max_tokens: 512,
          });

          reply = fallbackCompletion.choices[0]?.message?.content;
          logger.info(
            "✅ Groq API call successful with fallback model mixtral-8x7b-32768"
          );
        } catch (fallbackError: any) {
          logger.error("❌ Both Groq models failed, falling back to OpenAI:", {
            message: fallbackError?.message,
            status: fallbackError?.status,
          });
        }
      }
    } else {
      logger.warn("GROQ_API_KEY not configured, skipping Groq");
    }

    // Fallback to OpenAI if Groq fails or is not configured
    if (!reply && process.env.OPENAI_API_KEY) {
      try {
        logger.info("Attempting OpenAI API call (gpt-3.5-turbo)");
        const chatCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature: 0.5,
          max_tokens: 512,
        });

        reply = chatCompletion.choices[0]?.message?.content || undefined;
        logger.info("✅ OpenAI API call successful", {
          replyLength: reply?.length,
        });
      } catch (openaiError: any) {
        logger.error("❌ OpenAI API failed:", {
          message: openaiError?.message,
          status: openaiError?.status,
        });
      }
    } else if (!reply) {
      logger.warn("OPENAI_API_KEY not configured, skipping OpenAI fallback");
    }

    // Fallback to Gemini if both Groq and OpenAI fail or are not configured
    if (!reply && process.env.GEMINI_KEY) {
      try {
        logger.info("Attempting Gemini API call (models/gemini-2.0-flash)");
        const result = await geminiModel.generateContent(
          `${systemPrompt}\n\nUser: ${userMessage}`
        );
        const response = await result.response;
        reply = response.text();
        logger.info("✅ Gemini API call successful", {
          replyLength: reply?.length,
        });
      } catch (geminiError: any) {
        logger.error("❌ Gemini API failed:", {
          message: geminiError?.message,
        });
      }
    } else if (!reply) {
      logger.warn("GEMINI_KEY not configured, skipping Gemini fallback");
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
