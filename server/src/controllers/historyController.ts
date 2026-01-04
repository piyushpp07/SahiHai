import { Request, Response } from 'express';
import { Scan } from '../models/Scan';
import mongoose from 'mongoose';

/**
 * Fetches all past scans for a given device, sorted by date.
 */
export const getScanHistory = async (req: Request, res: Response) => {
  const deviceId = req.headers['x-device-id'] as string;

  if (!deviceId) {
    return res.status(400).json({ message: 'x-device-id header is required.' });
  }

  try {
    const scans = await Scan.find({ deviceId }).sort({ createdAt: -1 }).limit(50);
    res.status(200).json(scans);
  } catch (error) {
    console.error('Error fetching scan history:', error);
    res.status(500).json({ message: 'Failed to fetch scan history.' });
  }
};

/**
 * Calculates and returns statistics for a given device.
 * For now, it calculates the total money saved.
 */
export const getScanStats = async (req: Request, res: Response) => {
  const deviceId = req.headers['x-device-id'] as string;

  if (!deviceId) {
    return res.status(400).json({ message: 'x-device-id header is required.' });
  }

  try {
    const stats = await Scan.aggregate([
      // Match scans for the specific device
      { $match: { deviceId: deviceId } },
      
      // Unwind the flaggedItems array to process each item individually
      { $unwind: '$flaggedItems' },
      
      // Calculate the savings for each flagged item
      {
        $project: {
          savings: { $subtract: ['$flaggedItems.claimedPrice', '$flaggedItems.marketPrice'] }
        }
      },
      
      // Group to sum up all the savings
      {
        $group: {
          _id: null, // Group all documents together
          totalSavings: { $sum: '$savings' }
        }
      }
    ]);

    const totalSavings = stats.length > 0 ? stats[0].totalSavings : 0;

    res.status(200).json({ totalSavings });

  } catch (error) {
    console.error('Error calculating scan stats:', error);
    res.status(500).json({ message: 'Failed to calculate statistics.' });
  }
};
