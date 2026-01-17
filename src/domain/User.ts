
export interface User {
  id: string;
  name: string;
  email: string;
  preferredLLMProvider?: 'Gemini-Flash' | 'OpenAI' | 'Anthropic';
}
