import mongoose from 'mongoose';
import logger from './winston-config';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sahihai';
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error:', { error });
    process.exit(1);
  }
};

export default connectDB;