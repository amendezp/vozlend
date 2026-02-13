"use client";

import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Percent,
  Calendar,
  Banknote,
} from "lucide-react";
import type { Decision, Terms } from "@/types";

interface DecisionTermsProps {
  decision: Decision;
  terms: Terms;
}

export function DecisionTerms({ decision, terms }: DecisionTermsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">
        {decision === "approve"
          ? "Approved Terms"
          : decision === "decline"
            ? "Decline Reasons"
            : "Information Requested"}
      </h2>

      {/* Approval Terms */}
      {decision === "approve" && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {terms.approved_amount && (
              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <Banknote className="h-4 w-4" />
                  Approved Amount
                </div>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {terms.currency} {terms.approved_amount.toLocaleString()}
                </p>
              </div>
            )}
            {terms.suggested_interest_rate && (
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Percent className="h-4 w-4" />
                  Interest Rate
                </div>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {terms.suggested_interest_rate}
                </p>
              </div>
            )}
            {terms.suggested_term && (
              <div className="rounded-xl bg-purple-50 p-4">
                <div className="flex items-center gap-2 text-sm text-purple-600">
                  <Calendar className="h-4 w-4" />
                  Loan Term
                </div>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {terms.suggested_term}
                </p>
              </div>
            )}
          </div>

          {terms.conditions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Conditions</h3>
              <ul className="mt-2 space-y-1.5">
                {terms.conditions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Decline Reasons */}
      {decision === "decline" && terms.decline_reasons.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {terms.decline_reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Questions (Request More Info) */}
      {decision === "request_more_info" && terms.additional_questions.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-3">
            We need more information to make a decision. Please provide answers to:
          </p>
          <ul className="space-y-2">
            {terms.additional_questions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
