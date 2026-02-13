"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACCEPTED_TYPES: Record<string, string[]> = {
  "audio/ogg": [".ogg", ".opus"],
  "audio/mpeg": [".mp3"],
  "audio/mp4": [".m4a"],
  "audio/x-m4a": [".m4a"],
  "audio/wav": [".wav"],
  "audio/webm": [".webm"],
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      setError(null);

      if (rejectedFiles && (rejectedFiles as Array<unknown>).length > 0) {
        setError("Invalid file. Please upload an audio file (opus, ogg, mp3, m4a, wav, webm).");
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > MAX_SIZE) {
          setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 25MB`);
          return;
        }
        setSelectedFile(file);
        onFileSelected(file);
      }
    },
    [onFileSelected]
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

  return (
    <div className="mx-auto max-w-lg">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all
          ${isDragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300 bg-gray-50/50 hover:border-emerald-400 hover:bg-emerald-50/50"}
          ${disabled ? "pointer-events-none opacity-50" : ""}
        `}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <FileAudio className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Upload className="h-7 w-7 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-700">
                {isDragActive ? "Drop your voice memo here" : "Drop your voice memo here or click to browse"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Supports: opus, ogg, mp3, m4a, wav, webm (max 25MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-3 text-center text-sm text-red-500">{error}</p>
      )}

      {/* Analyze button */}
      {selectedFile && (
        <div className="mt-6 text-center">
          <Button
            size="lg"
            onClick={onStartProcessing}
            disabled={disabled}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-base font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-300"
          >
            Analyze Voice Memo
          </Button>
        </div>
      )}
    </div>
  );
}
