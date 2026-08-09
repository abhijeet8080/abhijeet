export interface CaseStudyFeature {
  title: string;
  description: string;
}

export interface CaseStudy {
  slug: string;
  name: string;
  tagline: string;
  status: string;
  /** Hero band gradient colors (matches the WorkCard palette) */
  gradient: string[];
  overview: string[];
  features: CaseStudyFeature[];
  /** Pipeline / design steps, rendered as a numbered flow */
  architecture: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  links: { live?: string; github?: string };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "rika",
    name: "Rika",
    tagline:
      "An AI meeting notetaker that joins your calls, remembers everything, and answers questions with receipts.",
    status: "Shipped",
    gradient: ["#F97316", "#F59E0B", "#EF4444"],
    overview: [
      "Paste a meeting link — or connect a calendar — and Rika joins Zoom, Google Meet, or Microsoft Teams calls via Recall.ai. She records audio/video, captures speaker-attributed transcripts, and turns every meeting into a searchable, queryable knowledge base.",
      "After the call, a webhook-driven pipeline chunks the transcript by speaker turn, generates embeddings, and powers a RAG chat with citations — plus live in-call Q&A through @Rika mentions in the meeting chat. When the bot leaves, meeting intelligence (summary, action items, timestamped highlights) is generated automatically.",
    ],
    features: [
      {
        title: "Joins any call",
        description:
          "Zoom, Google Meet, and Microsoft Teams via Recall.ai — paste a link for an instant bot, or auto-record from connected Google/Outlook calendars.",
      },
      {
        title: "Live in-call answers",
        description:
          "Participants message @Rika in the meeting chat and get answers grounded in the transcript — while the meeting is still happening.",
      },
      {
        title: "Cited RAG chat",
        description:
          "Category-scoped retrieval with query classification that skips unnecessary lookups; responses stream with inline citations through the Vercel AI SDK.",
      },
      {
        title: "Meeting intelligence",
        description:
          "Summaries, action items, and timestamped highlights generated automatically when the call ends — regenerable on demand.",
      },
      {
        title: "Multi-tenant by design",
        description:
          "Clerk authentication, resource-level ownership checks on every route, and Upstash rate limiting for safe multi-user usage.",
      },
      {
        title: "Exports",
        description:
          "Download any transcript as TXT, SRT, or a formatted PDF from the meeting workspace.",
      },
    ],
    architecture: [
      "A Recall.ai bot joins the meeting and streams lifecycle events to a webhook endpoint",
      "On completion, the transcript is chunked by speaker turn for attribution",
      "768-dimensional Gemini embeddings are generated per chunk",
      "Vectors are upserted into Qdrant; metadata persists to Neon Postgres via Drizzle — failure-safe, reprocessable",
      "At query time: classify intent → retrieve → stream a cited answer",
    ],
    stack: [
      "Next.js 16",
      "TypeScript",
      "Recall.ai",
      "Qdrant",
      "Drizzle ORM",
      "Neon Postgres",
      "DeepSeek",
      "Gemini Embeddings",
      "Vercel AI SDK",
      "Clerk",
      "Upstash",
      "Tailwind CSS 4",
    ],
    metrics: [
      { label: "Meeting platforms", value: "3" },
      { label: "Embedding dims", value: "768" },
      { label: "Export formats", value: "3" },
      { label: "Delivery phases", value: "4 shipped" },
    ],
    links: {
      live: "https://rika-silk.vercel.app/",
      github: "https://github.com/abhijeet8080/rika",
    },
  },
  {
    slug: "aria",
    name: "ARIA",
    tagline:
      "A multilingual AI receptionist that answers phone calls in the caller's own language — in real time.",
    status: "Built — dual architecture",
    gradient: ["#9333EA", "#6366F1", "#8B5CF6"],
    overview: [
      "ARIA is a phone-based AI voice agent for a medical clinic. Incoming calls are handled by Twilio; audio streams over WebSockets to a Node.js server that acts as a central bridge — processing the caller's audio, reasoning about it, and speaking back naturally, in the caller's own language.",
      "The system supports two swappable architectures: a native audio-in/audio-out pipeline on the Gemini Live API, and a sequential pipeline chaining Deepgram STT → Gemini → a dual-provider TTS layer — toggled by a single config switch.",
    ],
    features: [
      {
        title: "30+ languages, auto-detected",
        description:
          "Deepgram's nova-2 multilingual model detects the caller's language (normalized to BCP-47) and the entire conversation continues in it — Deepgram Aura 2 for English, Google Cloud TTS for everything else.",
      },
      {
        title: "Sub-800ms responses",
        description:
          "The Gemini Live pipeline speaks natively audio-to-audio with tool calls executed synchronously mid-conversation.",
      },
      {
        title: "Real-time barge-in",
        description:
          "A local ONNX voice-activity detector watches every audio packet — callers can interrupt mid-sentence and playback is cut instantly.",
      },
      {
        title: "Stateful appointment booking",
        description:
          "A GREETING → COLLECTING_INFO → CONFIRMING → BOOKED/FAILED state machine collects details, checks slot availability, books into Postgres, and sends an SMS confirmation.",
      },
      {
        title: "Production plumbing",
        description:
          "Session locks in Upstash Redis; full transcripts and final call state logged to Supabase on every hangup.",
      },
    ],
    architecture: [
      "Twilio streams continuous 8 kHz µ-law audio packets over WebSockets",
      "Every packet feeds the local VAD — speech onset fires an instant barge-in event",
      "Live mode: audio is upsampled to Gemini Live and its audio response is downsampled back; Sequential mode: Deepgram STT → Gemini → language-aware TTS",
      "Tool calls (check slots, book appointment, send SMS) execute with dynamic state instructions injected before each turn",
      "On hangup: the Redis session lock is released and the full transcript + final state are logged to Supabase",
    ],
    stack: [
      "TypeScript",
      "Hono",
      "Twilio",
      "Gemini Live API",
      "Deepgram STT",
      "Deepgram Aura TTS",
      "Google Cloud TTS",
      "Supabase",
      "Upstash Redis",
      "ONNX Runtime",
      "WebSockets",
    ],
    metrics: [
      { label: "Languages", value: "30+" },
      { label: "Response latency", value: "<800ms" },
      { label: "Architectures", value: "2" },
      { label: "Audio pipeline", value: "8kHz µ-law" },
    ],
    links: {
      github: "https://github.com/abhijeet8080/Aria-",
    },
  },

  {
    slug: "redai",
    name: "redai",
    tagline:
      "A from-scratch TypeScript agent SDK — the loop, tools, guardrails, handoffs, streaming, and tracing are all hand-written.",
    status: "Published on npm",
    gradient: ["#38BDF8", "#2563EB", "#4F46E5"],
    overview: [
      "redai is a minimal, provider-agnostic agent runtime you embed in your own Node/TypeScript apps. Configure an Agent — instructions, model, tools, optional schemas, guardrails, handoffs — then call run() or stream().",
      "It is deliberately not a wrapper around LangChain, LlamaIndex, or the OpenAI Agents SDK: the agent loop, tool dispatch, guardrails, handoffs, streaming, and tracing are all hand-written. Provider SDKs are optional peer dependencies — install only what you use.",
    ],
    features: [
      {
        title: "Typed agent loop",
        description:
          "A readable, owned agent loop in runner.ts — tool calling, turn management, and termination conditions with zero framework magic.",
      },
      {
        title: "Structured output",
        description:
          "Zod schemas compile to JSON Schema for providers, then validate — with automatic repair attempts on malformed model output.",
      },
      {
        title: "Guardrails everywhere",
        description:
          "Input, output, and tool-level guardrails intercept bad data before it reaches the model or your systems.",
      },
      {
        title: "Multi-agent handoffs",
        description:
          "Agents delegate to other agents with self-handoff blocks and loop caps to prevent runaway delegation.",
      },
      {
        title: "Sessions & memory",
        description:
          "Multi-turn conversations via in-memory or JSON-file session stores — your infra, your choice.",
      },
      {
        title: "Observable by default",
        description:
          "Every run returns a Trace with spans and token totals; streaming events let you watch the loop think.",
      },
    ],
    architecture: [
      "No framework under the hood — the loop is owned and readable in runner.ts",
      "Result types over throws — expected failures return { ok: false, error } so callers branch with instanceof",
      "One streaming path — run() is simply a drain of stream(), so features never drift apart",
      "Provider-agnostic core — only ModelProvider + ModelMessage exist at the boundary; OpenAI, Anthropic, and Gemini adapters are optional peers",
      "Safety valves — maxTurns, maxHandoffs, and maxOutputRepairAttempts prevent runaway loops and runaway bills",
    ],
    stack: [
      "TypeScript",
      "Zod",
      "zod-to-json-schema",
      "tsup",
      "OpenAI (peer)",
      "Anthropic (peer)",
      "Gemini (peer)",
      "ESM + CJS builds",
    ],
    metrics: [
      { label: "Framework deps", value: "0" },
      { label: "Providers", value: "3 + mock" },
      { label: "Examples", value: "8" },
      { label: "License", value: "MIT" },
    ],
    links: {
      github: "https://github.com/abhijeet8080/redai",
      live: "https://www.npmjs.com/package/@abhijeetkadam/redai",
    },
  },

  {
    slug: "notebooklm",
    name: "NotebookLM",
    tagline:
      "An AI research assistant where every answer cites its source — down to the exact page, timestamp, or passage.",
    status: "Shipped — full RAG pipeline",
    gradient: ["#10B981", "#0D9488", "#06B6D4"],
    overview: [
      "Users create notebooks — isolated knowledge bases — then upload or link knowledge sources: PDFs, text, markdown, DOCX, websites, YouTube videos, VTT transcripts. Each source flows through an extract → chunk → embed → index pipeline with live status tracking.",
      "Questions are answered with streamed, natural-language responses carrying inline citations. Clicking a citation opens the Source Viewer at the original page, timestamp, or highlighted passage — no claim without a path back to the source.",
    ],
    features: [
      {
        title: "7 source types",
        description:
          "PDF (pdf-parse), plain text, markdown, DOCX (mammoth), websites (Firecrawl → markdown), YouTube captions, and VTT transcripts.",
      },
      {
        title: "Live indexing status",
        description:
          "Sources move through pending → parsing → chunking → embedding → indexing → ready, with the UI polling every 2 seconds and one-click reindex on failure.",
      },
      {
        title: "Hybrid retrieval",
        description:
          "Qdrant semantic search (one collection per notebook) fused with Postgres tsvector keyword search, then reranked by Voyage rerank-2.5-lite.",
      },
      {
        title: "Local embeddings",
        description:
          "Supabase/bge-small-en runs locally via @huggingface/transformers — 384-dim ONNX inference, no embedding API bill.",
      },
      {
        title: "Source Viewer",
        description:
          "Citation chips resolve to the original material at the exact page, video timestamp, or highlighted passage.",
      },
      {
        title: "Multi-notebook workspaces",
        description:
          "Clerk-authenticated users keep isolated notebooks, each with its own sources, vector collection, and chat history.",
      },
    ],
    architecture: [
      "Upload or link a source — a BullMQ ingestion job lands on the queue (Upstash Redis)",
      "The worker extracts text, chunks it, embeds locally, and indexes into Qdrant — status live at every stage",
      "Chunk text + tsvector vectors live in Neon Postgres (Drizzle) for keyword search",
      "On ask: query transform → hybrid retrieve → Voyage rerank → DeepSeek streams the synthesized answer",
      "Every sentence carries a [[chunkId]] citation that the Source Viewer resolves back to the original material",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Fastify 5",
      "Clerk",
      "Neon Postgres",
      "Drizzle ORM",
      "BullMQ",
      "Upstash Redis",
      "Qdrant Cloud",
      "DeepSeek",
      "Voyage AI",
      "Firecrawl",
      "HF Transformers",
    ],
    metrics: [
      { label: "Source types", value: "7" },
      { label: "Embedding", value: "384-dim local" },
      { label: "Status stages", value: "6" },
      { label: "Retrieval", value: "Hybrid + rerank" },
    ],
    links: {
      github: "https://github.com/abhijeet8080/notebooklm",
    },
  },

  {
    slug: "bugbot",
    name: "Bugbot",
    tagline:
      "A GitHub App that reviews your pull requests with inline LLM comments — webhook in, review out.",
    status: "Built — server + worker monorepo",
    gradient: ["#F97316", "#F59E0B", "#EF4444"],
    overview: [
      "When a PR is opened or updated, GitHub sends a webhook to the Bugbot server. The server validates the signature, enqueues a review job, and responds in milliseconds — a background worker then picks up the job, fetches the PR diff, runs an LLM analysis pipeline, and posts inline review comments directly on the PR.",
      "The system is a TypeScript monorepo with two runnable apps (server + worker) and two shared packages (config + db), built for resilience: retries with backoff, per-chunk error isolation, token caps, and comment deduplication.",
    ],
    features: [
      {
        title: "Millisecond webhooks",
        description:
          "The Hono server verifies the HMAC signature, upserts a ReviewJob, enqueues to BullMQ, and acks GitHub in milliseconds — all heavy lifting is deferred.",
      },
      {
        title: "Token-bounded chunking",
        description:
          "Large diffs are split into model-sized chunks with global token caps, keeping OpenAI costs predictable on monster PRs.",
      },
      {
        title: "Inline review comments",
        description:
          "Findings are posted as file/line-anchored PR review comments through the GitHub App installation client.",
      },
      {
        title: "Resilient by default",
        description:
          "Exponential backoff with up to 3 retries per job, and per-chunk error isolation so one bad diff never sinks a review.",
      },
      {
        title: "No duplicate noise",
        description:
          "Existing PR comments are fetched before posting, so re-pushes never re-report the same issue.",
      },
    ],
    architecture: [
      "GitHub App webhook → Hono server, HMAC signature verified",
      "ReviewJob upserted via Prisma 7 (PostgreSQL 16) and enqueued to BullMQ on Redis",
      "The worker fetches PR files through the installation-scoped Octokit client",
      "Diff → token-bounded chunks → gpt-4.1-mini analysis via the Responses API",
      "Findings post as a single inline review; totals are exposed at GET /stats",
    ],
    stack: [
      "TypeScript",
      "npm workspaces",
      "Hono",
      "BullMQ",
      "ioredis",
      "Prisma 7",
      "PostgreSQL 16",
      "Octokit",
      "OpenAI SDK",
      "pino",
      "Docker Compose",
    ],
    metrics: [
      { label: "Webhook ack", value: "ms" },
      { label: "Retries", value: "3× backoff" },
      { label: "Apps + packages", value: "2 + 2" },
      { label: "Model", value: "gpt-4.1-mini" },
    ],
    links: {
      github: "https://github.com/abhijeet8080/bugbot",
    },
  },
];

export const getCaseStudy = (slug: string) =>
  CASE_STUDIES.find((study) => study.slug === slug);

