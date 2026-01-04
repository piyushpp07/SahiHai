# SahiHai Backend (Node.js, Express, MongoDB)

## Overview

This is the backend for the SahiHai Indian Consumer Defense App. It provides APIs for:

- Bill image and audio upload/analysis
- AI-powered extraction and price-checking
- Result storage and retrieval

## Features

- **Scan Bills (Image):** Extracts items/prices from bill images using Google Gemini 1.5 Flash.
- **Record Audio:** Diagnoses car noises or summarizes legal complaints from audio using Gemini 1.5 Flash.
- **Loot Meter:** Flags overcharged items using Groq (Llama 3) with Indian market logic.
- **MongoDB:** Stores all scans and results.

## API Endpoints

### POST `/analyze`

- Accepts: `multipart/form-data` with a file (`.jpg`, `.m4a`, `.mp3`)
- Returns: Analysis result JSON

### GET `/result/:id`

- Returns: Analysis result for a scan

### GET `/scans`

- Returns: List of recent scans and total money saved

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_API_KEY=your_google_gemini_key
   GROQ_API_KEY=your_groq_key
   PORT=5051
   ```
3. Start the server:
   ```sh
   node server.js
   ```

## Deployment

- Deploy to any Node.js host (Render, Railway, Heroku, etc.)
- Expose port 5000 (or your chosen port)
- Set environment variables for production

## File Structure

- `server.js` - Main entry point
- `controllers/analyzeController.js` - Handles AI logic
- `models/Scan.js` - Mongoose model for scans

## Notes

- For local mobile testing, use your machine's IP as the API baseURL in the mobile app.
- For production, update CORS and baseURL accordingly.

---

For any issues, open an issue or PR on GitHub.
