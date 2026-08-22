interface Name {
  full: string;
  first: string;
  last: string;
}

interface Work {
  title: string;
  company: string;
}

interface Location {
  city: string;
  state: string;
}

interface Education {
  uni: string;
  degree: string;
  major: string;
  batch: string;
  location: Location;
}

interface Titles {
  constant_word: string;
  rotating_words: string[];
}

interface Profile {
  name: Name;
  email: string;
  phone: string;
  work: Work;
  education: Education;
  curr_location: Location;
  about: string[];
  hero_titles: Titles;
  quote: string;
}

export const profile: Profile = {
  name: {
    full: "Abhijeet Kadam",
    first: "Abhijeet",
    last: "Kadam",
  },

  email: "abhijeetkadam.dev@gmail.com",
  phone: "+91 8080053515",

  work: {
    title: "Full Stack AI Engineer",
    company: "AEOS Labs",
  },

  education: {
    uni: "Vishwakarma Institute of Information Technology",
    degree: "B. Tech",
    major: "Electronics and Telecommunications",
    batch: "2021 - 2025",
    location: {
      city: "Pune",
      state: "Maharashtra",
    },
  },

  curr_location: {
    city: "Bangalore",
    state: "Karnataka",
  },

  about: [
    "I'm a full stack AI engineer who ships production systems — voice agents that answer phone calls in 30+ languages, RAG pipelines that cite their sources, and an agent SDK written from scratch and published on npm.",
    "I like owning the hard parts: real-time audio pipelines, webhook-driven syncs, background workers, and the unglamorous reliability work — circuit breakers, retries, dead-letter queues.",
    "At AEOS Labs I build AI-powered procurement — turning 48-hour RFQ quote turnarounds into minutes by parsing vendor emails and documents into structured quote line items.",
    "Still learning. Still shipping. Still convinced a well-placed console.log is a legitimate debugging strategy.",
  ],

  hero_titles: {
    constant_word: "I build",
    rotating_words: [
      "Voice Agents",
      "RAG Pipelines",
      "Agent SDKs",
      "AI Workflows",
      "Full-Stack Apps",
    ],
  },

  quote: "If it can fail, it will. Plan for that first.",
};