const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

const draftLetter = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  const { path: filePath, mimetype } = req.file;
  try {
    // Step 1: Transcribe audio (Gemini or Whisper)
    const audioPart = fileToGenerativePart(filePath, mimetype);
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
      messages: [{ role: "system", content: groqPrompt }],
      model: "llama3-70b-8192",
      response_format: { type: "text" },
      temperature: 0.7,
      max_tokens: 1024,
    });
    const letter = groqChatCompletion.choices[0]?.message?.content || "";
    fs.unlinkSync(filePath);
    res.status(200).json({ letter });
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res
      .status(500)
      .json({ error: "Failed to draft letter.", details: error.message });
  }
};

module.exports = { draftLetter };
