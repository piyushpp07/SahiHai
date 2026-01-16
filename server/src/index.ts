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
import {
  draftLetter,
  generateLetterPDF,
  draftLetterFromText,
} from "./controllers/sarkariController";
import {
  signup,
  login,
  getMe,
  updateProfile,
  changePassword,
} from "./controllers/authController";
import { getTijoriItems, addTijoriItem } from './controllers/tijoriController';
import { checkChallan } from './controllers/challanController';
import { listAppliances } from './controllers/applianceController';
import { authMiddleware } from "./middleware/authMiddleware";
import { connectToDatabase } from "./utils/dbConnect";

const app = express();
const PORT = process.env.PORT || 3000;

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

logger.info("🚀 SahiHai Server Starting...");

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
    logger.debug("Multer fileFilter", {
      filename: file.originalname,
      mimetype: file.mimetype,
      fieldname: file.fieldname,
    });

    if (
      (file.mimetype.startsWith("image/") &&
        (file.mimetype.includes("jpeg") ||
          file.mimetype.includes("jpg") ||
          file.mimetype.includes("png"))) ||
      (file.mimetype.startsWith("audio/") &&
        (file.mimetype.includes("mpeg") ||
          file.mimetype.includes("mp4") ||
          file.mimetype.includes("m4a")))
    ) {
      logger.debug("File accepted by filter");
      cb(null, true);
    } else {
      const error = `Invalid file type. Only images (JPG, PNG) and audio (MP3, M4A) are allowed! Got: ${file.mimetype}`;
      logger.warn(error);
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

// Initialize database connection (non-blocking for serverless)
connectToDatabase().catch((err) => {
  logger.error("Failed to initialize database connection:", err);
});

// Routes
app.get("/", (req, res) => {
  logger.info("GET / - Root endpoint called");
  res.send("SahiHai Server is running!");
});

// ======================
// Authentication Routes
// ======================
app.post(
  "/api/auth/signup",
  (req, res, next) => {
    logger.info("POST /api/auth/signup - Request received", {
      email: req.body?.email,
    });
    next();
  },
  signup
);

app.post(
  "/api/auth/login",
  (req, res, next) => {
    logger.info("POST /api/auth/login - Request received", {
      email: req.body?.email,
    });
    next();
  },
  login
);

app.get(
  "/api/auth/me",
  (req, res, next) => {
    logger.info("GET /api/auth/me - Request received");
    next();
  },
  authMiddleware,
  getMe
);

app.put(
  "/api/auth/update-profile",
  (req, res, next) => {
    logger.info("PUT /api/auth/update-profile - Request received");
    next();
  },
  authMiddleware,
  updateProfile
);

app.post(
  "/api/auth/change-password",
  (req, res, next) => {
    logger.info("POST /api/auth/change-password - Request received");
    next();
  },
  authMiddleware,
  changePassword
);

// ======================
// Tijori (Warranty Vault) Routes
// ======================
app.get(
  "/api/tijori/items",
  (req, res, next) => {
    logger.info("GET /api/tijori/items - Request received");
    next();
  },
  authMiddleware,
  getTijoriItems
);

app.post(
  "/api/tijori/items",
  (req, res, next) => {
    logger.info("POST /api/tijori/items - Request received");
    next();
  },
  authMiddleware,
  addTijoriItem
);

// ======================
// RTO Challan Routes
// ======================
app.post(
  "/api/challan/check",
  (req, res, next) => {
    logger.info("POST /api/challan/check - Request received", { vehicleNumber: req.body?.vehicleNumber });
    next();
  },
  checkChallan
);

// ======================
// Appliance Routes
// ======================
app.get("/api/appliance/list", listAppliances);

// ======================
// Scanning and Analysis
// ======================
app.post(
  "/api/analyze",
  (req, res, next) => {
    logger.info("POST /api/analyze - Request received", {
      contentType: req.headers["content-type"],
      hasFile: !!req.file,
    });
    next();
  },
  upload.single("mediaFile"),
  analyzeMedia
);

app.post(
  "/api/chat/consult",
  upload.single("file"),
  (req, res, next) => {
    logger.info("POST /api/chat/consult - Request received", {
      userMessage: req.body?.userMessage?.substring(0, 50),
      hasScanContext: !!req.body?.scanContext,
    });
    next();
  },
  consultAssistant
);

// Scam Detection Route
app.post(
  "/api/scam/check",
  (req, res, next) => {
    logger.info("POST /api/scam/check - Request received", {
      contentType: req.headers["content-type"],
      hasFile: !!req.file,
    });
    next();
  },
  upload.single("file"),
  checkScam
);

// Sarkari Letter Draft Route (Audio)
app.post(
  "/api/sarkari/draft",
  (req, res, next) => {
    logger.info("POST /api/sarkari/draft - Request received", {
      contentType: req.headers["content-type"],
      hasFile: !!req.file,
    });
    next();
  },
  upload.single("file"),
  draftLetter
);

// Sarkari Letter Draft Route (Text)
app.post(
  "/api/sarkari/draft-text",
  (req, res, next) => {
    logger.info("POST /api/sarkari/draft-text - Request received", {
      complaintLength: req.body?.complaint?.length || 0,
    });
    next();
  },
  draftLetterFromText
);

// Sarkari PDF Generation Route
app.post(
  "/api/sarkari/generate-pdf",
  (req, res, next) => {
    logger.info("POST /api/sarkari/generate-pdf - Request received", {
      letterLength: req.body?.letter?.length || 0,
    });
    next();
  },
  generateLetterPDF
);

// Recent Scans Route
app.get("/api/scans", (req, res) => {
  logger.info("GET /api/scans - Fetching recent scans");
  res.status(200).json({
    scans: [],
    totalSaved: 0,
  });
});

// History and Stats
app.get(
  "/api/scans/history",
  (req, res, next) => {
    logger.info("GET /api/scans/history - Request received");
    next();
  },
  getScanHistory
);

app.get(
  "/api/scans/stats",
  (req, res, next) => {
    logger.info("GET /api/scans/stats - Request received");
    next();
  },
  getScanStats
);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error("Error caught by middleware:", {
      message: err.message,
      status: err.status || 500,
      path: req.path,
      method: req.method,
    });

    if (err.status === 400 && err.message.includes("Invalid file type")) {
      return res.status(400).json({ error: err.message });
    }

    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  }
);

// Start Server (only in non-serverless environments)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.info(`✅ Server is running on http://localhost:${PORT}`);
  });
} else {
  logger.info("✅ Running in Vercel serverless mode");
}

export default app;