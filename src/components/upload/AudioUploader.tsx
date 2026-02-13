"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, X, Mic, Square, RotateCcw, Check } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");

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
      }
    },
    [onFileSelected, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled,
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
    <div className="mx-auto max-w-lg">
      {/* Tab Toggle */}
      <div className="mb-6 flex rounded-lg bg-gray-50 p-1">
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 rounded-md px-4 py-2 text-sm transition-all ${
            activeTab === "upload"
              ? "bg-white text-gray-900 shadow-sm font-normal"
              : "text-gray-400 hover:text-gray-600 font-light"
          }`}
        >
          <Upload className="mr-2 inline-block h-3.5 w-3.5" />
          {t("upload.tabUpload")}
        </button>
        <button
          onClick={() => setActiveTab("record")}
          className={`flex-1 rounded-md px-4 py-2 text-sm transition-all ${
            activeTab === "record"
              ? "bg-white text-gray-900 shadow-sm font-normal"
              : "text-gray-400 hover:text-gray-600 font-light"
          }`}
        >
          <Mic className="mr-2 inline-block h-3.5 w-3.5" />
          {t("upload.tabRecord")}
        </button>
      </div>

      {activeTab === "upload" ? (
        <>
          {/* Drop zone */}
          <div
            {...getRootProps()}
            className={`relative cursor-pointer rounded-xl border border-dashed p-8 text-center transition-all
              ${isDragActive ? "border-emerald-400 bg-emerald-50/50" : "border-gray-200 bg-gray-50/30 hover:border-gray-300 hover:bg-gray-50/50"}
              ${disabled ? "pointer-events-none opacity-50" : ""}
            `}
          >
            <input {...getInputProps()} />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                  <FileAudio className="h-6 w-6 text-emerald-500 stroke-[1.5]" />
                </div>
                <div>
                  <p className="font-normal text-sm text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400 font-light">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 font-light"
                >
                  <X className="h-3 w-3" />
                  {t("upload.remove")}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                  <Upload className="h-6 w-6 text-gray-300 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-sm font-normal text-gray-600">
                    {isDragActive ? t("upload.dropActive") : t("upload.dropIdle")}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 font-light">
                    {t("upload.formats")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <AudioRecorderPanel
          onRecordingComplete={handleRecordingComplete}
          disabled={disabled}
          selectedFile={selectedFile}
          onClear={clearFile}
        />
      )}

      {/* Error message */}
      {error && (
        <p className="mt-3 text-center text-xs text-red-500 font-light">{error}</p>
      )}

      {/* Analyze button */}
      {selectedFile && (
        <div className="mt-6 text-center">
          <Button
            size="lg"
            onClick={onStartProcessing}
            disabled={disabled}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-sm font-normal rounded-lg transition-all"
          >
            {t("upload.analyzeButton")}
          </Button>
        </div>
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
      className={`rounded-xl border border-dashed p-8 text-center transition-all ${
        state === "recording"
          ? "border-red-300 bg-red-50/30"
          : "border-gray-200 bg-gray-50/30"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      {micError && <p className="mb-4 text-xs text-red-500 font-light">{micError}</p>}

      {state === "idle" && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={startRecording}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 transition-all hover:bg-emerald-100 hover:scale-105"
          >
            <Mic className="h-7 w-7 stroke-[1.5]" />
          </button>
          <p className="text-sm text-gray-400 font-light">
            {t("recorder.startRecording")}
          </p>
        </div>
      )}

      {state === "recording" && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-2 border-red-200 animate-ping opacity-30 pointer-events-none" />
            <button
              onClick={stopRecording}
              className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 transition-all hover:bg-red-100 hover:scale-105 cursor-pointer"
            >
              <Square className="h-5 w-5 fill-current" />
            </button>
          </div>
          <p className="text-lg font-mono font-light text-red-500 tracking-wider">
            {formatTime(duration)}
          </p>
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2 text-sm font-normal text-white transition-all hover:bg-red-600 cursor-pointer"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            {t("recorder.stopRecording")}
          </button>
        </div>
      )}

      {state === "recorded" && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <Check className="h-6 w-6 text-emerald-500 stroke-[1.5]" />
          </div>
          {audioUrl && <audio controls src={audioUrl} className="w-full max-w-xs" />}
          <p className="text-xs text-gray-400 font-light">{formatTime(duration)}</p>
          <button
            onClick={reRecord}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-normal text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            {t("recorder.reRecord")}
          </button>
        </div>
      )}
    </div>
  );
}
