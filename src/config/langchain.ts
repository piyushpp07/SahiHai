
import { ChatOpenAI } from '@langchain/openai';
import { ChatGroq } from '@langchain/groq';
import { ChatAnthropic } from '@langchain/anthropic';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

const supportedModels = {
  'Gemini-Flash': () => new ChatGroq({ modelName: 'gemma-7b-it' }),
  'OpenAI': () => new ChatOpenAI({ modelName: 'gpt-4' }),
  'Anthropic': () => new ChatAnthropic({ modelName: 'claude-3-opus-20240229' }),
};

export const getModel = (provider: keyof typeof supportedModels): BaseChatModel => {
  const model = supportedModels[provider];
  if (!model) {
    throw new Error(`Unsupported model provider: ${provider}`);
  }
  return model();
};
