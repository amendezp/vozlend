"use client";

import {
  User,
  Banknote,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Info,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { LoanApplication } from "@/types";

interface ExtractedDataPanelProps {
  application: LoanApplication;
}

function DataRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300 stroke-[1.5]" />
      <div>
        <p className="text-xs tracking-wide uppercase text-gray-400 font-light">
          {label}
        </p>
        <p className="text-sm text-gray-700 font-light">{value}</p>
      </div>
    </div>
  );
}

export function ExtractedDataPanel({ application }: ExtractedDataPanelProps) {
  const { t } = useLanguage();
  const { applicant, loan_request, repayment_plan, additional_context } = application;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h2 className="text-base font-medium text-gray-900">{t("extractedData.title")}</h2>
      <p className="text-xs text-gray-400 font-light">{t("extractedData.subtitle")}</p>

      <div className="mt-4 divide-y divide-gray-50">
        <div className="pb-3">
          <h3 className="text-xs tracking-wide uppercase text-gray-300 mb-2 font-normal">
            {t("extractedData.sectionApplicant")}
          </h3>
          <DataRow icon={User} label={t("extractedData.labelName")} value={applicant.name} />
          <DataRow icon={Briefcase} label={t("extractedData.labelOccupation")} value={applicant.current_occupation} />
          <DataRow icon={GraduationCap} label={t("extractedData.labelInstitution")} value={applicant.employer_or_school} />
          {applicant.degree_program && (
            <DataRow icon={GraduationCap} label={t("extractedData.labelProgram")} value={applicant.degree_program} />
          )}
          <DataRow icon={MapPin} label={t("extractedData.labelLocation")} value={applicant.location} />
          {applicant.previous_employers.length > 0 && (
            <DataRow icon={Briefcase} label={t("extractedData.labelPrevEmployers")} value={applicant.previous_employers.join(", ")} />
          )}
          {applicant.previous_roles.length > 0 && (
            <DataRow icon={Briefcase} label={t("extractedData.labelPrevRoles")} value={applicant.previous_roles.join(", ")} />
          )}
        </div>

        <div className="py-3">
          <h3 className="text-xs tracking-wide uppercase text-gray-300 mb-2 font-normal">
            {t("extractedData.sectionLoan")}
          </h3>
          <DataRow
            icon={Banknote}
            label={t("extractedData.labelAmount")}
            value={
              loan_request.amount_requested
                ? `${loan_request.currency} ${loan_request.amount_requested.toLocaleString()}`
                : null
            }
          />
          <DataRow icon={Banknote} label={t("extractedData.labelPurpose")} value={loan_request.purpose} />
          <DataRow icon={Info} label={t("extractedData.labelDetails")} value={loan_request.purpose_details} />
        </div>

        <div className="py-3">
          <h3 className="text-xs tracking-wide uppercase text-gray-300 mb-2 font-normal">
            {t("extractedData.sectionRepayment")}
          </h3>
          <DataRow icon={Calendar} label={t("extractedData.labelStrategy")} value={repayment_plan.strategy} />
          <DataRow icon={Briefcase} label={t("extractedData.labelIncomeSource")} value={repayment_plan.expected_income_source} />
          <DataRow icon={Calendar} label={t("extractedData.labelTimeline")} value={repayment_plan.timeline} />
          {repayment_plan.prospective_employers.length > 0 && (
            <DataRow icon={Briefcase} label={t("extractedData.labelProspectiveEmployers")} value={repayment_plan.prospective_employers.join(", ")} />
          )}
        </div>

        {(additional_context.credit_situation || additional_context.other_notes) && (
          <div className="pt-3">
            <h3 className="text-xs tracking-wide uppercase text-gray-300 mb-2 font-normal">
              {t("extractedData.sectionAdditional")}
            </h3>
            <DataRow icon={Info} label={t("extractedData.labelCreditSituation")} value={additional_context.credit_situation} />
            <DataRow icon={Info} label={t("extractedData.labelNotes")} value={additional_context.other_notes} />
          </div>
        )}
      </div>
    </div>
  );
}
