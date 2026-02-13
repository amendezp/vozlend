"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mic, Download } from "lucide-react";
import { getReport } from "@/lib/storage";
import { useLanguage } from "@/context/LanguageContext";
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
  const { t } = useLanguage();
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

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-xl font-light text-gray-900">{t("report.notFoundTitle")}</h1>
        <p className="text-sm text-gray-400 font-light">
          {t("report.notFoundDesc")}
        </p>
        <Button onClick={() => router.push("/")} variant="outline" className="font-normal text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("report.backToHome")}
        </Button>
      </div>
    );
  }

  const { application, underwriting } = report;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("report.back")}
          </button>

          <div className="flex items-center gap-2 text-xs font-normal text-gray-900 tracking-wide">
            <Mic className="h-3.5 w-3.5 text-emerald-500" />
            {t("report.brand")}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownloadPDF}
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs font-normal border-gray-200"
            >
              <Download className="h-3.5 w-3.5" />
              {t("report.downloadPdf")}
            </Button>
            <Button
              onClick={() => router.push("/")}
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-normal"
            >
              {t("report.analyzeAnother")}
            </Button>
          </div>
        </div>
      </header>

      {/* Report Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="space-y-6">
          <ReportHeader
            decision={underwriting.decision}
            decisionSummary={underwriting.decision_summary}
            weightedScore={underwriting.weighted_score}
            applicantName={application.applicant.name}
            amount={application.loan_request.amount_requested}
            currency={application.loan_request.currency}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <ScoreCard
                scores={underwriting.scores}
                weightedScore={underwriting.weighted_score}
              />
              <ExtractedDataPanel application={application} />
            </div>
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

          <TranscriptionPanel transcription={application.transcription} />

          <div className="text-center text-xs text-gray-300 pb-8 font-light">
            <p>
              {t("report.reportId")}: {report.id} | {t("report.generated")}:{" "}
              {new Date(report.createdAt).toLocaleString()}
            </p>
            <p className="mt-1">{t("report.footerBrand")}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
