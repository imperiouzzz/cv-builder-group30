// ── CV Section types ────────────────────────────────────────

export interface EducationEntry {
  id?: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  achievements: string;
}

export interface WorkEntry {
  id?: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id?: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
}

export interface ProjectEntry {
  id?: string;
  name: string;
  tech: string;
  period: string;
  description: string;
  link: string;
}

export interface VolunteeringEntry {
  id?: string;
  role: string;
  org: string;
  period: string;
  desc: string;
}

export interface ReferenceEntry {
  id?: string;
  name: string;
  title: string;
  org: string;
  email: string;
  phone: string;
}

export interface CustomSection {
  id?: string;
  sectionTitle: string;
  entries: string;
}

// ── Full CV document ────────────────────────────────────────

export interface CVData {
  id?: string;
  title: string;
  template: 'classic' | 'modern';
  font: string;
  atsScore: number;

  // Personal
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;

  // Sections
  education: EducationEntry[];
  workExp: WorkEntry[];
  skills: Skill[];
  projects: ProjectEntry[];
  volunteering: VolunteeringEntry[];
  references: ReferenceEntry[];
  customSections: CustomSection[];

  // Display order (array of section keys)
  sectionOrder: SectionKey[];
}

export type SectionKey =
  | 'summary'
  | 'education'
  | 'work'
  | 'projects'
  | 'volunteering'
  | 'skills'
  | 'references'
  | 'custom';

// ── ATS types ───────────────────────────────────────────────

export interface AtsBreakdown {
  total: number;
  content: number;
  ats: number;
  section: number;
  impact: number;
  appReady: number;
}

export interface JobMatchResult {
  score: number;
  matched: string[];
  missing: string[];
}

// ── Auth types ───────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
