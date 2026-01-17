import { IChatSessionRepository } from '../../../../application/repositories/IChatSessionRepository';
import { ChatSession } from '../../../../domain/ChatSession';
import { ChatSessionModel } from '../mongoose/schemas/ChatSessionSchema';

export class ChatSessionRepository implements IChatSessionRepository {
  async create(chatSession: ChatSession): Promise<ChatSession> {
    const newChatSession = new ChatSessionModel(chatSession);
    await newChatSession.save();
    return newChatSession.toObject();
  }

  async findByThreadId(threadId: string): Promise<ChatSession | null> {
    return ChatSessionModel.findOne({ threadId }).lean().exec();
  }

  async update(chatSession: ChatSession): Promise<ChatSession> {
    const updatedChatSession = await ChatSessionModel.findOneAndUpdate(
      { _id: chatSession.id },
      chatSession,
      { new: true }
    ).lean().exec();

    if (!updatedChatSession) {
      throw new Error("Chat session not found for update");
    }

    return updatedChatSession;
  }
}
