"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Scores } from "@/types";

interface ScoreCardProps {
  scores: Scores;
  weightedScore: number;
}

function getScoreColor(score: number): string {
  if (score >= 7) return "bg-emerald-400";
  if (score >= 5) return "bg-amber-400";
  if (score >= 3) return "bg-orange-400";
  return "bg-red-400";
}

function getScoreTextColor(score: number): string {
  if (score >= 7) return "text-emerald-600";
  if (score >= 5) return "text-amber-600";
  if (score >= 3) return "text-orange-600";
  return "text-red-600";
}

export function ScoreCard({ scores, weightedScore }: ScoreCardProps) {
  const { t } = useLanguage();
  const scoreEntries = Object.entries(scores) as [keyof Scores, Scores[keyof Scores]][];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-gray-900">{t("scoreCard.title")}</h2>
        <div className="rounded-md bg-gray-50 px-2.5 py-1">
          <span className="text-xs text-gray-400">{t("scoreCard.weighted")} </span>
          <span className="text-sm font-medium text-gray-900">
            {weightedScore.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {scoreEntries.map(([key, dim]) => (
          <div key={key}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-light">
                {t(`scoreDimensions.${key}`)}
              </span>
              <span
                className={`text-xs font-medium ${getScoreTextColor(dim.score)}`}
              >
                {dim.score}/10
              </span>
            </div>

            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getScoreColor(dim.score)}`}
                style={{ width: `${dim.score * 10}%` }}
              />
            </div>

            <p className="mt-1 text-xs leading-relaxed text-gray-400 font-light">
              {dim.justification}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
