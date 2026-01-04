import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import Groq from "groq-sdk";
import { INDIAN_MARKET_PROMPT } from "../prompts/marketPrompts";

// Initialize AI SDKs
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_KEY });

/**
 * Converts a Buffer to a GoogleGenerativeAI.Part object for Gemini.
 * @param imageBuffer The image buffer.
 * @param mimeType The MIME type of the image.
 * @returns A Part object for the Gemini API.
 */
async function bufferToGenerativePart(
  imageBuffer: Buffer,
  mimeType: string
): Promise<Part> {
  return {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType,
    },
  };
}

/**
 * Extracts text from an image using Google Gemini 1.5 Flash.
 * @param imageBuffer The buffer of the image to process.
 * @param mimeType The mime type of the image file.
 * @returns The extracted raw text or structured data from the bill.
 */
export async function performOCR(
  imageBuffer: Buffer,
  mimeType: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt =
      "Extract all text and line items from this bill. If possible, structure it as a JSON object with an 'items' array, where each object has 'item' and 'price'.";

    const imagePart = await bufferToGenerativePart(imageBuffer, mimeType);

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to ensure it's a parsable JSON string
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return cleanedText;
  } catch (error) {
    console.error("Error during OCR with Gemini:", error);
    throw new Error("Failed to perform OCR on the image.");
  }
}

// Define the expected JSON structure from the analysis AI
export interface AnalysisResult {
  fraudScore: number;
  summary: string;
  flaggedItems: Array<{
    item: string;
    claimedPrice: number;
    marketPrice: number;
    reason: string;
  }>;
}

/**
 * Analyzes the extracted bill data for overpricing using Groq (Llama 3).
 * @param extractedData The raw text or JSON string from the OCR process.
 * @returns A structured JSON object with the analysis result.
 */
export async function analyzePricing(
  extractedData: string
): Promise<AnalysisResult> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: INDIAN_MARKET_PROMPT,
        },
        {
          role: "user",
          content: `Here is the data from the bill. Please analyze it:\n\n${extractedData}`,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.2,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("AI returned an empty response.");
    }

    // The response is expected to be a JSON string, so we parse it.
    const analysis: AnalysisResult = JSON.parse(responseContent);
    return analysis;
  } catch (error) {
    console.error("Error during pricing analysis with Groq:", error);
    throw new Error("Failed to analyze pricing.");
  }
}
