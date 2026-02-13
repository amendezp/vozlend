"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Transcription } from "@/types";

interface TranscriptionPanelProps {
  transcription: Transcription;
}

export function TranscriptionPanel({ transcription }: TranscriptionPanelProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900">{t("transcription.title")}</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Metadata */}
      <div className="mt-2 flex gap-4 text-sm text-gray-500">
        <span>{t("transcription.language")}: {transcription.language_detected}</span>
        {transcription.duration && transcription.duration > 0 && (
          <span>{t("transcription.duration")}: {Math.round(transcription.duration)}s</span>
        )}
      </div>

      {/* Collapsible content */}
      {isOpen && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 italic">
            &ldquo;{transcription.raw_text}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
