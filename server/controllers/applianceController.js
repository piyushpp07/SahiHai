const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const fs = require("fs");
const Appliance = require("../models/Appliance");

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

// POST /api/appliance/detect
const detectAppliance = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  const { path: filePath, mimetype } = req.file;
  try {
    // Step A: OCR with Gemini
    const imagePart = fileToGenerativePart(filePath, mimetype);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt =
      "Extract the Brand Name, Model Number, and Serial Number from this image label. Return JSON.";
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    let ocrData;
    try {
      ocrData = JSON.parse(response.text());
    } catch (e) {
      ocrData = {
        brand: null,
        model: null,
        serial: null,
        raw: response.text(),
      };
    }

    // Step B: Serial decode with Groq
    const groqPrompt = `You are an Expert Appliance Technician. I will give you a Brand and Serial Number. Decode the manufacturing date based on the brand's standard serial number format (e.g., LG uses the first digit for year, Samsung uses the 8th char). Estimate the age. Return JSON: { manufacture_date: string, age_years: number, is_warranty_likely_expired: boolean, maintenance_tip: string }.`;
    const groqChatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `${groqPrompt}\nBrand: ${ocrData.brand}\nSerial: ${ocrData.serial}`,
        },
      ],
      model: "llama3-70b-8192",
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 512,
    });
    let decodeData;
    try {
      decodeData = JSON.parse(
        groqChatCompletion.choices[0]?.message?.content || "{}"
      );
    } catch (e) {
      decodeData = {
        manufacture_date: null,
        age_years: null,
        is_warranty_likely_expired: null,
        maintenance_tip:
          "Unable to decode. Please enter purchase year manually.",
      };
    }

    // Save to DB
    const newAppliance = new Appliance({
      brand: ocrData.brand,
      model: ocrData.model,
      serial: ocrData.serial,
      manufacture_date: decodeData.manufacture_date,
      age_years: decodeData.age_years,
      is_warranty_likely_expired: decodeData.is_warranty_likely_expired,
      maintenance_tip: decodeData.maintenance_tip,
      createdAt: new Date(),
    });
    await newAppliance.save();
    fs.unlinkSync(filePath);
    res.status(200).json(newAppliance);
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res
      .status(500)
      .json({ error: "Failed to process appliance.", details: error.message });
  }
};

// GET /api/appliance/list
const listAppliances = async (req, res) => {
  try {
    const appliances = await Appliance.find().sort({ createdAt: -1 });
    res.status(200).json(appliances);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appliances." });
  }
};

module.exports = { detectAppliance, listAppliances };
