import { env } from "../../config/env";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { LLMProvider } from "../../domain/ChatSession";
import { DynamicTool } from "@langchain/core/tools";
import { UtilityService } from "../utilities/UtilityService";

const utilityService = new UtilityService();

// Define Tools
const tools = [
  new DynamicTool({
    name: "get_gold_rates",
    description: "Get real-time gold (24k, 22k) and silver rates in INR for 10g.",
    func: async () => {
      const rates = await utilityService.getGoldRates();
      return JSON.stringify(rates);
    }
  }),
  new DynamicTool({
    name: "check_pnr_status",
    description: "Check the status of a railway PNR number. Input: { pnr }.",
    func: async (pnr: string) => {
      const status = await utilityService.getPNRStatus(pnr);
      return JSON.stringify(status);
    }
  }),
  new DynamicTool({
    name: "verify_challans",
    description: "Verify if there are any pending traffic challans for a vehicle. Input: { vehicleNumber }.",
    func: async (vehicleNumber: string) => {
      const challans = await utilityService.getChallan(vehicleNumber);
      return JSON.stringify(challans);
    }
  })
];

// Define the state using Annotation
const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  provider: Annotation<LLMProvider>({
    reducer: (x, y) => y ?? x,
    default: () => 'gemini',
  }),
});

// Factory to get the model based on provider
const getModel = (provider: LLMProvider) => {
  let model;
  switch (provider) {
    case 'openai':
      model = new ChatOpenAI({ modelName: "gpt-4o" });
      break;
    case 'anthropic':
    case 'gemini':
       model = new ChatGoogleGenerativeAI({ model: "gemini-1.5-pro", apiKey: env.GEMINI_KEY });
       break;
    default:
      model = new ChatGoogleGenerativeAI({ model: "gemini-1.5-flash", apiKey: env.GEMINI_KEY });
  }
  return model.bindTools(tools);
};

import { ToolNode } from "@langchain/langgraph/dist/prebuilt/index.js";

// Node: Call Model
const callModel = async (state: typeof AgentState.State) => {
  const { messages, provider } = state;
  const model = getModel(provider);

  // Convert messages to include images if present (for Gemini/multi-modal)
  const formattedMessages = messages.map(msg => {
    if ((msg as any).image) {
        return {
            role: (msg as any).sender === 'user' ? 'user' : 'assistant',
            content: [
                { type: 'text', text: msg.content },
                {
                    type: 'image_url',
                    image_url: { url: (msg as any).image.startsWith('data:') ? (msg as any).image : `data:image/jpeg;base64,${(msg as any).image}` }
                }
            ]
        };
    }
    return msg;
  });

  const response = await model.invoke(formattedMessages as any);
  return { messages: [response] };
};

// Tool Node
const toolNode = new ToolNode(tools);

// Conditional edge to decide whether to continue or end
const shouldContinue = (state: typeof AgentState.State) => {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1];
    
    // If the LLM is calling tools, route to the "tools" node
    if ((lastMessage as any).tool_calls?.length > 0) {
        return "tools";
    }
    // Otherwise, stop (reply to the user)
    return END;
};

// Build the graph
export const createAgent = () => {
    const workflow = new StateGraph(AgentState)
        .addNode("agent", callModel as any)
        .addNode("tools", toolNode as any)
        .addEdge("__start__", "agent")
        .addConditionalEdges("agent", shouldContinue as any)
        .addEdge("tools", "agent");

    return workflow.compile();
}
