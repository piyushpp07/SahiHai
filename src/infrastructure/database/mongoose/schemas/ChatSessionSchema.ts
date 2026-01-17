import { Schema, model, Document } from 'mongoose';
import { ChatSession } from '../../../../domain/ChatSession';

const ChatSessionSchema = new Schema<ChatSession & Document>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  threadId: { type: String, required: true, unique: true },
  activeModel: { type: String, required: true },
  messageHistory: [{
    role: String,
    content: String,
    timestamp: Date,
  }],
  createdAt: { type: Date, default: Date.now },
});

export const ChatSessionModel = model<ChatSession & Document>('ChatSession', ChatSessionSchema);
