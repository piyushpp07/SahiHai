import { Request, Response } from 'express';
import TijoriItem from '../models/TijoriItem';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * Retrieves all tijori items for a user, sorted into active and expired.
 */
export const getTijoriItems = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (mongoose.connection.readyState !== 1) {
    console.warn("MongoDB not connected. Returning empty arrays.");
    return res.status(200).json({ active: [], expired: [] });
  }

  try {
    const now = new Date();
    const items = await TijoriItem.find({ user: req.user.id }).sort({ expiryDate: 'asc' });

    const active = items.filter(item => item.expiryDate >= now);
    const expired = items.filter(item => item.expiryDate < now);

    res.status(200).json({ active, expired });
  } catch (error) {
    console.error('Error fetching tijori items:', error);
    res.status(500).json({ message: 'Failed to fetch tijori items.' });
  }
};

/**
 * Adds a new item to the user's tijori.
 */
export const addTijoriItem = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { productName, purchaseDate, expiryDate, document } = req.body;

  if (!productName || !purchaseDate || !expiryDate) {
    return res.status(400).json({ message: 'Missing required fields: productName, purchaseDate, expiryDate.' });
  }
  
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database not connected. Cannot save item." });
  }

  try {
    const newItem = new TijoriItem({
      productName,
      purchaseDate,
      expiryDate,
      document,
      user: req.user.id,
    });

    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding tijori item:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: "Validation Error", details: error.errors });
    }
    res.status(500).json({ message: 'Failed to add item to tijori.' });
  }
};
