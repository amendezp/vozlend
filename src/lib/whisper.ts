import OpenAI from "openai";

export interface TranscriptionResult {
  text: string;
  language: string;
  duration: number;
}

export async function transcribeAudio(
  audioBuffer: Buffer,
  fileName: string
): Promise<TranscriptionResult> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Determine MIME type from extension
  const ext = fileName.split(".").pop()?.toLowerCase() || "ogg";
  const mimeTypes: Record<string, string> = {
    opus: "audio/ogg",
    ogg: "audio/ogg",
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
    wav: "audio/wav",
    webm: "audio/webm",
    mpeg: "audio/mpeg",
  };
  const mimeType = mimeTypes[ext] || "audio/ogg";

  // Whisper API doesn't accept .opus — rename to .ogg (same codec, accepted extension)
  const apiFileName = ext === "opus" ? fileName.replace(/\.opus$/i, ".ogg") : fileName;

  const file = new File([new Uint8Array(audioBuffer)], apiFileName, { type: mimeType });

  // Let Whisper auto-detect language (supports EN, ES, and 50+ others)
  const transcription = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file: file,
    response_format: "verbose_json",
  });

  return {
    text: transcription.text,
    language: transcription.language || "unknown",
    duration: transcription.duration || 0,
  };
}
