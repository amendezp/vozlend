import type { LLMProvider } from "./provider";
import { OpenAIProvider } from "./openai";
import { OllamaProvider } from "./ollama";

export type { LLMProvider, LLMCompletionRequest } from "./provider";

let cachedProvider: LLMProvider | null = null;

export function createLLMProvider(): LLMProvider {
  if (cachedProvider) return cachedProvider;

  const providerName = process.env.LLM_PROVIDER || "openai";

  switch (providerName) {
    case "ollama":
      cachedProvider = new OllamaProvider();
      break;
    case "openai":
    default:
      cachedProvider = new OpenAIProvider();
      break;
  }

  console.log(`[EchoBank] Using LLM provider: ${cachedProvider.name}`);
  return cachedProvider;
}
