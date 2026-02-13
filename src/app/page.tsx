"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { AudioUploader } from "@/components/upload/AudioUploader";
import { ProcessingStatus } from "@/components/upload/ProcessingStatus";
import { useLanguage } from "@/context/LanguageContext";
import { storeReport } from "@/lib/storage";
import type { ProcessingStep, FullReport } from "@/types";

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProcessingStep>("uploading");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelected = useCallback((f: File) => {
    setFile(f);
    setErrorMessage("");
  }, []);

  const handleStartProcessing = useCallback(async () => {
    if (!file) return;

    setProcessing(true);
    setCurrentStep("uploading");
    setProgress(0);
    setStatusMessage(t("processing.preparing"));
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        let eventType = "";
        let eventData = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            eventData = line.slice(6).trim();
          } else if (line === "" && eventType && eventData) {
            // Complete event — process it
            try {
              const data = JSON.parse(eventData);

              if (eventType === "status") {
                setCurrentStep(data.step as ProcessingStep);
                setProgress(data.progress || 0);
                setStatusMessage(data.message || "");
              } else if (eventType === "complete") {
                setCurrentStep("complete");
                setProgress(1);
                setStatusMessage(t("processing.reportReadyShort"));

                // Store report and navigate
                const report: FullReport = data.report;
                storeReport(report);

                // Brief delay for user to see "complete" state
                setTimeout(() => {
                  router.push(`/report/${data.reportId}`);
                }, 1500);
              } else if (eventType === "error") {
                setCurrentStep("error");
                setErrorMessage(data.message || "An error occurred");
                setProcessing(false);
              }
            } catch {
              // Skip malformed JSON
            }

            eventType = "";
            eventData = "";
          }
        }
      }
    } catch (error) {
      setCurrentStep("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Connection failed"
      );
      setProcessing(false);
    }
  }, [file, router, t]);

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Upload / Processing Section */}
      <section className="pb-16 md:pb-24" id="upload">
        <div className="mx-auto max-w-5xl px-6">
          {processing ? (
            <ProcessingStatus
              currentStep={currentStep}
              progress={progress}
              message={statusMessage}
              errorMessage={errorMessage}
            />
          ) : (
            <AudioUploader
              onFileSelected={handleFileSelected}
              onStartProcessing={handleStartProcessing}
              disabled={processing}
            />
          )}
        </div>
      </section>

      <HowItWorks />
      <Footer />
    </div>
  );
}
