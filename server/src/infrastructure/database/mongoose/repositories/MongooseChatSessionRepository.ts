import mongoose from 'mongoose';
import { ChatSession } from '../../../../domain/entities/ChatSession';
import { IChatSessionRepository } from '../../../../domain/repositories/IChatSessionRepository';
import { ChatSessionSchema } from '../schemas/ChatSessionSchema';

const ChatSessionModel = mongoose.model<ChatSession>('ChatSession', ChatSessionSchema);

export class MongooseChatSessionRepository implements IChatSessionRepository {
  async findById(id: string): Promise<ChatSession | null> {
    return ChatSessionModel.findById(id).lean();
  }

  async findByThreadId(threadId: string): Promise<ChatSession | null> {
    return ChatSessionModel.findOne({ threadId }).lean();
  }

  async findByUserId(userId: string): Promise<ChatSession[]> {
    return ChatSessionModel.find({ userId }).sort({ lastActiveAt: -1 }).lean();
  }

  async save(session: ChatSession): Promise<ChatSession> {
    const newSession = new ChatSessionModel(session);
    const saved = await newSession.save();
    return saved.toObject();
  }

  async update(session: ChatSession): Promise<ChatSession> {
    const updated = await ChatSessionModel.findOneAndUpdate(
      { threadId: session.threadId },
      session,
      { new: true }
    ).lean();
    if (!updated) throw new Error('Session not found');
    return updated;
  }
}
