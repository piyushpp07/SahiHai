import { Request, Response } from "express";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
  - Fraud Score: ${scanContext.fraudScore || 'N/A'}/100
  - AI Summary: "${scanContext.summary || 'No summary available.'}"
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
  const { userMessage, scanContext }: { userMessage: string; scanContext: ScanContext } = req.body;

  if (!userMessage || !scanContext) {
    return res.status(400).json({
      message: "Missing userMessage or scanContext in the request body.",
    });
  }

  try {
    const systemPrompt = getSystemPrompt(scanContext, userMessage);

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
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 512,
    });

    const reply = chatCompletion.choices[0]?.message?.content;

    if (!reply) {
      throw new Error("AI returned an empty response.");
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error during assistant consultation with Groq:", error);
    res
      .status(500)
      .json({ message: "Failed to get a response from the assistant." });
  }
};
