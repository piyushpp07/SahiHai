// Need to augment the express-session module to include our custom session data
import 'express-session';
import { LLMProvider } from '../domain/ChatSession';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    threadId: string;
    preferredProvider: LLMProvider;
  }
}
