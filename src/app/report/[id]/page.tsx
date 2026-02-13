"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mic } from "lucide-react";
import { getReport } from "@/lib/storage";
import { ReportHeader } from "@/components/report/ReportHeader";
import { ScoreCard } from "@/components/report/ScoreCard";
import { ExtractedDataPanel } from "@/components/report/ExtractedDataPanel";
import { AnalysisNarrative } from "@/components/report/AnalysisNarrative";
import { DecisionTerms } from "@/components/report/DecisionTerms";
import { StressTestPanel } from "@/components/report/StressTestPanel";
import { TranscriptionPanel } from "@/components/report/TranscriptionPanel";
import { Button } from "@/components/ui/button";
import type { FullReport } from "@/types";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<FullReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const stored = getReport(id);
    setReport(stored);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-2xl font-bold text-gray-900">Report Not Found</h1>
        <p className="text-gray-500">
          This report may have expired or the link is invalid.
        </p>
        <Button onClick={() => router.push("/")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  const { application, underwriting } = report;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Mic className="h-4 w-4 text-emerald-600" />
            VozLend
          </div>

          <Button
            onClick={() => router.push("/")}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Analyze Another
          </Button>
        </div>
      </header>

      {/* Report Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="space-y-6">
          {/* Decision Header */}
          <ReportHeader
            decision={underwriting.decision}
            decisionSummary={underwriting.decision_summary}
            weightedScore={underwriting.weighted_score}
            applicantName={application.applicant.name}
            amount={application.loan_request.amount_requested}
            currency={application.loan_request.currency}
          />

          {/* Two column layout on desktop */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left column */}
            <div className="space-y-6">
              <ScoreCard
                scores={underwriting.scores}
                weightedScore={underwriting.weighted_score}
              />
              <ExtractedDataPanel application={application} />
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <DecisionTerms
                decision={underwriting.decision}
                terms={underwriting.terms}
              />
              <AnalysisNarrative analysis={underwriting.detailed_analysis} />
              <StressTestPanel
                stressTest={underwriting.terms.stress_test_decision}
                parentDecision={underwriting.decision}
              />
            </div>
          </div>

          {/* Full width - Transcription */}
          <TranscriptionPanel transcription={application.transcription} />

          {/* Footer info */}
          <div className="text-center text-xs text-gray-400 pb-8">
            <p>
              Report ID: {report.id} | Generated:{" "}
              {new Date(report.createdAt).toLocaleString()}
            </p>
            <p className="mt-1">
              VozLend &mdash; AI-Powered Voice Underwriting
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
