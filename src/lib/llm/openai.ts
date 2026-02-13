import OpenAI from "openai";
import type { LLMProvider, LLMCompletionRequest } from "./provider";

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;
  readonly name = "openai";

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = process.env.OPENAI_MODEL || "gpt-4o";
  }

  async complete(req: LLMCompletionRequest): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: req.systemPrompt },
        { role: "user", content: req.userMessage },
      ],
      temperature: req.temperature ?? 0.3,
      max_tokens: req.maxTokens ?? 4096,
      response_format:
        req.responseFormat === "json" ? { type: "json_object" } : undefined,
    });
    return response.choices[0].message.content ?? "";
  }
}
