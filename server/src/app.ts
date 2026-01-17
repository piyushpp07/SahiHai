import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDatabase } from './infrastructure/database/mongoose/connection';
import logger from './infrastructure/logging/logger';
import redisClient from './infrastructure/redis/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Session
import { configureSession } from './infrastructure/auth/session';
import chatRoutes from './interfaces/http/routes/chatRoutes';

configureSession(app);

// Routes
app.use('/chat', chatRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export { app, connectDatabase };


