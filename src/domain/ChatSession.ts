
import { User } from './User';

export interface ChatSession {
  id: string;
  user: User;
  threadId: string;
  activeModel: 'Gemini-Flash' | 'OpenAI' | 'Anthropic';
  messageHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>;
  createdAt: Date;
}
