import { ChatSession } from '../entities/ChatSession';

export interface IChatSessionRepository {
  findById(id: string): Promise<ChatSession | null>;
  findByThreadId(threadId: string): Promise<ChatSession | null>;
  save(session: ChatSession): Promise<ChatSession>;
  update(session: ChatSession): Promise<ChatSession>;
  findByUserId(userId: string): Promise<ChatSession[]>;
}
