import { createAgent } from '../ai/agent';
import { ChatSessionModel } from '../../infrastructure/database/mongoose/schemas/ChatSessionSchema';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { ChatMessage as Message } from '../../domain/entities/ChatSession';

export class ChatService {
    private agent = createAgent();

    async processMessage(chatId: string, text: string, userId: string = 'guest', image?: string): Promise<Message> {
        // 1. Fetch or Create Session
        let session = await ChatSessionModel.findOne({ threadId: chatId });
        
        if (!session) {
            session = await ChatSessionModel.create({
                threadId: chatId,
                userId: userId,
                history: [],
                provider: 'gemini',
                metadata: {
                    model: 'gemini-1.5-pro',
                    context: {}
                }
            });
        }

        // 2. Prepare History for Agent
        const history = session.history.map((msg: any) => {
            const m = msg.sender === 'user' ? new HumanMessage(msg.text) : new AIMessage(msg.text);
            if (msg.image) (m as any).image = msg.image;
            return m;
        });

        // 3. Invoke Agent
        const newUserMsg = new HumanMessage(text);
        if (image) (newUserMsg as any).image = image;

        const inputs = {
            messages: [...history, newUserMsg],
            provider: session.provider || 'gemini'
        };

        const response = await this.agent.invoke(inputs);
        const lastMessage = response.messages[response.messages.length - 1];
        const replyText = lastMessage.content.toString();

        // 4. Update Session History
        const userMsg = { id: Date.now().toString(), text, sender: 'user' as const, timestamp: new Date(), image };
        const botMsg = { id: (Date.now() + 1).toString(), text: replyText, sender: 'bot' as const, timestamp: new Date() };

        await ChatSessionModel.findOneAndUpdate(
            { threadId: chatId },
            { $push: { history: { $each: [userMsg, botMsg] } } }
        );

        return botMsg;

    }

    async getHistory(chatId: string): Promise<Message[]> {
        const session = await ChatSessionModel.findOne({ threadId: chatId });
        return session ? session.history : [];
    }
}
