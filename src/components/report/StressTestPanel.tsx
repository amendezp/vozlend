"use client";

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { StressTestDecision } from "@/types";

interface StressTestPanelProps {
  stressTest: StressTestDecision;
  parentDecision: string;
}

export function StressTestPanel({
  stressTest,
  parentDecision,
}: StressTestPanelProps) {
  const { t } = useLanguage();
  const isForced = parentDecision === "request_more_info";
  const forcedApprove = stressTest.forced_decision === "approve";

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-400 stroke-[1.5]" />
        <h2 className="text-base font-medium text-gray-900">
          {isForced ? t("stressTest.forcedTitle") : t("stressTest.altTitle")}
        </h2>
      </div>

      <p className="mt-2 text-xs text-gray-400 font-light">
        {isForced
          ? t("stressTest.forcedDesc")
          : parentDecision === "approve"
            ? t("stressTest.approveAltDesc")
            : t("stressTest.declineAltDesc")}
      </p>

      <div className="mt-4 rounded-lg bg-white border border-gray-100 p-4">
        <div className="flex items-center gap-2">
          {forcedApprove ? (
            <CheckCircle className="h-4 w-4 text-emerald-400 stroke-[1.5]" />
          ) : (
            <XCircle className="h-4 w-4 text-red-400 stroke-[1.5]" />
          )}
          <span
            className={`font-medium text-sm ${forcedApprove ? "text-emerald-600" : "text-red-600"}`}
          >
            {forcedApprove ? t("stressTest.forcedApproval") : t("stressTest.forcedDecline")}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-gray-500 font-light">
          {stressTest.forced_reasoning}
        </p>

        {forcedApprove && stressTest.forced_terms && (
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {stressTest.forced_terms.approved_amount && (
              <div className="rounded-md bg-emerald-50/50 p-2 text-center">
                <p className="text-xs text-emerald-500">{t("stressTest.amount")}</p>
                <p className="font-medium text-sm text-gray-900">
                  {stressTest.forced_terms.currency}{" "}
                  {stressTest.forced_terms.approved_amount.toLocaleString()}
                </p>
              </div>
            )}
            {stressTest.forced_terms.suggested_interest_rate && (
              <div className="rounded-md bg-blue-50/50 p-2 text-center">
                <p className="text-xs text-blue-500">{t("stressTest.rate")}</p>
                <p className="font-medium text-sm text-gray-900">
                  {stressTest.forced_terms.suggested_interest_rate}
                </p>
              </div>
            )}
            {stressTest.forced_terms.suggested_term && (
              <div className="rounded-md bg-purple-50/50 p-2 text-center">
                <p className="text-xs text-purple-500">{t("stressTest.term")}</p>
                <p className="font-medium text-sm text-gray-900">
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
