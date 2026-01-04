const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

// Import controllers
const { analyzeMedia } = require('../dist/controllers/analyzeController');
const { getRecentScans } = require('../dist/controllers/scanController');
const { consultAssistant } = require('../dist/controllers/chatController');
const { getScanHistory, getScanStats } = require('../dist/controllers/historyController');
const { checkScam } = require('../dist/controllers/scamController');
const { draftLetter } = require('../dist/controllers/sarkariController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads - use memory storage on Vercel
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if ((file.mimetype.startsWith('image/') &&
      (file.mimetype.includes('jpeg') ||
        file.mimetype.includes('jpg') ||
        file.mimetype.includes('png'))) ||
      (file.mimetype.startsWith('audio/') &&
        (file.mimetype.includes('mpeg') || file.mimetype.includes('mp4')))) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images (JPG, PNG) and audio (MP3, M4A) are allowed!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGO_URI not found in .env file. Database features will be disabled.');
}

// Routes
app.get('/', (req, res) => {
  res.send('SahiHai Server is running!');
});

// Scanning and Analysis
app.post('/api/analyze', upload.single('mediaFile'), analyzeMedia);
app.post('/api/chat/consult', consultAssistant);

// Scam Detection Route
app.post('/api/scam/check', upload.single('file'), checkScam);

// Sarkari Letter Draft Route
app.post('/api/sarkari/draft', upload.single('file'), draftLetter);

// Recent Scans Route
app.get('/api/scans', (req, res) => {
  res.status(200).json({
    scans: [],
    totalSaved: 0,
  });
});

// History and Stats
app.get('/api/scans/history', getScanHistory);
app.get('/api/scans/stats', getScanStats);

module.exports = app;

