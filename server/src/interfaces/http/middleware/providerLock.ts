import { Request, Response, NextFunction } from 'express';
import { RedisConnection } from '../../../infrastructure/redis/RedisConnection';

/**
 * Implements "Logical Stickiness" by ensuring user metadata (like LLM provider)
 * is locked and consistent across sessions via Redis.
 */
export const providerLockMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !(req.session as any).userId) {
    return next();
  }

  const redis = RedisConnection.getInstance();
  const threadId = req.headers['x-thread-id'] || 'default';
  const lockKey = `session:${threadId}:metadata`;

  try {
    const existingMetadata = await redis.get(lockKey);
    
    if (!existingMetadata) {
      // Assign provider based on user tier (Blueprint requirement)
      // Note: Real user tier would be fetched from DB here if not in session
      const userTier = (req.session as any).userTier || 'free';
      const provider = userTier === 'premium' ? 'gpt-4o' : 'gemini-1.5-flash';
      
      const metadata = {
        provider,
        assignedAt: new Date().toISOString()
      };
      
      await redis.set(lockKey, JSON.stringify(metadata), 'EX', 3600); // 1 hour TTL
    }
    
    next();
  } catch (error) {
    console.error('Provider lock error:', error);
    next();
  }
};
