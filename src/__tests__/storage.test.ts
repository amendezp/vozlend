import { describe, it, expect, beforeEach, vi } from "vitest";
import { storeReport, getReport } from "@/lib/storage";
import type { FullReport } from "@/types";

// Mock sessionStorage
const mockStorage: Record<string, string> = {};

beforeEach(() => {
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);

  vi.stubGlobal("sessionStorage", {
    getItem: vi.fn((key: string) => mockStorage[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      mockStorage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete mockStorage[key];
    }),
  });
});

const mockReport: FullReport = {
  id: "test-report-123",
  createdAt: "2026-02-14T12:00:00.000Z",
  application: {
    applicant: {
      name: "Test User",
      current_occupation: "Engineer",
      employer_or_school: null,
      degree_program: null,
      previous_employers: [],
      previous_roles: [],
      location: "NYC",
    },
    loan_request: {
      amount_requested: 10000,
      currency: "USD",
      purpose: "Business",
      purpose_details: null,
    },
    repayment_plan: {
      strategy: "Monthly",
      expected_income_source: "Salary",
      prospective_employers: [],
      timeline: "12 months",
    },
    additional_context: {
      credit_situation: null,
      other_notes: null,
    },
    transcription: {
      language_detected: "en",
      raw_text: "Hello, my name is Test User...",
      duration: 30,
    },
  },
  underwriting: {
    scores: {
      education_institutional_quality: { score: 7, justification: "Good", weight: 0.15 },
      professional_network_social_capital: { score: 6, justification: "Average", weight: 0.10 },
      character_communication_quality: { score: 8, justification: "Strong", weight: 0.15 },
      income_stability_earning_potential: { score: 7, justification: "Stable", weight: 0.20 },
      collateral_asset_base: { score: 4, justification: "Limited", weight: 0.10 },
      debt_to_income_ratio: { score: 6, justification: "Manageable", weight: 0.10 },
      purpose_alignment: { score: 8, justification: "Clear", weight: 0.10 },
      repayment_plan_credibility: { score: 7, justification: "Credible", weight: 0.10 },
    },
    weighted_score: 6.75,
    decision: "approve",
    decision_summary: "Approved with standard terms",
    detailed_analysis: "The applicant shows strong potential...",
    terms: {
      approved_amount: 10000,
      currency: "USD",
      suggested_interest_rate: "10%",
      suggested_term: "12 months",
      conditions: [],
      decline_reasons: [],
      additional_questions: [],
      stress_test_decision: {
        forced_decision: "approve",
        forced_reasoning: "Would still approve under stress",
        forced_terms: null,
      },
    },
  },
};

describe("storage", () => {
  describe("storeReport", () => {
    it("stores a report in sessionStorage", () => {
      storeReport(mockReport);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "echobank_report_test-report-123",
        JSON.stringify(mockReport)
      );
    });
  });

  describe("getReport", () => {
    it("retrieves a stored report", () => {
      mockStorage["echobank_report_test-report-123"] = JSON.stringify(mockReport);
      const retrieved = getReport("test-report-123");
      expect(retrieved).toEqual(mockReport);
    });

    it("returns null for missing report", () => {
      const result = getReport("nonexistent-id");
      expect(result).toBeNull();
    });

    it("returns null for invalid JSON", () => {
      mockStorage["echobank_report_bad"] = "not-json{{{";
      const result = getReport("bad");
      expect(result).toBeNull();
    });
  });
});
