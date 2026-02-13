"use client";

import { Upload, AudioLines, Brain, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { ProcessingStep } from "@/types";

interface ProcessingStatusProps {
  currentStep: ProcessingStep;
  progress: number;
  message?: string;
  errorMessage?: string;
}

function getStepState(
  stepKey: ProcessingStep,
  currentStep: ProcessingStep
): "done" | "active" | "pending" {
  const stepOrder = ["uploading", "transcribing", "extracting", "underwriting", "complete"];
  const stepIdx = stepOrder.indexOf(stepKey);
  const currentIdx = stepOrder.indexOf(currentStep);

  if (currentStep === "error") {
    return stepIdx < currentIdx ? "done" : stepIdx === currentIdx ? "active" : "pending";
  }

  if (stepIdx < currentIdx) return "done";
  if (stepIdx === currentIdx) return "active";
  return "pending";
}

export function ProcessingStatus({
  currentStep,
  message,
  errorMessage,
}: ProcessingStatusProps) {
  const { t } = useLanguage();
  const isError = currentStep === "error";
  const isComplete = currentStep === "complete";

  const steps: { key: ProcessingStep; label: string; icon: typeof Upload }[] = [
    { key: "uploading", label: t("processing.stepUploading"), icon: Upload },
    { key: "transcribing", label: t("processing.stepTranscribing"), icon: AudioLines },
    { key: "extracting", label: t("processing.stepExtracting"), icon: Brain },
    { key: "underwriting", label: t("processing.stepUnderwriting"), icon: Shield },
  ];

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {isComplete
              ? t("processing.complete")
              : isError
                ? t("processing.error")
                : t("processing.analyzing")}
          </h3>
          {message && (
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const state = isComplete ? "done" : getStepState(step.key, currentStep);
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                    state === "done"
                      ? "bg-emerald-100 text-emerald-600"
                      : state === "active"
                        ? isError
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-50 text-emerald-500"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {state === "done" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : state === "active" && !isError ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : state === "active" && isError ? (
                    <AlertCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      state === "done"
                        ? "text-emerald-700"
                        : state === "active"
                          ? isError
                            ? "text-red-700"
                            : "text-gray-900"
                          : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Connector line (except last) */}
                {idx < steps.length - 1 && (
                  <div className="hidden" />
                )}
              </div>
            );
          })}
        </div>

        {/* Error details */}
        {isError && errorMessage && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Completion indicator */}
        {isComplete && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700">
            {t("processing.reportReady")}
          </div>
        )}
      </div>
    </div>
  );
}
