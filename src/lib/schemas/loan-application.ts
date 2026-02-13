import { z } from "zod";

export const applicantSchema = z.object({
  name: z.string().nullable(),
  current_occupation: z.string().nullable(),
  employer_or_school: z.string().nullable(),
  degree_program: z.string().nullable(),
  previous_employers: z.array(z.string()).default([]),
  previous_roles: z.array(z.string()).default([]),
  location: z.string().nullable(),
});

export const loanRequestSchema = z.object({
  amount_requested: z.number().nullable(),
  currency: z.string().default("USD"),
  purpose: z.string().nullable(),
  purpose_details: z.string().nullable(),
});

export const repaymentPlanSchema = z.object({
  strategy: z.string().nullable(),
  expected_income_source: z.string().nullable(),
  prospective_employers: z.array(z.string()).default([]),
  timeline: z.string().nullable(),
});

export const additionalContextSchema = z.object({
  credit_situation: z.string().nullable(),
  other_notes: z.string().nullable(),
});

export const transcriptionSchema = z.object({
  language_detected: z.string(),
  raw_text: z.string(),
  duration: z.number().optional(),
});

export const loanApplicationSchema = z.object({
  applicant: applicantSchema,
  loan_request: loanRequestSchema,
  repayment_plan: repaymentPlanSchema,
  additional_context: additionalContextSchema,
  transcription: transcriptionSchema,
});

export type LoanApplicationSchema = z.infer<typeof loanApplicationSchema>;
