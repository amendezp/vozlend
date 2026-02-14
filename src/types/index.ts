// ============================================
// Echo Bank — Shared TypeScript Types
// ============================================

// --- Loan Application (extracted from voice memo) ---

export interface Applicant {
  name: string | null;
  current_occupation: string | null;
  employer_or_school: string | null;
  degree_program: string | null;
  previous_employers: string[];
  previous_roles: string[];
  location: string | null;
}

export interface LoanRequest {
  amount_requested: number | null;
  currency: string;
  purpose: string | null;
  purpose_details: string | null;
}

export interface RepaymentPlan {
  strategy: string | null;
  expected_income_source: string | null;
  prospective_employers: string[];
  timeline: string | null;
}

export interface AdditionalContext {
  credit_situation: string | null;
  other_notes: string | null;
}

export interface Transcription {
  language_detected: string;
  raw_text: string;
  duration?: number;
}

export interface LoanApplication {
  applicant: Applicant;
  loan_request: LoanRequest;
  repayment_plan: RepaymentPlan;
  additional_context: AdditionalContext;
  transcription: Transcription;
}

// --- Underwriting Result ---

export interface ScoreDimension {
  score: number;
  justification: string;
  weight: number;
}

export interface Scores {
  income_cashflow_evidence: ScoreDimension;
  repayment_plan_specificity: ScoreDimension;
  loan_purpose_viability: ScoreDimension;
  debt_manageability: ScoreDimension;
  information_completeness: ScoreDimension;
  internal_consistency: ScoreDimension;
  financial_stability_indicators: ScoreDimension;
  risk_awareness: ScoreDimension;
}

export type Decision = "approve" | "decline" | "request_more_info";

export interface StressTestDecision {
  forced_decision: "approve" | "decline";
  forced_reasoning: string;
  forced_terms: {
    approved_amount?: number | null;
    currency?: string;
    suggested_interest_rate?: string | null;
    suggested_term?: string | null;
  } | null;
}

export interface Terms {
  approved_amount: number | null;
  currency: string;
  suggested_interest_rate: string | null;
  suggested_term: string | null;
  conditions: string[];
  decline_reasons: string[];
  additional_questions: string[];
  stress_test_decision: StressTestDecision;
}

export interface UnderwritingResult {
  scores: Scores;
  weighted_score: number;
  decision: Decision;
  decision_summary: string;
  detailed_analysis: string;
  terms: Terms;
}

// --- Processing Pipeline ---

export type ProcessingStep =
  | "uploading"
  | "transcribing"
  | "extracting"
  | "underwriting"
  | "complete"
  | "error";

export interface ProcessingEvent {
  step: ProcessingStep;
  progress: number;
  message?: string;
}

export interface ProcessingCompleteEvent {
  reportId: string;
  report: {
    application: LoanApplication;
    underwriting: UnderwritingResult;
  };
}

// --- Report ---

export interface FullReport {
  id: string;
  createdAt: string;
  application: LoanApplication;
  underwriting: UnderwritingResult;
}

// --- Score dimension labels for display ---

export const SCORE_LABELS: Record<keyof Scores, string> = {
  income_cashflow_evidence: "Income & Cash Flow Evidence",
  repayment_plan_specificity: "Repayment Plan Specificity",
  loan_purpose_viability: "Loan Purpose Viability",
  debt_manageability: "Debt Manageability",
  information_completeness: "Information Completeness",
  internal_consistency: "Internal Consistency",
  financial_stability_indicators: "Financial Stability Indicators",
  risk_awareness: "Risk Awareness",
};
