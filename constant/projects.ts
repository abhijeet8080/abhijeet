export interface Project {
  name: string;
  slug: string;
  description: string;
  technologies: string[];
  links: {
    live?: string;
    github?: string;
  };
}

export const selected_works: Project[] = [
  {
    name: "Rika",
    slug: "rika",
    description:
      "AI meeting notetaker that joins Zoom, Google Meet, and Microsoft Teams calls via Recall.ai — capturing speaker-attributed transcripts and answering questions with cited RAG, both live in-call through @Rika mentions and after the meeting in a web chat.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Recall.ai",
      "Qdrant",
      "Drizzle",
      "Neon",
      "DeepSeek",
      "Clerk",
    ],
    links: {
      live: "https://rika-silk.vercel.app/",
      github: "https://github.com/abhijeet8080/rika",
    },
  },
  {
    name: "ARIA",
    slug: "aria",
    description:
      "Multilingual AI voice agent that handles inbound phone calls end-to-end — auto-detecting the caller's language across 30+ languages, booking appointments, and supporting real-time barge-in at sub-800ms latency via a native audio-to-audio pipeline.",
    technologies: [
      "TypeScript",
      "Hono",
      "Twilio",
      "Gemini Live",
      "Deepgram",
      "Supabase",
      "Upstash Redis",
    ],
    links: {
      github: "https://github.com/abhijeet8080/Aria-",
    },
  },
  {
    name: "redai",
    slug: "redai",
    description:
      "A from-scratch, provider-agnostic TypeScript agent SDK published on npm — hand-written agent loop, tool calling, structured output, guardrails, multi-agent handoffs, sessions, streaming, and tracing. No agent framework underneath.",
    technologies: [
      "TypeScript",
      "Zod",
      "OpenAI",
      "Anthropic",
      "Gemini",
      "tsup",
      "npm",
    ],
    links: {
      github: "https://github.com/abhijeet8080/redai",
      live: "https://www.npmjs.com/package/@abhijeetkadam/redai",
    },
  },
  {
    name: "NotebookLM",
    slug: "notebooklm",
    description:
      "AI-powered research assistant — create notebooks, ingest PDFs, DOCX, websites, YouTube videos, and transcripts, then ask natural-language questions with streamed answers and inline citations that open the exact source passage.",
    technologies: [
      "Next.js",
      "Fastify",
      "Clerk",
      "Neon",
      "Qdrant",
      "BullMQ",
      "DeepSeek",
      "Voyage AI",
    ],
    links: {
      github: "https://github.com/abhijeet8080/notebooklm",
    },
  },
];

export const works: Project[] = [
  {
    name: "Bugbot",
    slug: "bugbot",
    description:
      "Automated GitHub pull-request review bot — a webhook-driven server enqueues review jobs, and a background worker fetches PR diffs, runs a token-bounded LLM analysis pipeline, and posts inline review comments directly on the PR.",
    technologies: [
      "TypeScript",
      "Hono",
      "BullMQ",
      "Prisma",
      "PostgreSQL",
      "GitHub App",
      "OpenAI",
      "Docker",
    ],
    links: {
      github: "https://github.com/abhijeet8080/bugbot",
    },
  },
];