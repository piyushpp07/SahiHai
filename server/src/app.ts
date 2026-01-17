import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { MongoConnection } from './infrastructure/database/mongoose/connection';
import { sessionMiddleware } from './infrastructure/redis/RedisSessionStore';
import { providerLockMiddleware } from './interfaces/http/middleware/providerLock';
import logger from './infrastructure/logging/logger';
import { env } from './config/env';

// Routes
import authRoutes from './interfaces/http/routes/authRoutes';
import chatRoutes from './interfaces/http/routes/chatRoutes';
import utilityRoutes from './interfaces/http/routes/utilityRoutes';

const app = express();

/**
 * 1. Security & Optimization Middleware
 */
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(compression());
app.use(express.json());

/**
 * 2. Session Management (Redis Backed)
 */
app.use(sessionMiddleware);

/**
 * 3. Blueprint Protocols (Provider Lock)
 */
app.use(providerLockMiddleware);

/**
 * 4. Database Connection Middleware (Serverless/Clustered Safe)
 */
app.use(async (req, res, next) => {
  try {
    await MongoConnection.connect();
    next();
  } catch (error) {
    logger.error('Database connection failure:', error);
    res.status(500).json({ error: 'Infrastructure Error' });
  }
});

/**
 * 5. Route Composition
 */
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/utilities', utilityRoutes);

/**
 * 6. Health & Diagnostics
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

/**
 * 7. Global Error Handler
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled Exception:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

export { app };
export default app;
