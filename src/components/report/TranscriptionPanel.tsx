"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Transcription } from "@/types";

interface TranscriptionPanelProps {
  transcription: Transcription;
}

export function TranscriptionPanel({ transcription }: TranscriptionPanelProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4 text-gray-300 stroke-[1.5]" />
        <h2 className="text-base font-medium text-gray-900">{t("transcription.title")}</h2>
      </div>

      <div className="mt-2 flex gap-4 text-xs text-gray-400 font-light">
        <span>{t("transcription.language")}: {transcription.language_detected}</span>
        {transcription.duration && transcription.duration > 0 && (
          <span>{t("transcription.duration")}: {Math.round(transcription.duration)}s</span>
        )}
      </div>

      <div className="mt-4 rounded-lg bg-gray-50/50 p-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-500 font-light italic">
          &ldquo;{transcription.raw_text}&rdquo;
        </p>
      </div>
    </div>
  );
}
