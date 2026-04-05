import { CVData } from "@/types/cv";

export const mockCVData: CVData = {
  personalInfo: {
    fullName: "Jane Doe",
    email: "jane@example.com",
    phone: "+1 555 000 0000",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/janedoe",
    github: "github.com/janedoe",
    summary: "Senior software engineer with 8 years of experience building scalable web applications.",
  },
  experience: [
    {
      id: "exp-1",
      company: "Acme Corp",
      position: "Senior Software Engineer",
      startDate: "2020-01",
      endDate: "",
      current: true,
      description: "Led development of core platform features.",
      achievements: ["Reduced API latency by 40%", "Mentored 3 junior engineers"],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "MIT",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2012-09",
      endDate: "2016-06",
    },
  ],
  skills: {
    technical: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    soft: ["Leadership", "Communication"],
    languages: [{ name: "English", level: "Native" }],
  },
  certifications: [],
  projects: [],
};
