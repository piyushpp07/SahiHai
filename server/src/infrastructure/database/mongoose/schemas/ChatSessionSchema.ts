import mongoose, { Schema } from 'mongoose';
import { ChatSession, ChatMessage } from '../../../../domain/entities/ChatSession';

const ChatMessageSchema = new Schema<ChatMessage>({
  id: { type: String, required: false },
  text: { type: String, required: true },
  sender: { type: String, enum: ['user', 'bot'], required: true },
  timestamp: { type: Date, default: Date.now },
  image: { type: String, required: false },
});

export const ChatSessionSchema = new Schema<ChatSession>({
  userId: { type: String, required: true, index: true },
  threadId: { type: String, required: true, unique: true, index: true },
  provider: { type: String, enum: ['openai', 'gemini'], required: true },
  history: [ChatMessageSchema],
  metadata: {
    model: { type: String, required: true, default: 'gemini-1.5-pro' },
    context: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  lastActiveAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const ChatSessionModel = mongoose.models.ChatSession || mongoose.model<ChatSession>('ChatSession', ChatSessionSchema);
