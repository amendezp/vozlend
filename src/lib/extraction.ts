import { createLLMProvider } from "./llm";
import { EXTRACTION_SYSTEM_PROMPT } from "./prompts/extraction";
import { loanApplicationSchema } from "./schemas/loan-application";
import type { LoanApplication } from "@/types";

const MAX_RETRIES = 2;

export async function extractLoanData(
  transcriptionText: string,
  language: string,
  duration: number
): Promise<LoanApplication> {
  const provider = createLLMProvider();

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const userMessage =
        attempt === 0
          ? transcriptionText
          : `${transcriptionText}\n\n[IMPORTANT: Your previous response was not valid JSON. Please return ONLY a valid JSON object matching the schema, with no markdown formatting or additional text.]`;

      const response = await provider.complete({
        systemPrompt: EXTRACTION_SYSTEM_PROMPT,
        userMessage,
        responseFormat: "json",
        temperature: 0.1,
      });

      // Clean response — remove markdown fences if present
      const cleaned = response
        .replace(/^```(?:json)?\s*/m, "")
        .replace(/\s*```\s*$/m, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      // Ensure transcription field has correct data
      parsed.transcription = {
        ...parsed.transcription,
        language_detected: language,
        raw_text: transcriptionText,
        duration,
      };

      const validated = loanApplicationSchema.parse(parsed);
      return validated as LoanApplication;
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `[VozLend] Extraction attempt ${attempt + 1} failed:`,
        (error as Error).message
      );
    }
  }

  throw new Error(
    `Failed to extract loan data after ${MAX_RETRIES + 1} attempts: ${lastError?.message}`
  );
}
