import { ChatSession } from '../../domain/ChatSession';

export interface IAiService {
  getCompletion(provider: 'Gemini-Flash' | 'OpenAI' | 'Anthropic', messageHistory: ChatSession['messageHistory']): Promise<string>;
}
