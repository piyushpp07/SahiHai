
import {
  BaseListChatMessageHistory,
} from "@langchain/core/chat_history";
import {
  BaseMessage,
  mapStoredMessagesToChatMessages,
  mapChatMessagesToStoredMessages,
} from "@langchain/core/messages";
import { model, Document } from "mongoose";
import { chatHistorySchema, IChatHistory } from "./schemas/chatHistorySchema";

/**
 * This class is used to store chat history in a MongoDB database.
 * It extends the BaseListChatMessageHistory class from the LangChain library.
 * This allows us to use it as a drop-in replacement for the in-memory chat history.
 * This is crucial for persisting chat history across server restarts and in a clustered environment.
 */
class MongoDBChatHistory extends BaseListChatMessageHistory {
  lc_namespace = ["langchain", "stores", "message", "mongodb"];

  private collection = model<IChatHistory>('ChatHistory', chatHistorySchema);

  constructor(
    private sessionId: string
  ) {
    super();
  }

  async getMessages(): Promise<BaseMessage[]> {
    const document = await this.collection.findOne({ sessionId: this.sessionId });
    return mapStoredMessagesToChatMessages(document?.messages || []);
  }

  async addMessage(message: BaseMessage): Promise<void> {
    const messages = mapChatMessagesToStoredMessages([message]);
    await this.collection.updateOne(
      { sessionId: this.sessionId },
      { $push: { messages: { $each: messages } } },
      { upsert: true }
    );
  }

  async clear(): Promise<void> {
    await this.collection.deleteOne({ sessionId: this.sessionId });
  }
}

export { MongoDBChatHistory };
