import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDatabase } from './infrastructure/database/mongoose/connection';
import logger from './infrastructure/logging/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: true, // Allow any origin
    credentials: true // Allow cookies/session
}));
app.use(compression());
app.use(express.json());

// Session
import { configureSession } from './infrastructure/auth/session';
import chatRoutes from './interfaces/http/routes/chatRoutes';
import utilityRoutes from './interfaces/http/routes/utilityRoutes';
import authRoutes from './interfaces/http/routes/authRoutes';

configureSession(app);

// Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/utilities', utilityRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export { app, connectDatabase };
export default app;




