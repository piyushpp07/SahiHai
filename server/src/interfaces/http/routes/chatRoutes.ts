import { Router } from 'express';
import { sendMessage } from '../controllers/chatController';

const router = Router();

router.post('/:chatId/message', sendMessage);

export default router;
