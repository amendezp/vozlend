"use client";

import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Decision } from "@/types";

interface ReportHeaderProps {
  decision: Decision;
  decisionSummary: string;
  weightedScore: number;
  applicantName: string | null;
  amount: number | null;
  currency: string;
}

export function ReportHeader({
  decision,
  decisionSummary,
  weightedScore,
  applicantName,
  amount,
  currency,
}: ReportHeaderProps) {
  const { t } = useLanguage();

  const decisionConfig = {
    approve: {
      icon: CheckCircle,
      label: t("reportHeader.approved"),
      bgClass: "bg-emerald-50/50 border-emerald-100",
      textClass: "text-emerald-600",
      iconClass: "text-emerald-400",
      badgeClass: "bg-emerald-100 text-emerald-700",
    },
    decline: {
      icon: XCircle,
      label: t("reportHeader.declined"),
      bgClass: "bg-red-50/50 border-red-100",
      textClass: "text-red-600",
      iconClass: "text-red-400",
      badgeClass: "bg-red-100 text-red-700",
    },
    request_more_info: {
      icon: HelpCircle,
      label: t("reportHeader.moreInfo"),
      bgClass: "bg-amber-50/50 border-amber-100",
      textClass: "text-amber-600",
      iconClass: "text-amber-400",
      badgeClass: "bg-amber-100 text-amber-700",
    },
  };

  const config = decisionConfig[decision];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.bgClass} p-6 md:p-8`}>
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
        <div className="shrink-0">
          <Icon className={`h-12 w-12 ${config.iconClass} stroke-[1.5]`} />
        </div>

        <div className="flex-1 text-center md:text-left">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-normal tracking-wide ${config.badgeClass}`}
          >
            {config.label}
          </span>

          <h1 className="mt-3 text-2xl font-light text-gray-900 md:text-3xl tracking-tight">
            {applicantName || t("reportHeader.applicant")} &mdash;{" "}
            {amount
              ? `${currency} ${amount.toLocaleString()}`
              : t("reportHeader.amountNotSpecified")}
          </h1>

          <p className={`mt-2 text-sm font-light ${config.textClass}`}>
            {decisionSummary}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 text-xs">
            <span className="text-gray-400">{t("reportHeader.weightedScore")}:</span>
            <span className="text-base font-medium text-gray-900">
              {weightedScore.toFixed(1)}/10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
