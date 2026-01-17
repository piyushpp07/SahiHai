import mongoose, { Schema, Document } from 'mongoose';
import { ChatSession } from '../../../../domain/ChatSession';

export interface IChatSessionDocument extends Omit<ChatSession, 'id'>, Document {}

const ChatSessionSchema = new Schema<IChatSessionDocument>(
  {
    userId: { type: String, required: true, index: true },
    provider: { type: String, enum: ['openai', 'anthropic', 'gemini'], required: true },
    threadId: { type: String, required: true, unique: true },
    lastActiveAt: { type: Date, default: Date.now },
    title: { type: String }
  },
  { timestamps: true }
);

export const ChatSessionModel = mongoose.model<IChatSessionDocument>('ChatSession', ChatSessionSchema);
