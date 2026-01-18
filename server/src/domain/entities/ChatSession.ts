import { BaseMessage } from "@langchain/core/messages";

export type LLMProvider = 'openai' | 'gemini';

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string; // Base64 or URL
}

export interface ChatSession {
  id: string;
  userId: string;
  threadId: string; // LangGraph thread ID
  provider: LLMProvider;
  history: ChatMessage[];
  metadata: {
    model: string;
    context: Record<string, any>;
  };
  lastActiveAt: Date;
}
