
import { ChatSession } from '../../../domain/ChatSession';
import { IChatSessionRepository } from '../repositories/IChatSessionRepository';
import { agent } from './agent';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';

export class SendMessage {
  constructor(private readonly chatSessionRepository: IChatSessionRepository) {}

  async execute(
    threadId: string,
    message: string,
    activeModel: 'Gemini-Flash' | 'OpenAI' | 'Anthropic',
  ): Promise<ChatSession> {
    const chatSession = await this.chatSessionRepository.findByThreadId(threadId);
    if (!chatSession) {
      throw new Error('Chat session not found');
    }

    // Hydrate agent state with message history
    const history: BaseMessage[] = chatSession.messageHistory.map(msg => {
      if (msg.role === 'user') {
        return new HumanMessage(msg.content);
      }
      return new AIMessage(msg.content);
    });

    const humanMessage = new HumanMessage(message);
    history.push(humanMessage);

    const response = await agent.invoke(
      { messages: history, activeModel },
      { configurable: { thread_id: threadId } },
    );

    const aiMessage = response.messages.slice(-1)[0];
    
    chatSession.messageHistory.push({ role: 'user', content: message, timestamp: new Date() });
    chatSession.messageHistory.push({ role: 'assistant', content: aiMessage.content as string, timestamp: new Date() });

    return this.chatSessionRepository.update(chatSession);
  }
}
