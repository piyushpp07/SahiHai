import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { validate } from '../middleware/validationMiddleware';
import { sendMessageSchema } from '../schemas/chatSchemas';

// Assume auth middleware
const authMiddleware = (req, res, next) => {
  // Mock user for now
  (req as any).user = { id: '123', name: 'Test User', email: 'test@test.com', preferredLLMProvider: 'Gemini-Flash' };
  next();
};

export const createChatRoutes = (chatController: ChatController): Router => {
  const router = Router();
  router.post('/', authMiddleware, (req, res) => chatController.createChat(req, res));
  router.post('/:threadId/messages', authMiddleware, validate(sendMessageSchema), (req, res) => chatController.sendMessageToChat(req, res));
  return router;
};