"use client";

import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Percent,
  Calendar,
  Banknote,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Decision, Terms } from "@/types";

interface DecisionTermsProps {
  decision: Decision;
  terms: Terms;
}

export function DecisionTerms({ decision, terms }: DecisionTermsProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h2 className="text-base font-medium text-gray-900">
        {decision === "approve"
          ? t("decisionTerms.approvedTerms")
          : decision === "decline"
            ? t("decisionTerms.declineReasons")
            : t("decisionTerms.infoRequested")}
      </h2>

      {decision === "approve" && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {terms.approved_amount && (
              <div className="rounded-lg bg-emerald-50/50 p-3">
                <div className="flex items-center gap-1.5 text-xs text-emerald-500">
                  <Banknote className="h-3.5 w-3.5 stroke-[1.5]" />
                  {t("decisionTerms.approvedAmount")}
                </div>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {terms.currency} {terms.approved_amount.toLocaleString()}
                </p>
              </div>
            )}
            {terms.suggested_interest_rate && (
              <div className="rounded-lg bg-blue-50/50 p-3">
                <div className="flex items-center gap-1.5 text-xs text-blue-500">
                  <Percent className="h-3.5 w-3.5 stroke-[1.5]" />
                  {t("decisionTerms.interestRate")}
                </div>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {terms.suggested_interest_rate}
                </p>
              </div>
            )}
            {terms.suggested_term && (
              <div className="rounded-lg bg-purple-50/50 p-3">
                <div className="flex items-center gap-1.5 text-xs text-purple-500">
                  <Calendar className="h-3.5 w-3.5 stroke-[1.5]" />
                  {t("decisionTerms.loanTerm")}
                </div>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {terms.suggested_term}
                </p>
              </div>
            )}
          </div>

          {terms.conditions.length > 0 && (
            <div>
              <h3 className="text-xs font-normal text-gray-500">{t("decisionTerms.conditions")}</h3>
              <ul className="mt-2 space-y-1.5">
                {terms.conditions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-500 font-light">
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400 stroke-[1.5]" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {decision === "decline" && terms.decline_reasons.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {terms.decline_reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-500 font-light">
                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400 stroke-[1.5]" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {decision === "request_more_info" && terms.additional_questions.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-3 font-light">
            {t("decisionTerms.moreInfoDesc")}
          </p>
          <ul className="space-y-2">
            {terms.additional_questions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-500 font-light">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400 stroke-[1.5]" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
