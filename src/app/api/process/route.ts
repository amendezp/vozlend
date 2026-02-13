import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { transcribeAudio } from "@/lib/whisper";
import { extractLoanData } from "@/lib/extraction";
import { analyzeApplication } from "@/lib/underwriting";

const ALLOWED_EXTENSIONS = ["opus", "ogg", "mp3", "m4a", "wav", "webm", "mpeg"];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (OpenAI Whisper limit)

function createSSEMessage(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(createSSEMessage(event, data)));
      };

      try {
        // ---- Step 1: Receive and validate audio ----
        send("status", {
          step: "uploading",
          progress: 0.1,
          message: "Receiving audio file...",
        });

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
          send("error", { message: "No audio file provided" });
          controller.close();
          return;
        }

        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          send("error", {
            message: `Unsupported format: .${ext}. Supported: ${ALLOWED_EXTENSIONS.join(", ")}`,
          });
          controller.close();
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          send("error", {
            message: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 25MB`,
          });
          controller.close();
          return;
        }

        const audioBuffer = Buffer.from(await file.arrayBuffer());

        send("status", {
          step: "uploading",
          progress: 0.2,
          message: "Audio received. Starting transcription...",
        });

        // ---- Step 2: Transcribe via Whisper API ----
        send("status", {
          step: "transcribing",
          progress: 0.3,
          message: "Transcribing voice memo with Whisper AI...",
        });

        const transcription = await transcribeAudio(audioBuffer, file.name);

        send("status", {
          step: "transcribing",
          progress: 0.45,
          message: `Transcription complete. Language: ${transcription.language}. Duration: ${Math.round(transcription.duration)}s`,
        });

        // ---- Step 3: Extract structured data via LLM ----
        send("status", {
          step: "extracting",
          progress: 0.5,
          message: "Extracting loan application data...",
        });

        const application = await extractLoanData(
          transcription.text,
          transcription.language,
          transcription.duration
        );

        send("status", {
          step: "extracting",
          progress: 0.65,
          message: `Data extracted. Applicant: ${application.applicant.name || "Unknown"}`,
        });

        // ---- Step 4: Underwriting analysis via LLM ----
        send("status", {
          step: "underwriting",
          progress: 0.7,
          message: "Performing underwriting analysis...",
        });

        const underwriting = await analyzeApplication(application);

        send("status", {
          step: "underwriting",
          progress: 0.9,
          message: "Analysis complete. Generating report...",
        });

        // ---- Step 5: Generate report ----
        const reportId = nanoid(12);
        const report = {
          id: reportId,
          createdAt: new Date().toISOString(),
          application,
          underwriting,
        };

        send("complete", {
          reportId,
          report,
        });

        controller.close();
      } catch (error) {
        console.error("[EchoBank] Pipeline error:", error);
        const message =
          error instanceof Error ? error.message : "An unexpected error occurred";
        try {
          controller.enqueue(
            encoder.encode(
              createSSEMessage("error", { message })
            )
          );
        } catch {
          // Stream may already be closed
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
