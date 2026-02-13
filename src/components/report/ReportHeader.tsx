"use client";

import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import type { Decision } from "@/types";

interface ReportHeaderProps {
  decision: Decision;
  decisionSummary: string;
  weightedScore: number;
  applicantName: string | null;
  amount: number | null;
  currency: string;
}

const decisionConfig = {
  approve: {
    icon: CheckCircle,
    label: "Approved",
    bgClass: "bg-emerald-50 border-emerald-200",
    textClass: "text-emerald-700",
    iconClass: "text-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-800",
  },
  decline: {
    icon: XCircle,
    label: "Declined",
    bgClass: "bg-red-50 border-red-200",
    textClass: "text-red-700",
    iconClass: "text-red-500",
    badgeClass: "bg-red-100 text-red-800",
  },
  request_more_info: {
    icon: HelpCircle,
    label: "More Information Needed",
    bgClass: "bg-amber-50 border-amber-200",
    textClass: "text-amber-700",
    iconClass: "text-amber-500",
    badgeClass: "bg-amber-100 text-amber-800",
  },
};

export function ReportHeader({
  decision,
  decisionSummary,
  weightedScore,
  applicantName,
  amount,
  currency,
}: ReportHeaderProps) {
  const config = decisionConfig[decision];
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border ${config.bgClass} p-6 md:p-8`}>
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
        {/* Icon */}
        <div className="shrink-0">
          <Icon className={`h-16 w-16 ${config.iconClass}`} />
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          {/* Decision Badge */}
          <span
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold ${config.badgeClass}`}
          >
            {config.label}
          </span>

          {/* Applicant + Amount */}
          <h1 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
            {applicantName || "Applicant"} &mdash;{" "}
            {amount
              ? `${currency} ${amount.toLocaleString()}`
              : "Amount Not Specified"}
          </h1>

          {/* Summary */}
          <p className={`mt-2 text-base ${config.textClass}`}>
            {decisionSummary}
          </p>

          {/* Weighted Score */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 text-sm">
            <span className="font-medium text-gray-600">Weighted Score:</span>
            <span className="text-lg font-bold text-gray-900">
              {weightedScore.toFixed(1)}/10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
