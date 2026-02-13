# VozLend — AI Voice Underwriting Platform

## Product Requirements Document (PRD)

### Overview

VozLend is an AI-powered voice underwriting platform that allows alternative lenders to evaluate loan applicants through voice memos. Applicants record a voice message in Spanish describing who they are, how much they need, and how they plan to repay. VozLend transcribes the audio, extracts structured data, and performs comprehensive underwriting analysis — delivering a decision in under a minute.

### Problem

Traditional loan underwriting is slow, paper-heavy, and excludes millions of people who lack formal credit histories. Many potential borrowers in Latin America have strong earning potential, quality education, and reliable networks, but no credit score. Alternative lenders need faster, character-based underwriting tools.

### Solution

VozLend provides:

1. **Voice-first applications** — Applicants record a voice memo instead of filling out forms
2. **AI transcription** — OpenAI Whisper accurately transcribes Spanish audio
3. **Structured extraction** — LLM extracts applicant details, loan amount, purpose, and repayment plan
4. **8-dimension scoring** — AI evaluates education, network, character, income potential, collateral, debt ratio, purpose alignment, and repayment credibility
5. **Instant decisions** — Approve, Decline, or Request More Information with full reasoning

### User Flow

```
User uploads voice memo (.opus, .ogg, .mp3, .m4a, .wav)
  → Audio validated (format, size ≤ 25MB)
  → Transcribed via OpenAI Whisper API (Spanish)
  → Structured data extracted via LLM
  → Underwriting analysis via LLM (8-dimension scoring)
  → Report generated with decision + terms + narrative
  → User views interactive report page
```

### Decision Framework

| Decision | Criteria | Output |
|----------|----------|--------|
| **Approve** | Weighted score ≥ 6.5, no dimension below 3 | Interest rate, term, conditions |
| **Decline** | Weighted score < 4.5 or critical dimension below 2 | Decline reasons |
| **Request More Info** | Borderline cases (score 4.5–6.5) | Specific questions + stress test |

### Scoring Dimensions

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| Education & Institutional Quality | 15% | Quality of schools attended |
| Professional Network | 10% | Employer quality, connections |
| Character & Communication | 15% | Clarity, honesty, organization |
| Income & Earning Potential | 20% | Current/future income path |
| Collateral & Assets | 5% | Mentioned assets |
| Debt-to-Income Ratio | 10% | Loan vs expected income |
| Purpose Alignment | 10% | Strategic value of loan purpose |
| Repayment Plan Credibility | 15% | Specificity and realism |

---

## Technical Architecture

### Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS v4 + shadcn/ui | UI components |
| Transcription | OpenAI Whisper API | Speech-to-text |
| LLM (Production) | OpenAI GPT-4o | Analysis + extraction |
| LLM (Local Dev) | Ollama (llama3.1) | Free local inference |
| Validation | Zod | Runtime schema validation |
| Deployment | Vercel | Serverless hosting |

### Project Structure

```
vozlend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, metadata
│   │   ├── page.tsx                # Landing page + upload widget
│   │   ├── globals.css             # Tailwind v4 + shadcn theme
│   │   ├── api/process/route.ts    # SSE pipeline orchestrator
│   │   └── report/[id]/page.tsx    # Report display page
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives
│   │   ├── landing/                # Hero, HowItWorks, Footer
│   │   ├── upload/                 # AudioUploader, ProcessingStatus
│   │   └── report/                 # ReportHeader, ScoreCard, etc.
│   ├── lib/
│   │   ├── llm/                    # Provider abstraction (OpenAI/Ollama)
│   │   ├── prompts/                # System prompts for extraction/underwriting
│   │   ├── schemas/                # Zod schemas for validation
│   │   ├── whisper.ts              # Whisper API client
│   │   ├── extraction.ts           # LLM data extraction
│   │   ├── underwriting.ts         # LLM underwriting analysis
│   │   └── storage.ts              # Client-side report storage
│   └── types/index.ts              # TypeScript type definitions
├── .env.example                    # Environment variable template
├── vercel.json                     # Vercel function config
└── package.json
```

### API: POST /api/process

The main endpoint orchestrates the full pipeline via Server-Sent Events (SSE):

**Request:** `multipart/form-data` with `file` field (audio file)

**Response:** `text/event-stream` with events:
- `status` — Progress updates: `{ step, progress, message }`
- `complete` — Final report: `{ reportId, report }`
- `error` — Error details: `{ message }`

**Processing Steps:**
1. Validate audio file (format + size ≤ 25MB)
2. Transcribe via OpenAI Whisper API
3. Extract structured loan data via LLM
4. Perform underwriting analysis via LLM
5. Return complete report

### LLM Provider Abstraction

The app supports swappable LLM backends:

```typescript
// Set LLM_PROVIDER=openai for production, LLM_PROVIDER=ollama for local dev
interface LLMProvider {
  complete(request: LLMCompletionRequest): Promise<string>;
}
```

- **OpenAI** (`src/lib/llm/openai.ts`): Uses GPT-4o with JSON mode
- **Ollama** (`src/lib/llm/ollama.ts`): Uses local Ollama API (llama3.1)

### Data Flow

```
Audio File
  → Buffer (in-memory, no disk)
  → Whisper API → TranscriptionResult { text, language, duration }
  → LLM Extraction → LoanApplication (Zod-validated)
  → LLM Underwriting → UnderwritingResult (Zod-validated)
  → FullReport { id, createdAt, application, underwriting }
  → sessionStorage (client-side, ephemeral)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key (for Whisper transcription)
- Ollama installed locally (optional, for local LLM inference)

### Setup

```bash
# Clone and install
cd vozlend
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your OpenAI API key

# For local development with Ollama:
# Set LLM_PROVIDER=ollama in .env.local
# Ensure ollama is running: ollama serve

# For production (OpenAI GPT-4o):
# Set LLM_PROVIDER=openai in .env.local

# Run dev server
npm run dev
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | — | OpenAI API key for Whisper + GPT-4o |
| `LLM_PROVIDER` | No | `openai` | `openai` or `ollama` |
| `OPENAI_MODEL` | No | `gpt-4o` | OpenAI model for analysis |
| `OLLAMA_BASE_URL` | No | `http://localhost:11434` | Ollama API URL |
| `OLLAMA_MODEL` | No | `llama3.1:8b` | Ollama model name |

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# OPENAI_API_KEY, LLM_PROVIDER=openai
```

**Note:** Vercel Pro plan recommended for the 60-second function timeout required by the pipeline.

---

## Key Design Decisions

1. **SSE over WebSockets** — Simpler, Vercel-compatible, one-way stream is sufficient
2. **In-memory processing** — No temp files, works with Vercel's read-only filesystem
3. **Zod validation** — LLM JSON outputs are validated at runtime to prevent malformed data
4. **Retry logic** — Up to 2 retries for LLM calls if JSON parsing fails
5. **sessionStorage** — Reports stored client-side (no database in MVP)
6. **Provider abstraction** — Swap between OpenAI and Ollama via env var
