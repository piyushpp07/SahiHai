import { Request, Response } from 'express';
import { ChatService } from '../../../application/chat/ChatService';

// In-memory cache for compiled graphs to avoid recompiling every request
// In a real serverless env this wouldn't work well, but for a stateful server it's fine.
// Ideally LangGraph checkpointers handle state, so we just re-init graph.
const chatService = new ChatService();

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const { text } = req.body;
        const userId = (req.session as any).userId || 'guest';

        const message = await chatService.processMessage(chatId, text, userId);
        res.json(message);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const history = await chatService.getHistory(chatId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};
