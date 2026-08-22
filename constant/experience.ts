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
      "Built a full-stack B2B procurement platform from the ground up. Owned the backend infrastructure and a Next.js frontend (Shadcn/ui, Redux Toolkit, TanStack Query), shipping marketplace, RFQ, and vendor management workflows from UX designs to production.",
      "Cut RFQ quote turnaround from 48+ hours to minutes. An AI-powered pipeline parses inbound vendor emails and document attachments (PDF, DOCX, Excel) straight into structured quote line items.",
      "Architected a TypeScript monorepo with two independently deployable services, an HTTP API server and an async background job worker, and engineered a bidirectional sync with Microsoft Business Central covering vendors, items, quotes, and conversation threads, with real-time email ingestion via Microsoft Graph webhooks.",
      "Made the system resilient by default: circuit breakers on every external call, exponential backoff with dead-letter queues, cluster-aware Redis rate limiting, and a multi-strategy vendor sourcing orchestrator that cascades through catalog matching, preferred vendor lookup, AI-powered web discovery, and manual review fallback.",
      "Deployed the full stack on Azure, Container Apps with independent per-service scaling, Azure PostgreSQL, Azure Redis, Blob Storage for documents, and Azure Communication Services for transactional and follow-up emails.",
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