import { IChatSessionRepository } from '../../domain/repositories/IChatSessionRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { SessionMetadata } from '../../infrastructure/database/mongoose/schemas/SessionMetadataSchema';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

export class SendMessage {
  constructor(
    private chatRepo: IChatSessionRepository,
    private userRepo: IUserRepository,
  ) {}

  async execute(chatId: string, text: string, userId: string) {
    // 1. Get Provider from Lock (Blueprint constraint)
    const existingMetadata = await SessionMetadata.findOne({ threadId: chatId });
    const metadata = existingMetadata ? existingMetadata : { provider: 'gemini-1.5-flash' };

    // 2. Fetch session history
    let session = await this.chatRepo.findByThreadId(chatId);
    
    if (!session) {
      // Create lazy session
      session = await this.chatRepo.save({
        id: '', 
        userId,
        threadId: chatId,
        provider: 'openai', 
        history: [],
        metadata: {
          model: (metadata as any).provider || 'gemini-1.5-flash',
          context: {}
        },
        lastActiveAt: new Date()
      });
    }

    // 3. Prepare Graph Inputs
    const history = session.history.map(msg => 
      msg.sender === 'user' ? new HumanMessage(msg.text) : new AIMessage(msg.text)
    );

    // 4. Invoke Graph (Placeholder for graph.ts)
    // For now, returning dummy response until Phase 2 Graph is complete
    return {
      text: "Thinking...",
      sender: 'bot',
      timestamp: new Date()
    };
  }
}
