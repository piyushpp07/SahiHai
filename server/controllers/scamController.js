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

const checkScam = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  const { path: filePath, mimetype } = req.file;
  try {
    const imagePart = fileToGenerativePart(filePath, mimetype);
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
    fs.unlinkSync(filePath);
    res.status(200).json(scamResult);
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res
      .status(500)
      .json({ error: "Failed to analyze screenshot.", details: error.message });
  }
};

module.exports = { checkScam };
