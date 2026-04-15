export type TemplateId = 'classic' | 'modern' | 'executive';

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
  percentage?: string;
  university?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ResumeData {
  personal: {
    name: string;
    title?: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  aboutMe?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
}
