export type CVStatus = "DRAFT" | "COMPLETE" | "EXPORTED";

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Language {
  name: string;
  level: "Basic" | "Intermediate" | "Advanced" | "Fluent" | "Native";
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: Language[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: Skills;
  certifications: CertificationEntry[];
  projects: ProjectEntry[];
}

export const EMPTY_CV_DATA: CVData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: { technical: [], soft: [], languages: [] },
  certifications: [],
  projects: [],
};

export interface CVSummary {
  id: string;
  title: string;
  status: CVStatus;
  atsScore: number | null;
  templateId: string;
  updatedAt: Date;
}

export type TemplateId = "modern" | "classic" | "minimal";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  category: string;
}

export function mergeCVData(raw: Partial<CVData> | null | undefined): CVData {
  return {
    ...EMPTY_CV_DATA,
    ...raw,
    personalInfo: { ...EMPTY_CV_DATA.personalInfo, ...(raw?.personalInfo ?? {}) },
    skills: { ...EMPTY_CV_DATA.skills, ...(raw?.skills ?? {}) },
  };
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean layout with a subtle accent color. Great for tech roles.",
    category: "modern",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional structure. Maximizes ATS readability.",
    category: "classic",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Pure whitespace and typography. Stands out with simplicity.",
    category: "minimal",
  },
];
