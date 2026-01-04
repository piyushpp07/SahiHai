import { Request, Response } from "express";
import {
  performOCR,
  analyzePricing,
  AnalysisResult,
} from "../services/aiService";
import { Scan, IScan } from "../models/Scan";
import mongoose from "mongoose";

/**
 * Handles the bill scan request.
 * 1. Receives an image file.
 * 2. Performs OCR to extract data.
 * 3. Analyzes the data for pricing issues.
 * 4. Saves the result to the database.
 * 5. Returns the analysis result.
 */
export const scanBill = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded." });
  }

  const deviceId = req.headers["x-device-id"] as string;

  // Quick check for DB connection
  if (mongoose.connection.readyState !== 1) {
    console.warn("MongoDB not connected. Skipping database save.");
  }

  try {
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Step 1: Perform OCR
    const extractedData = await performOCR(imageBuffer, mimeType);

    // Step 2: Analyze Pricing
    const analysisResult: AnalysisResult = await analyzePricing(extractedData);

    // Step 3: Save to MongoDB (if connected)
    if (mongoose.connection.readyState === 1) {
      const newScan = new Scan({
        ...analysisResult,
        originalImage: req.file.originalname, // In a real app, you'd save to S3 and store the URL
        deviceId: deviceId, // Save the device ID
      });
      await newScan.save();
    }

    // Step 4: Return result to client
    res.status(200).json(analysisResult);
  } catch (error) {
    console.error("Error in scan pipeline:", error);
    if (error instanceof Error) {
      // Simple error check for OCR failures
      if (error.message.includes("OCR")) {
        return res
          .status(422)
          .json({
            message:
              "Could not read text from image. Please try a clearer photo.",
          });
      }
      return res
        .status(500)
        .json({ message: "Internal server error.", error: error.message });
    }
    res
      .status(500)
      .json({ message: "An unknown internal server error occurred." });
  }
};

/**
 * Retrieves a list of recent scans.
 */
export const getRecentScans = async (req: Request, res: Response) => {
  // Quick check for DB connection
  if (mongoose.connection.readyState !== 1) {
    console.warn("MongoDB not connected. Returning empty array.");
    return res.status(200).json([]);
  }

  try {
    const scans = await Scan.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(scans);
  } catch (error) {
    console.error("Error fetching recent scans:", error);
    res.status(500).json({ message: "Failed to fetch recent scans." });
  }
};
