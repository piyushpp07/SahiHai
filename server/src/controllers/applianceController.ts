import { Request, Response } from 'express';
import { Appliance } from '../models/Appliance';

const logger = {
  info: (message: string, meta?: any) =>
    console.log(`[INFO] ${message}`, meta || ""),
  error: (message: string, meta?: any) =>
    console.error(`[ERROR] ${message}`, meta || ""),
};

export const listAppliances = async (req: Request, res: Response) => {
  try {
    logger.info("Fetching appliances");

    const appliances = await Appliance.find().sort({ createdAt: -1 });
    res.status(200).json(appliances);
  } catch (error: any) {
    logger.error("Failed to fetch appliances:", { error: error.message });
    res.status(500).json({
      error: "Failed to fetch appliances.",
      details: error.message,
    });
  }
};
