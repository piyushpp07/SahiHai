import { IChatSessionRepository } from '../../domain/repositories/IChatSessionRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { RedisConnection } from '../../infrastructure/redis/RedisConnection';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
// Import Agent Logic here once graph is built

export class SendMessage {
  constructor(
    private chatRepo: IChatSessionRepository,
    private userRepo: IUserRepository,
  ) {}

  async execute(chatId: string, text: string, userId: string) {
    const redis = RedisConnection.getInstance();
    
    // 1. Get Provider from Lock (Blueprint constraint)
    const lockKey = `session:${chatId}:metadata`;
    const metadataStr = await redis.get(lockKey);
    const metadata = metadataStr ? JSON.parse(metadataStr) : { provider: 'gemini-1.5-flash' };

    // 2. Fetch session history
    let session = await this.chatRepo.findByThreadId(chatId);
    
    if (!session) {
      // Create lazy session
      // In a real app, we'd fetch user tier here
      session = await this.chatRepo.save({
        id: '', // Mongoose will gen
        userId,
        threadId: chatId,
        provider: 'openai', // Default, but metadata.provider overrides at graph level
        history: [],
        metadata: {
          model: metadata.provider,
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
    // const result = await graph.invoke({ 
    //   messages: [...history, new HumanMessage(text)],
    //   userId,
    //   provider: metadata.provider,
    //   context: session.metadata.context
    // });

    // For now, returning dummy response until Phase 2 Graph is complete
    return {
      text: "Thinking...",
      sender: 'bot',
      timestamp: new Date()
    };
  }
}
