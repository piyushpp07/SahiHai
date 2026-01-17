import mongoose from 'mongoose';
import logger from '../../logging/logger';

let isConnected = false;

export const connectDatabase = async () => {
  if (isConnected) {
    return;
  }

  // Check if mongoose already has a connection (e.g. from previous serverless invocation)
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    logger.error('MONGODB_URI is not defined in environment variables');
    // Don't exit process in serverless, just throw
    throw new Error('MONGODB_URI is missing');
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

