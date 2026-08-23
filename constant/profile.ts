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
    "I came into software sideways. An Electronics and Telecommunications degree left me more curious about the code running on the hardware than the hardware itself, so I taught myself the rest by building things instead of waiting for a course to explain them.",
    "What pulls me in is the boundary where my code has to trust something it doesn't control: a phone carrier, an email server, a model that might just make things up. Getting that boundary to behave predictably is most of what I find interesting about this job.",
    "I'd rather spend a weekend breaking something on my own project than get it right in a tutorial. That instinct is basically my whole resume.",
    "Still convinced a well-placed console.log beats a debugger, and that the best compliment a system can get is nobody ever had to think about it.",
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