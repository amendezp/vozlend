"use client";

interface AnalysisNarrativeProps {
  analysis: string;
}

export function AnalysisNarrative({ analysis }: AnalysisNarrativeProps) {
  const paragraphs = analysis
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">Detailed Analysis</h2>

      <div className="mt-4 space-y-4">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-gray-700">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
