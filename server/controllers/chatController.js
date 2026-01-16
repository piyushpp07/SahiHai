const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

const consultAssistant = async (req, res) => {
  try {
    // Handle both multipart/form-data (with file) and JSON (text only)
    const userMessage = req.body.userMessage || "";
    const scanContext = req.body.scanContext
      ? JSON.parse(req.body.scanContext)
      : {};
    const file = req.file;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = `You are SahiHai AI, a smart legal and consumer rights assistant for India.
    User Query: "${userMessage}"
    
    Instructions:
    1. If an image/document is provided, analyze it for scams, overcharges, or legal clauses.
    2. Provide actionable advice based on Indian Consumer Protection Laws.
    3. Keep answers concise but helpful.
    `;

    if (Object.keys(scanContext).length > 0) {
      prompt += `\nContext from previous scan: ${JSON.stringify(scanContext)}`;
    }

    const parts = [prompt];

    if (file) {
      const mimeType = file.mimetype;
      const filePath = file.path;
      const imagePart = fileToGenerativePart(filePath, mimeType);
      parts.push(imagePart);
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    // Cleanup uploaded file
    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);

    res.json({ assistantReply: text });
  } catch (error) {
    console.error("Chat Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Failed to process chat request" });
  }
};

module.exports = { consultAssistant };
