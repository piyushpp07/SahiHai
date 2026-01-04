import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import { analyzeMedia } from "./controllers/analyzeController";
import { getRecentScans } from "./controllers/scanController";
import { consultAssistant } from "./controllers/chatController";
import { getScanHistory, getScanStats } from "./controllers/historyController";
import { checkScam } from "./controllers/scamController";
import { draftLetter } from "./controllers/sarkariController";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
import path from "path";
import fs from "fs";

// Use memory storage for Vercel compatibility, disk storage for local development
const isProduction = process.env.NODE_ENV === "production";

let storage;
if (isProduction) {
  // Use memory storage in production (Vercel)
  storage = multer.memoryStorage();
} else {
  // Use disk storage in development
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });
}

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      (file.mimetype.startsWith("image/") &&
        (file.mimetype.includes("jpeg") ||
          file.mimetype.includes("jpg") ||
          file.mimetype.includes("png"))) ||
      (file.mimetype.startsWith("audio/") &&
        (file.mimetype.includes("mpeg") || file.mimetype.includes("mp4")))
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images (JPG, PNG) and audio (MP3, M4A) are allowed!"
        ) as any,
        false
      );
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected successfully."))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn(
    "MONGO_URI not found in .env file. Database features will be disabled."
  );
}

// Routes
app.get("/", (req, res) => {
  res.send("SahiHai Server is running!");
});

// Scanning and Analysis
app.post("/api/analyze", upload.single("mediaFile"), analyzeMedia);
app.post("/api/chat/consult", consultAssistant);

// Scam Detection Route
app.post("/api/scam/check", upload.single("file"), checkScam);

// Sarkari Letter Draft Route
app.post("/api/sarkari/draft", upload.single("file"), draftLetter);

// Recent Scans Route
app.get("/api/scans", (req, res) => {
  res.status(200).json({
    scans: [],
    totalSaved: 0,
  });
});

// History and Stats
app.get("/api/scans/history", getScanHistory);
app.get("/api/scans/stats", getScanStats);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
