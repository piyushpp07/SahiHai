
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { getModel } from '../../../config/langchain';
import { IAiService } from '../../../application/services/IAiService';
import { ChatSession } from '../../../domain/ChatSession';

class AiService implements IAiService {
  async getCompletion(provider: 'Gemini-Flash' | 'OpenAI' | 'Anthropic', messageHistory: ChatSession['messageHistory']): Promise<string> {
    const model = getModel(provider);
    const messages = messageHistory.map(msg => {
      if (msg.role === 'user') {
        return new HumanMessage(msg.content);
      }
      return new AIMessage(msg.content);
    });
    const response = await model.invoke(messages);
    return response.content as string;
  }
}

export const aiService = new AiService();
