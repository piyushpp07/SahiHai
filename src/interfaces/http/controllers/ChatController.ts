
import { Request, Response } from 'express';
import { InitiateChat } from '../../../application/chat/InitiateChat';
import { SendMessage } from '../../../application/chat/SendMessage';
import { User } from '../../../domain/User';

export class ChatController {
  constructor(
    private readonly initiateChat: InitiateChat,
    private readonly sendMessage: SendMessage
  ) {}

  async createChat(req: Request, res: Response) {
    try {
      const user = req.user as User; // Assuming user is available on the request
      const chatSession = await this.initiateChat.execute(user);

      // Store in session
      if (!(req.session as any).threads) {
        (req.session as any).threads = {};
      }
      (req.session as any).threads[chatSession.threadId] = {
        activeModel: chatSession.activeModel,
      };

      res.status(201).json(chatSession);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async sendMessageToChat(req: Request, res: Response) {
    try {
      const { threadId } = req.params;
      const { message } = req.body;

      const activeModel = (req.session as any).threads?.[threadId]?.activeModel;
      if (!activeModel) {
        throw new Error('Could not determine active model for this thread.');
      }

      const chatSession = await this.sendMessage.execute(threadId, message, activeModel);
      res.status(200).json(chatSession);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
