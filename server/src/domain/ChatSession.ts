export type LLMProvider = 'openai' | 'anthropic' | 'gemini';

export interface ChatSession {
  id: string;
  userId: string;
  provider: LLMProvider;
  threadId: string; // LangGraph thread ID
  createdAt: Date;
  lastActiveAt: Date;
  title?: string;
}
