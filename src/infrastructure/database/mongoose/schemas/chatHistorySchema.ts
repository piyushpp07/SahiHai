
import { Schema, Document } from "mongoose";
import { StoredMessage } from "@langchain/core/messages";

export interface IChatHistory extends Document {
  sessionId: string;
  messages: StoredMessage[];
}

export const chatHistorySchema: Schema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  messages: { type: Array, required: true },
});
