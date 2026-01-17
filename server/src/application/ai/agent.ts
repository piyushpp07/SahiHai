import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // For Gemini
import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { LLMProvider } from "../../domain/ChatSession";

// Define the state using Annotation
const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  provider: Annotation<LLMProvider>({
    reducer: (x, y) => y ?? x,
    default: () => 'openai',
  }),
});

// Factory to get the model based on provider
const getModel = (provider: LLMProvider) => {
  switch (provider) {
    case 'openai':
      return new ChatOpenAI({ modelName: "gpt-4o" });
    case 'anthropic':
      return new ChatAnthropic({ modelName: "claude-3-opus-20240229" });
    case 'gemini':
       return new ChatOpenAI({ modelName: "gpt-3.5-turbo" }); // Fallback
    default:
      return new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
  }
};

// Node: Call Model
const callModel = async (state: typeof AgentState.State) => {
  const { messages, provider } = state;
  const model = getModel(provider);
  const response = await model.invoke(messages);
  return { messages: [response] };
};

// Build the graph
export const createAgent = () => {
    const workflow = new StateGraph(AgentState)
        .addNode("agent", callModel)
        .addEdge("agent", END)
        .addEdge("__start__", "agent"); // Explicitly connect start to agent

    return workflow.compile();
}

