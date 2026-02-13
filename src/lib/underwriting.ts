import { createLLMProvider } from "./llm";
import { UNDERWRITING_SYSTEM_PROMPT } from "./prompts/underwriting";
import { underwritingResultSchema } from "./schemas/underwriting-result";
import type { LoanApplication, UnderwritingResult } from "@/types";

const MAX_RETRIES = 2;

export async function analyzeApplication(
  application: LoanApplication
): Promise<UnderwritingResult> {
  const provider = createLLMProvider();

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const userMessage =
        attempt === 0
          ? JSON.stringify(application, null, 2)
          : `${JSON.stringify(application, null, 2)}\n\n[IMPORTANT: Your previous response was not valid JSON. Please return ONLY a valid JSON object matching the schema, with no markdown formatting or additional text.]`;

      const response = await provider.complete({
        systemPrompt: UNDERWRITING_SYSTEM_PROMPT,
        userMessage,
        responseFormat: "json",
        temperature: 0.3,
        maxTokens: 6000,
      });

      // Clean response — remove markdown fences if present
      const cleaned = response
        .replace(/^```(?:json)?\s*/m, "")
        .replace(/\s*```\s*$/m, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      const validated = underwritingResultSchema.parse(parsed);
      return validated as UnderwritingResult;
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `[EchoBank] Underwriting attempt ${attempt + 1} failed:`,
        (error as Error).message
      );
    }
  }

  throw new Error(
    `Failed to analyze application after ${MAX_RETRIES + 1} attempts: ${lastError?.message}`
  );
}
