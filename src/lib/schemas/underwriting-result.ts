import { z } from "zod";

const scoreDimensionSchema = z.object({
  score: z.number().min(1).max(10),
  justification: z.string(),
  weight: z.number(),
});

export const scoresSchema = z.object({
  income_cashflow_evidence: scoreDimensionSchema,
  repayment_plan_specificity: scoreDimensionSchema,
  loan_purpose_viability: scoreDimensionSchema,
  debt_manageability: scoreDimensionSchema,
  information_completeness: scoreDimensionSchema,
  internal_consistency: scoreDimensionSchema,
  financial_stability_indicators: scoreDimensionSchema,
  risk_awareness: scoreDimensionSchema,
});

const stressTestDecisionSchema = z.object({
  forced_decision: z.enum(["approve", "decline"]),
  forced_reasoning: z.string(),
  forced_terms: z
    .object({
      approved_amount: z.number().nullable().optional(),
      currency: z.string().optional(),
      suggested_interest_rate: z.string().nullable().optional(),
      suggested_term: z.string().nullable().optional(),
    })
    .nullable(),
});

const termsSchema = z.object({
  approved_amount: z.number().nullable(),
  currency: z.string(),
  suggested_interest_rate: z.string().nullable(),
  suggested_term: z.string().nullable(),
  conditions: z.array(z.string()).default([]),
  decline_reasons: z.array(z.string()).default([]),
  additional_questions: z.array(z.string()).default([]),
  stress_test_decision: stressTestDecisionSchema,
});

export const underwritingResultSchema = z.object({
  scores: scoresSchema,
  weighted_score: z.number(),
  decision: z.enum(["approve", "decline", "request_more_info"]),
  decision_summary: z.string(),
  detailed_analysis: z.string(),
  terms: termsSchema,
});

export type UnderwritingResultSchema = z.infer<typeof underwritingResultSchema>;
