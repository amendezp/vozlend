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
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="text-base font-medium text-gray-900">
            {isComplete
              ? t("processing.complete")
              : isError
                ? t("processing.error")
                : t("processing.analyzing")}
          </h3>
          {message && (
            <p className="mt-1 text-xs text-gray-400 font-light">{message}</p>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const state = isComplete ? "done" : getStepState(step.key, currentStep);
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    state === "done"
                      ? "bg-emerald-50 text-emerald-500"
                      : state === "active"
                        ? isError
                          ? "bg-red-50 text-red-500"
                          : "bg-gray-50 text-gray-600"
                        : "bg-gray-50 text-gray-300"
                  }`}
                >
                  {state === "done" ? (
                    <CheckCircle className="h-4 w-4 stroke-[1.5]" />
                  ) : state === "active" && !isError ? (
                    <Loader2 className="h-4 w-4 animate-spin stroke-[1.5]" />
                  ) : state === "active" && isError ? (
                    <AlertCircle className="h-4 w-4 stroke-[1.5]" />
                  ) : (
                    <Icon className="h-4 w-4 stroke-[1.5]" />
                  )}
                </div>

                <p
                  className={`text-sm ${
                    state === "done"
                      ? "text-emerald-600"
                      : state === "active"
                        ? isError
                          ? "text-red-600"
                          : "text-gray-900 font-normal"
                        : "text-gray-300"
                  } font-light`}
                >
                  {step.label}
                </p>

                {idx < steps.length - 1 && <div className="hidden" />}
              </div>
            );
          })}
        </div>

        {isError && errorMessage && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600 font-light">
            {errorMessage}
          </div>
        )}

        {isComplete && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-center text-xs font-normal text-emerald-600">
            {t("processing.reportReady")}
          </div>
        )}
      </div>
    </div>
  );
}
