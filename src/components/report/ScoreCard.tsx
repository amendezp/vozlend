"use client";

import type { Scores } from "@/types";
import { SCORE_LABELS } from "@/types";

interface ScoreCardProps {
  scores: Scores;
  weightedScore: number;
}

function getScoreColor(score: number): string {
  if (score >= 7) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-500";
  if (score >= 3) return "bg-orange-500";
  return "bg-red-500";
}

function getScoreTextColor(score: number): string {
  if (score >= 7) return "text-emerald-700";
  if (score >= 5) return "text-amber-700";
  if (score >= 3) return "text-orange-700";
  return "text-red-700";
}

export function ScoreCard({ scores, weightedScore }: ScoreCardProps) {
  const scoreEntries = Object.entries(scores) as [keyof Scores, Scores[keyof Scores]][];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Scorecard</h2>
        <div className="rounded-lg bg-gray-100 px-3 py-1">
          <span className="text-sm font-medium text-gray-500">Weighted: </span>
          <span className="text-lg font-bold text-gray-900">
            {weightedScore.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {scoreEntries.map(([key, dim]) => (
          <div key={key}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {SCORE_LABELS[key]}
              </span>
              <span
                className={`text-sm font-bold ${getScoreTextColor(dim.score)}`}
              >
                {dim.score}/10
              </span>
            </div>

            {/* Score bar */}
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getScoreColor(dim.score)}`}
                style={{ width: `${dim.score * 10}%` }}
              />
            </div>

            {/* Justification */}
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {dim.justification}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
