import { Request, Response } from 'express';
import { Appliance } from '../models/Appliance';

const logger = {
  info: (message: string, meta?: any) =>
    console.log(`[INFO] ${message}`, meta || ""),
  error: (message: string, meta?: any) =>
    console.error(`[ERROR] ${message}`, meta || ""),
};

const DUMMY_APPLIANCES = [
    {
        brand: "LG",
        model: "CoolBreeze 5000",
        serial: "LG-ABC-12345",
        age_years: 2,
        is_warranty_likely_expired: false,
        maintenance_tip: "Clean the filters every 3 months for optimal performance."
    },
    {
        brand: "Samsung",
        model: "FrostMaster Pro",
        serial: "SAM-XYZ-67890",
        age_years: 5,
        is_warranty_likely_expired: true,
        maintenance_tip: "Defrost the freezer twice a year to prevent ice buildup."
    },
    {
        brand: "Whirlpool",
        model: "WaveClean 300",
        serial: "WHP-LMN-13579",
        age_years: 1,
        is_warranty_likely_expired: false,
        maintenance_tip: "Don't overload the machine to ensure clothes are cleaned properly."
    }
];

export const listAppliances = async (req: Request, res: Response) => {
  try {
    logger.info("Fetching appliances");

    // Check if there are any appliances in the DB
    const applianceCount = await Appliance.countDocuments();

    // If no appliances, populate with dummy data
    if (applianceCount === 0) {
      logger.info("No appliances found. Populating with dummy data.");
      await Appliance.insertMany(DUMMY_APPLIANCES);
    }

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
