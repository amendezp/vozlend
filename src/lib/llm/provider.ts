// ============================================
// LLM Provider Abstraction
// ============================================

export interface LLMCompletionRequest {
  systemPrompt: string;
  userMessage: string;
  responseFormat?: "json" | "text";
  temperature?: number;
  maxTokens?: number;
}

export interface LLMProvider {
  complete(request: LLMCompletionRequest): Promise<string>;
  readonly name: string;
}
