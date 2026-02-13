import type { LLMProvider, LLMCompletionRequest } from "./provider";

export class OllamaProvider implements LLMProvider {
  private baseUrl: string;
  private model: string;
  readonly name = "ollama";

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.model = process.env.OLLAMA_MODEL || "llama3.1:8b";
  }

  async complete(req: LLMCompletionRequest): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: req.systemPrompt },
          { role: "user", content: req.userMessage },
        ],
        stream: false,
        format: req.responseFormat === "json" ? "json" : undefined,
        options: {
          temperature: req.temperature ?? 0.3,
          num_predict: req.maxTokens ?? 4096,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.message.content;
  }
}
