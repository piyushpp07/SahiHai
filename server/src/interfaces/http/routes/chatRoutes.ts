import { Router } from 'express';
import { sendMessage, getHistory } from '../controllers/chatController';

const router = Router();

router.post('/:chatId', sendMessage);
router.get('/:chatId/history', getHistory);

export default router;
