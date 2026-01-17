import { BaseMessage } from "@langchain/core/messages";

export interface AgentContext {
  location?: string;
  vehicleNumber?: string;
  lastPayment?: number;
}

export interface AgentState {
  messages: BaseMessage[];
  userId: string;
  context: AgentContext;
  provider: string; // From the Redis lock
}

export const agentStateConfig = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
  userId: null,
  context: null,
  provider: null,
};
