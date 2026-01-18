import { Request, Response, NextFunction } from 'express';
import { SessionMetadata } from '../../../infrastructure/database/mongoose/schemas/SessionMetadataSchema';

/**
 * Implements "Logical Stickiness" by ensuring user metadata (like LLM provider)
 * is locked and consistent across sessions via MongoDB.
 */
export const providerLockMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !(req.session as any).userId) {
    return next();
  }

  const threadId = req.headers['x-thread-id'] || 'default';

  try {
    let existingMetadata = await SessionMetadata.findOne({ threadId });
    
    if (!existingMetadata) {
      // Assign provider based on user tier (Blueprint requirement)
      const userTier = (req.session as any).userTier || 'free';
      const provider = userTier === 'premium' ? 'gpt-4o' : 'gemini-1.5-flash';
      
      existingMetadata = await SessionMetadata.create({
        threadId,
        provider,
        assignedAt: new Date(),
        expiresAt: new Date(Date.now() + 3600 * 1000) // 1 hour TTL
      });
    }
    
    // Attach to request for downstream use cases
    (req as any).provider = existingMetadata.provider;
    
    next();
  } catch (error) {
    console.error('Provider lock error:', error);
    next();
  }
};
