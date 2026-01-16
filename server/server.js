// Appliance Age Detector
let detectAppliance, listAppliances;
try {
  ({
    detectAppliance,
    listAppliances,
  } = require("./controllers/applianceController"));
} catch {}
// Appliance Age Detector Endpoints
if (detectAppliance)
  app.post("/api/appliance/detect", upload.single("file"), detectAppliance);
if (listAppliances) app.get("/api/appliance/list", listAppliances);
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sahihai";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Multer Setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    // Ensure the upload directory exists
    require("fs").mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only images (jpg, jpeg, png) and audio (m4a, mp3)
    if (
      file.mimetype.startsWith("image/") &&
      (file.mimetype.includes("jpeg") ||
        file.mimetype.includes("jpg") ||
        file.mimetype.includes("png"))
    ) {
      cb(null, true);
    } else if (
      file.mimetype.startsWith("audio/") &&
      (file.mimetype.includes("mpeg") || file.mimetype.includes("mp4"))
    ) {
      // mpeg for mp3, mp4 for m4a
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images (JPG, PNG) and audio (MP3, M4A) are allowed!"
        ),
        false
      );
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

// Export upload middleware for use in controllers
// module.exports = { app, upload }; // No longer needed as upload is used directly here

// Import controllers
const { analyzeMedia } = require("./controllers/analyzeController");
const { consultAssistant } = require("./controllers/chatController");
const { checkScam } = require("./controllers/scamController");
const { draftLetter } = require("./controllers/sarkariController");

// Routes
app.get("/", (req, res) => {
  res.send("SahiHai Backend is running!");
});

// Media Analysis Route
app.post("/analyze", upload.single("file"), analyzeMedia);

// AI Chat Consultation Route
app.post("/api/chat/consult", upload.single("file"), consultAssistant);

// Scam Detection Route
app.post("/api/scam/check", upload.single("file"), checkScam);

// Sarkari Letter Draft Route
app.post("/api/sarkari/draft", upload.single("file"), draftLetter);

// Recent Scans Route (returns empty for now - can be integrated with DB later)
app.get("/api/scans", (req, res) => {
  res.status(200).json({
    scans: [],
    totalSaved: 0,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
