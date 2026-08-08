export interface ExperienceDate {
  dd: number;
  mm: string;
  yyyy: number;
}

export interface BaseExperience {
  role: string;
  startDate: ExperienceDate;
  description: string[];
  company: string;
  companySite: string;
  technologies: string[];
}

export type Experience =
  | (BaseExperience & {
      current: true;
    })
  | (BaseExperience & {
      current?: false;
      endDate: ExperienceDate;
    });

export const experience: Experience[] = [
  {
    role: "Full Stack AI Engineer",
    startDate: {
      dd: 1,
      mm: "September",
      yyyy: 2025,
    },
    current: true,
    description: [
      "Engineered and shipped a full-stack B2B procurement platform from the ground up, owning the backend infrastructure and a Next.js frontend (Shadcn/ui, Redux Toolkit, TanStack Query) — implementing marketplace, RFQ, and vendor management workflows from UX designs to production.",
      "Reduced RFQ quote turnaround from 48+ hours to minutes by building an AI-powered pipeline that automatically parses inbound vendor emails and document attachments (PDF, DOCX, Excel) into structured quote line items.",
      "Architected a TypeScript monorepo with two independently deployable services — an HTTP API server and an async background job worker — and engineered a bidirectional sync with Microsoft Business Central covering vendors, items, quotes, and conversation threads, with real-time email ingestion via Microsoft Graph webhooks.",
      "Built production-grade resilience across the system: circuit breakers on all external service calls, exponential backoff with dead-letter queues, cluster-aware Redis rate limiting, and a multi-strategy vendor sourcing orchestrator that cascades through catalog matching, preferred vendor lookup, AI-powered web discovery, and manual review fallback.",
      "Deployed the full stack on Azure using Container Apps with independent per-service scaling, Azure PostgreSQL, Azure Redis, Blob Storage for document management, and Azure Communication Services for transactional and follow-up emails.",
    ],
    company: "AEOS Labs",
    companySite: "https://labs.aeoscompany.com/",
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Azure",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "Microsoft Graph API",
      "Docker",
    ],
  },
];