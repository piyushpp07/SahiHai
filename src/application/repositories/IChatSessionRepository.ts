import { ChatSession } from '../../domain/ChatSession';

export interface IChatSessionRepository {
  create(chatSession: ChatSession): Promise<ChatSession>;
  findByThreadId(threadId: string): Promise<ChatSession | null>;
  update(chatSession: ChatSession): Promise<ChatSession>;
}
