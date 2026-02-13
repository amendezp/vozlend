"use client";

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { StressTestDecision } from "@/types";

interface StressTestPanelProps {
  stressTest: StressTestDecision;
  parentDecision: string;
}

export function StressTestPanel({
  stressTest,
  parentDecision,
}: StressTestPanelProps) {
  const isForced = parentDecision === "request_more_info";
  const forcedApprove = stressTest.forced_decision === "approve";

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-bold text-gray-900">
          {isForced ? "Stress Test: Forced Decision" : "Stress Test: Alternative Scenario"}
        </h2>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        {isForced
          ? "If forced to make a binary decision without additional information:"
          : parentDecision === "approve"
            ? "If this application were forced to be declined:"
            : "If this application were forced to be approved:"}
      </p>

      <div className="mt-4 rounded-xl bg-white border border-gray-200 p-4">
        <div className="flex items-center gap-2">
          {forcedApprove ? (
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span
            className={`font-bold ${forcedApprove ? "text-emerald-700" : "text-red-700"}`}
          >
            Forced {forcedApprove ? "Approval" : "Decline"}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          {stressTest.forced_reasoning}
        </p>

        {forcedApprove && stressTest.forced_terms && (
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {stressTest.forced_terms.approved_amount && (
              <div className="rounded-lg bg-emerald-50 p-2 text-center">
                <p className="text-xs text-emerald-600">Amount</p>
                <p className="font-bold text-gray-900">
                  {stressTest.forced_terms.currency}{" "}
                  {stressTest.forced_terms.approved_amount.toLocaleString()}
                </p>
              </div>
            )}
            {stressTest.forced_terms.suggested_interest_rate && (
              <div className="rounded-lg bg-blue-50 p-2 text-center">
                <p className="text-xs text-blue-600">Rate</p>
                <p className="font-bold text-gray-900">
                  {stressTest.forced_terms.suggested_interest_rate}
                </p>
              </div>
            )}
            {stressTest.forced_terms.suggested_term && (
              <div className="rounded-lg bg-purple-50 p-2 text-center">
                <p className="text-xs text-purple-600">Term</p>
                <p className="font-bold text-gray-900">
                  {stressTest.forced_terms.suggested_term}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
