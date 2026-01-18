import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  PORT: z.string().default('5051'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1),
  SESSION_SECRET: z.string().default('sahihai-default-session-secret-key-2026'),
  JWT_SECRET: z.string().default('sahihai-default-jwt-secret-key-2026'),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  TAVILY_API_KEY: z.string().optional(),
  GOLD_API_KEY: z.string().optional(),
  APICLUB_KEY: z.string().optional(),
});

const parsed = configSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
