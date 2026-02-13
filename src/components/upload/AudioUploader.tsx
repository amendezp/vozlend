"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileAudio,
  X,
  Mic,
  Square,
  RotateCcw,
  Check,
  Paperclip,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const ACCEPTED_TYPES: Record<string, string[]> = {
  "audio/opus": [".opus"],
  "audio/ogg": [".ogg", ".opus"],
  "audio/mpeg": [".mp3"],
  "audio/mp4": [".m4a"],
  "audio/x-m4a": [".m4a"],
  "audio/wav": [".wav"],
  "audio/webm": [".webm"],
  "audio/*": [".opus", ".ogg"],
};

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

interface AudioUploaderProps {
  onFileSelected: (file: File) => void;
  onStartProcessing: () => void;
  disabled?: boolean;
}

export function AudioUploader({
  onFileSelected,
  onStartProcessing,
  disabled,
}: AudioUploaderProps) {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      setError(null);

      if (rejectedFiles && (rejectedFiles as Array<unknown>).length > 0) {
        setError(t("upload.invalidFile"));
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > MAX_SIZE) {
          setError(
            t("upload.fileTooLarge").replace(
              "{size}",
              (file.size / 1024 / 1024).toFixed(1)
            )
          );
          return;
        }
        setSelectedFile(file);
        onFileSelected(file);
        setShowUpload(false);
      }
    },
    [onFileSelected, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled,
    noClick: true,
    noKeyboard: true,
  });

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleRecordingComplete = (file: File) => {
    setSelectedFile(file);
    onFileSelected(file);
  };

  return (
    <div className="mx-auto max-w-md" {...getRootProps()}>
      {/* Hidden file input for the upload link */}
      <input {...getInputProps()} ref={fileInputRef} />

      {/* ---- Selected file state (shown after recording or upload) ---- */}
      {selectedFile ? (
        <div className="flex flex-col items-center gap-5">
          {/* Success indicator */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-50/50">
            <Check className="h-7 w-7 text-emerald-500 stroke-[1.5]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-normal text-gray-900">{selectedFile.name}</p>
            <p className="mt-0.5 text-xs text-gray-400 font-light">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {t("upload.readyToAnalyze")}
            </p>
          </div>

          {/* Analyze CTA — prominent */}
          <Button
            size="lg"
            onClick={onStartProcessing}
            disabled={disabled}
            className="bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white pl-7 pr-5 py-3.5 text-sm font-normal rounded-full transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95"
          >
            {t("upload.analyzeButton")}
            <ArrowRight className="h-4 w-4 stroke-[1.5]" />
          </Button>

          {/* Remove / start over */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-light transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            {t("upload.startOver")}
          </button>
        </div>
      ) : showUpload ? (
        /* ---- File upload view (secondary) ---- */
        <div className="flex flex-col items-center gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`w-full cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all
              ${isDragActive ? "border-emerald-400 bg-emerald-50/50 scale-[1.02]" : "border-gray-200 bg-gray-50/30 hover:border-gray-300 hover:bg-gray-50/60"}
              ${disabled ? "pointer-events-none opacity-50" : ""}
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Upload className="h-5 w-5 text-gray-400 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-sm font-normal text-gray-600">
                  {isDragActive ? t("upload.dropActive") : t("upload.dropIdle")}
                </p>
                <p className="mt-1.5 text-xs text-gray-400 font-light">
                  {t("upload.formats")}
                </p>
              </div>
            </div>
          </div>

          {/* Back to recording */}
          <button
            onClick={() => setShowUpload(false)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-light transition-colors"
          >
            <Mic className="h-3 w-3" />
            {t("upload.backToRecord")}
          </button>
        </div>
      ) : (
        /* ---- Default: Voice recording (primary) ---- */
        <div className="flex flex-col items-center">
          <AudioRecorderPanel
            onRecordingComplete={handleRecordingComplete}
            disabled={disabled}
            selectedFile={selectedFile}
            onClear={clearFile}
          />

          {/* Subtle divider + upload alternative */}
          <div className="mt-8 flex items-center gap-3 text-xs text-gray-300">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="font-light">{t("upload.or")}</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <button
            onClick={() => setShowUpload(true)}
            className="mt-4 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-light transition-colors"
          >
            <Paperclip className="h-3 w-3" />
            {t("upload.uploadInstead")}
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-4 text-center text-xs text-red-500 font-light">{error}</p>
      )}
    </div>
  );
}

/* ---- AudioRecorder sub-component ---- */

type RecorderState = "idle" | "recording" | "recorded";

function AudioRecorderPanel({
  onRecordingComplete,
  disabled,
  selectedFile,
  onClear,
}: {
  onRecordingComplete: (file: File) => void;
  disabled?: boolean;
  selectedFile: File | null;
  onClear: () => void;
}) {
  const { t } = useLanguage();
  const [state, setState] = useState<RecorderState>(selectedFile ? "recorded" : "idle");
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getSupportedMimeType(): string {
    const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return "audio/webm";
  }

  const startRecording = async () => {
    setMicError(null);
    if (
      typeof window !== "undefined" &&
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      setMicError(t("recorder.httpsRequired"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const ext = mimeType.includes("mp4") ? "m4a" : "webm";
        const file = new File([blob], `recording-${Date.now()}.${ext}`, { type: mimeType });
        const url = URL.createObjectURL(blob);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(url);
        setState("recorded");
        onRecordingComplete(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(1000);
      setState("recording");
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      setMicError(t("recorder.micDenied"));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const reRecord = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
    setState("idle");
    onClear();
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`text-center transition-all ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      {micError && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-xs text-red-500 font-light">{micError}</p>
        </div>
      )}

      {state === "idle" && (
        <div className="flex flex-col items-center gap-5">
          {/* Big friendly record button */}
          <button
            onClick={startRecording}
            className="group flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95"
          >
            <Mic className="h-9 w-9 stroke-[1.5] transition-transform group-hover:scale-110" />
          </button>
          <div className="text-center">
            <p className="text-base font-normal text-gray-700">
              {t("recorder.tapToRecord")}
            </p>
            <p className="mt-1 text-xs text-gray-400 font-light">
              {t("recorder.describeRequest")}
            </p>
          </div>
        </div>
      )}

      {state === "recording" && (
        <div className="flex flex-col items-center gap-5">
          {/* Pulsing recording indicator */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-red-100 animate-pulse pointer-events-none" />
            <div className="absolute -inset-6 rounded-full bg-red-50 animate-pulse pointer-events-none" style={{ animationDelay: "150ms" }} />
            <button
              onClick={stopRecording}
              className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-red-400 to-red-500 text-white shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Square className="h-7 w-7 fill-current" />
            </button>
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-2xl font-mono font-light text-gray-900 tracking-widest tabular-nums">
              {formatTime(duration)}
            </p>
            <p className="mt-1 text-xs text-red-400 font-light animate-pulse">
              {t("recorder.recording")}
            </p>
          </div>

          {/* Prominent stop button */}
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-normal text-white transition-all hover:bg-gray-800 active:scale-95 cursor-pointer shadow-sm"
          >
            <Square className="h-3 w-3 fill-current" />
            {t("recorder.tapToStop")}
          </button>
        </div>
      )}

      {state === "recorded" && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-50/50">
            <Check className="h-7 w-7 text-emerald-500 stroke-[1.5]" />
          </div>
          {audioUrl && (
            <audio controls src={audioUrl} className="w-full max-w-xs rounded-lg" />
          )}
          <p className="text-xs text-gray-400 font-light">{t("recorder.duration")}: {formatTime(duration)}</p>
          <button
            onClick={reRecord}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-light transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            {t("recorder.reRecord")}
          </button>
        </div>
      )}
    </div>
  );
}
