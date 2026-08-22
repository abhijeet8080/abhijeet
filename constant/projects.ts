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
      "Joins your Zoom, Google Meet, and Teams calls. Captures speaker-attributed transcripts and answers questions with cited RAG, live in-call through @Rika mentions or after the meeting in a web chat.",
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
      "Answers inbound calls end to end. Auto-detects the caller's language across 30+ languages, books appointments, and handles real-time barge-in at sub-800ms latency through a native audio-to-audio pipeline.",
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
      "A provider-agnostic TypeScript agent SDK published on npm. Hand-written agent loop, tool calling, structured output, guardrails, multi-agent handoffs, sessions, streaming, tracing. No agent framework underneath.",
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
      "Feed it PDFs, DOCX, websites, YouTube videos, transcripts. Ask it anything in plain language and get a streamed answer with inline citations that open the exact source passage.",
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
      "Reviews your pull requests before you do. A webhook-driven server enqueues review jobs, a background worker fetches the diff, runs a token-bounded LLM pipeline, and posts inline comments directly on the PR.",
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