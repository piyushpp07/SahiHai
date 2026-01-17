import { Request, Response } from 'express';
import { createAgent } from '../../../application/ai/agent';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { ChatSessionModel } from '../../../infrastructure/database/mongoose/models/ChatSessionModel';

// In-memory cache for compiled graphs to avoid recompiling every request
// In a real serverless env this wouldn't work well, but for a stateful server it's fine.
// Ideally LangGraph checkpointers handle state, so we just re-init graph.
const agent = createAgent();

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { text, provider } = req.body;
    const userId = req.session.userId || 'guest'; // specific logic for auth needed later

    // 1. Fetch or Create Session
    let session = await ChatSessionModel.findOne({ threadId: chatId });
    if (!session) {
        // Create new session logic
        // For now, assuming client gen IDs or we gen them.
        // Let's assume chatId IS the threadId
    }

    // 2. Prepare Input
    const inputs = {
        messages: [new HumanMessage(text)],
        provider: provider || 'openai'
    };

    // 3. Invoke Agent
    // We need to pass a config with thread_id for checkpointers if we had one.
    // For now, using in-memory graph pure invocation (stateless for this step unless checkpointer added)
    const response = await agent.invoke(inputs);

    // 4. Parse Response
    const lastMessage = response.messages[response.messages.length - 1];
    const replyText = lastMessage.content;

    res.json({
        id: Date.now().toString(),
        text: replyText,
        sender: 'bot',
        timestamp: new Date()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
