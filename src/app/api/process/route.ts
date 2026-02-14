import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { transcribeAudio } from "@/lib/whisper";
import { extractLoanData } from "@/lib/extraction";
import { analyzeApplication } from "@/lib/underwriting";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

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
        // ---- Rate limiting (skip if no DB) ----
        if (prisma) {
          const clientIP = getClientIP(request.headers);
          const rateCheck = await checkRateLimit(`process:${clientIP}`, {
            maxRequests: 5,
            windowMs: 60 * 1000,
          });

          if (!rateCheck.allowed) {
            send("error", {
              message: "Too many requests. Please wait a moment before trying again.",
            });
            controller.close();
            return;
          }
        }

        // ---- Get authenticated user (optional) ----
        let userId: string | undefined;
        try {
          const session = await auth();
          userId = session?.user?.id;
        } catch {
          // Auth may fail if secret not set — continue anonymously
        }

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

        // ---- Create DB record if user is authenticated and DB available ----
        let applicationId: string | null = null;
        if (prisma && userId) {
          try {
            const app = await prisma.application.create({
              data: {
                submittedById: userId,
                status: "processing",
                audioFileName: file.name,
              },
            });
            applicationId = app.id;

            await prisma.auditLog.create({
              data: {
                userId,
                action: "create_application",
                entityType: "application",
                entityId: app.id,
                applicationId: app.id,
              },
            });
          } catch (dbError) {
            logger.warn("DB write failed, continuing without persistence", {
              error: dbError instanceof Error ? dbError.message : String(dbError),
            });
          }
        }

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

        // Update DB with transcription
        if (prisma && applicationId) {
          try {
            await prisma.application.update({
              where: { id: applicationId },
              data: {
                transcription: transcription.text,
                audioDuration: transcription.duration,
                audioLanguage: transcription.language,
              },
            });
          } catch { /* DB write failed — continue */ }
        }

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

        // Update DB with extracted data
        if (prisma && applicationId) {
          try {
            await prisma.application.update({
              where: { id: applicationId },
              data: {
                extractedData: JSON.stringify(application),
                applicantName: application.applicant.name,
                loanAmount: application.loan_request.amount_requested,
                loanCurrency: application.loan_request.currency,
                loanPurpose: application.loan_request.purpose,
              },
            });
          } catch { /* DB write failed — continue */ }
        }

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
        const reportId = applicationId || nanoid(12);

        // Finalize DB record
        if (prisma && applicationId) {
          try {
            await prisma.application.update({
              where: { id: applicationId },
              data: {
                status: "completed",
                underwritingResult: JSON.stringify(underwriting),
                decision: underwriting.decision,
                weightedScore: underwriting.weighted_score,
              },
            });
          } catch { /* DB write failed — continue */ }
        }

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
        logger.error("Pipeline error", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
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
