"use client";

import { useLanguage } from "@/context/LanguageContext";

interface AnalysisNarrativeProps {
  analysis: string;
}

export function AnalysisNarrative({ analysis }: AnalysisNarrativeProps) {
  const { t } = useLanguage();
  const paragraphs = analysis
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h2 className="text-base font-medium text-gray-900">{t("analysis.title")}</h2>

      <div className="mt-4 space-y-4">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-gray-500 font-light">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
