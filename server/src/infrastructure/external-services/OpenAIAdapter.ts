import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicTool } from "@langchain/core/tools";
import { StateGraph, END } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { agentStateConfig, AgentState } from "../../use-cases/chat/AgentState";
import { env } from "../../config/env";

/**
 * tool_check_challan implementation
 */
const checkChallanTool = new DynamicTool({
  name: "tool_check_challan",
  description: "Checks for pending traffic fines for a vehicle. Input: { vehicle_number }.",
  func: async (input: string) => {
    // Basic server-side logic priority (Blueprint requirement)
    // In a real app, call infrastructure/external-services/ParivahanAPI
    return `Searching records for ${input}... No pending fines found as of today.`;
  },
});

/**
 * LangGraph Node: LLM Call
 */
const callModel = async (state: AgentState) => {
  const { messages, provider } = state;
  let model;

  if (provider === 'gpt-4o' || provider === 'openai') {
    model = new ChatOpenAI({ modelName: "gpt-4o", apiKey: env.OPENAI_API_KEY });
  } else {
    model = new ChatGoogleGenerativeAI({ model: "gemini-1.5-flash", apiKey: env.GEMINI_KEY });
  }

  const response = await model.invoke(messages);
  return { messages: [response] };
};

/**
 * Workflow Construction
 */
const workflow = new StateGraph<AgentState>({
  channels: agentStateConfig as any,
})
  .addNode("agent", callModel as any)
  .addEdge("__start__", "agent")
  .addEdge("agent", END);

export const createAgent = () => workflow.compile();
