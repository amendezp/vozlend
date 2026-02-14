import { describe, it, expect } from "vitest";
import { loanApplicationSchema } from "@/lib/schemas/loan-application";
import { underwritingResultSchema } from "@/lib/schemas/underwriting-result";

// ============================================
// Loan Application Schema Tests
// ============================================

describe("loanApplicationSchema", () => {
  const validApplication = {
    applicant: {
      name: "Maria Garcia",
      current_occupation: "Software Engineer",
      employer_or_school: "Google",
      degree_program: null,
      previous_employers: ["Meta", "Startup Inc"],
      previous_roles: ["Junior Developer", "Intern"],
      location: "Mexico City",
    },
    loan_request: {
      amount_requested: 50000,
      currency: "MXN",
      purpose: "Business expansion",
      purpose_details: "Opening a second location for my bakery",
    },
    repayment_plan: {
      strategy: "Monthly installments from business revenue",
      expected_income_source: "Bakery profits",
      prospective_employers: [],
      timeline: "24 months",
    },
    additional_context: {
      credit_situation: "Good, no outstanding debts",
      other_notes: null,
    },
    transcription: {
      language_detected: "es",
      raw_text: "Hola, mi nombre es Maria Garcia...",
      duration: 45,
    },
  };

  it("accepts a valid loan application", () => {
    const result = loanApplicationSchema.safeParse(validApplication);
    expect(result.success).toBe(true);
  });

  it("accepts nullable fields", () => {
    const minimal = {
      applicant: {
        name: null,
        current_occupation: null,
        employer_or_school: null,
        degree_program: null,
        previous_employers: [],
        previous_roles: [],
        location: null,
      },
      loan_request: {
        amount_requested: null,
        currency: "USD",
        purpose: null,
        purpose_details: null,
      },
      repayment_plan: {
        strategy: null,
        expected_income_source: null,
        prospective_employers: [],
        timeline: null,
      },
      additional_context: {
        credit_situation: null,
        other_notes: null,
      },
      transcription: {
        language_detected: "en",
        raw_text: "test",
      },
    };
    const result = loanApplicationSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it("provides defaults for arrays and currency", () => {
    const withoutDefaults = {
      applicant: {
        name: "Test",
        current_occupation: null,
        employer_or_school: null,
        degree_program: null,
        location: null,
      },
      loan_request: {
        amount_requested: 1000,
        purpose: null,
        purpose_details: null,
      },
      repayment_plan: {
        strategy: null,
        expected_income_source: null,
        timeline: null,
      },
      additional_context: {
        credit_situation: null,
        other_notes: null,
      },
      transcription: {
        language_detected: "en",
        raw_text: "test",
      },
    };
    const result = loanApplicationSchema.safeParse(withoutDefaults);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.applicant.previous_employers).toEqual([]);
      expect(result.data.loan_request.currency).toBe("USD");
    }
  });

  it("rejects missing transcription", () => {
    const noTranscription = { ...validApplication };
    delete (noTranscription as Record<string, unknown>).transcription;
    const result = loanApplicationSchema.safeParse(noTranscription);
    expect(result.success).toBe(false);
  });

  it("rejects missing applicant", () => {
    const noApplicant = { ...validApplication };
    delete (noApplicant as Record<string, unknown>).applicant;
    const result = loanApplicationSchema.safeParse(noApplicant);
    expect(result.success).toBe(false);
  });
});

// ============================================
// Underwriting Result Schema Tests
// ============================================

describe("underwritingResultSchema", () => {
  const validDimension = {
    score: 7,
    justification: "Applicant described concrete monthly income from established business",
    weight: 0.25,
  };

  const validResult = {
    scores: {
      income_cashflow_evidence: validDimension,
      repayment_plan_specificity: { ...validDimension, score: 6 },
      loan_purpose_viability: { ...validDimension, score: 8 },
      debt_manageability: { ...validDimension, score: 5 },
      information_completeness: { ...validDimension, score: 3 },
      internal_consistency: { ...validDimension, score: 6 },
      financial_stability_indicators: { ...validDimension, score: 8 },
      risk_awareness: { ...validDimension, score: 7 },
    },
    weighted_score: 6.5,
    decision: "approve" as const,
    decision_summary: "Application approved with moderate terms",
    detailed_analysis: "The applicant demonstrates strong potential...",
    terms: {
      approved_amount: 50000,
      currency: "MXN",
      suggested_interest_rate: "12%",
      suggested_term: "24 months",
      conditions: ["Proof of income required"],
      decline_reasons: [],
      additional_questions: [],
      stress_test_decision: {
        forced_decision: "approve" as const,
        forced_reasoning: "Even under stress, the applicant qualifies",
        forced_terms: {
          approved_amount: 40000,
          currency: "MXN",
          suggested_interest_rate: "15%",
          suggested_term: "18 months",
        },
      },
    },
  };

  it("accepts a valid underwriting result", () => {
    const result = underwritingResultSchema.safeParse(validResult);
    expect(result.success).toBe(true);
  });

  it("validates decision enum values", () => {
    const approve = { ...validResult, decision: "approve" };
    const decline = { ...validResult, decision: "decline" };
    const moreInfo = { ...validResult, decision: "request_more_info" };
    const invalid = { ...validResult, decision: "maybe" };

    expect(underwritingResultSchema.safeParse(approve).success).toBe(true);
    expect(underwritingResultSchema.safeParse(decline).success).toBe(true);
    expect(underwritingResultSchema.safeParse(moreInfo).success).toBe(true);
    expect(underwritingResultSchema.safeParse(invalid).success).toBe(false);
  });

  it("enforces score range 1-10", () => {
    const tooLow = {
      ...validResult,
      scores: {
        ...validResult.scores,
        income_cashflow_evidence: { ...validDimension, score: 0 },
      },
    };
    const tooHigh = {
      ...validResult,
      scores: {
        ...validResult.scores,
        income_cashflow_evidence: { ...validDimension, score: 11 },
      },
    };

    expect(underwritingResultSchema.safeParse(tooLow).success).toBe(false);
    expect(underwritingResultSchema.safeParse(tooHigh).success).toBe(false);
  });

  it("requires all 8 score dimensions", () => {
    const missingDimension = {
      ...validResult,
      scores: {
        income_cashflow_evidence: validDimension,
        // Missing 7 other dimensions
      },
    };
    expect(underwritingResultSchema.safeParse(missingDimension).success).toBe(false);
  });

  it("validates stress test forced_decision enum", () => {
    const invalidStress = {
      ...validResult,
      terms: {
        ...validResult.terms,
        stress_test_decision: {
          forced_decision: "maybe",
          forced_reasoning: "test",
          forced_terms: null,
        },
      },
    };
    expect(underwritingResultSchema.safeParse(invalidStress).success).toBe(false);
  });
});
