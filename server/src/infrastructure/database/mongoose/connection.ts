import mongoose from 'mongoose';
import { env } from '../../config/env';
import logger from '../../logging/logger';

export class MongoConnection {
  private static isConnected = false;

  public static async connect(): Promise<void> {
    if (this.isConnected) return;

    // Use mongoose.connection.readyState as a double check
    if (mongoose.connection.readyState === 1) {
      this.isConnected = true;
      return;
    }

    try {
      await mongoose.connect(env.MONGODB_URI);
      this.isConnected = true;
      logger.info('Connected to MongoDB');
    } catch (error) {
      logger.error('MongoDB connection error:', error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    await mongoose.disconnect();
    this.isConnected = false;
    logger.info('Disconnected from MongoDB');
  }
}
