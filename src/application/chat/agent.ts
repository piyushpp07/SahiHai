
import { StateGraph, END } from '@langchain/langgraph';
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import { aiService } from '../../infrastructure/external-services/aiService';
import { MongoDBSaver } from '@langchain/mongodb';
import { MongoClient } from 'mongodb';

export interface AgentState {
  messages: BaseMessage[];
  activeModel: 'Gemini-Flash' | 'OpenAI' | 'Anthropic';
}

const graph = new StateGraph<AgentState>({
  channels: {
    messages: {
      value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
      default: () => [],
    },
    activeModel: {
      value: (x, y) => y,
      default: () => 'Gemini-Flash',
    },
  },
});

const callModel = async (state: AgentState) => {
  const { messages, activeModel } = state;
  const response = await aiService.getCompletion(activeModel, messages.map(m => ({
    role: m._getType() === 'human' ? 'user' : 'assistant',
    content: m.content as string,
    timestamp: new Date()
  })));
  return { messages: [new AIMessage(response)] };
};

graph.addNode('llm', callModel);
graph.setEntryPoint('llm');
graph.addEdge('llm', END);

const mongoClient = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017/sahihai');

const checkpointer = new MongoDBSaver({
  client: mongoClient,
});

export const agent = graph.compile({ checkpointer });
