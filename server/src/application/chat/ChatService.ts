import { createAgent } from '../ai/agent';
import { ChatSessionModel } from '../../infrastructure/database/mongoose/models/ChatSessionModel';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { Message } from '../../domain/ChatSession';

export class ChatService {
    private agent = createAgent();

    async processMessage(chatId: string, text: string, userId: string = 'guest'): Promise<Message> {
        // 1. Fetch or Create Session
        let session = await ChatSessionModel.findOne({ threadId: chatId });
        
        if (!session) {
            session = await ChatSessionModel.create({
                threadId: chatId,
                userId: userId,
                history: [],
                provider: 'openai'
            });
        }

        // 2. Prepare History for Agent
        const history = session.history.map((msg: any) => 
            msg.sender === 'user' ? new HumanMessage(msg.text) : new AIMessage(msg.text)
        );

        // 3. Invoke Agent
        const inputs = {
            messages: [...history, new HumanMessage(text)],
            provider: session.provider || 'openai'
        };

        const response = await this.agent.invoke(inputs);
        const lastMessage = response.messages[response.messages.length - 1];
        const replyText = lastMessage.content.toString();

        // 4. Update Session History
        const userMsg = { text, sender: 'user' as const, timestamp: new Date() };
        const botMsg = { text: replyText, sender: 'bot' as const, timestamp: new Date() };

        await ChatSessionModel.findOneAndUpdate(
            { threadId: chatId },
            { $push: { history: { $each: [userMsg, botMsg] } } }
        );

        return {
            text: replyText,
            sender: 'bot',
            timestamp: new Date()
        };

    }

    async getHistory(chatId: string): Promise<Message[]> {
        const session = await ChatSessionModel.findOne({ threadId: chatId });
        return session ? session.history : [];
    }
}
