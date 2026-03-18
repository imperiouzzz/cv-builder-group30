import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CVData, User, AtsBreakdown } from '@/types/cv.types';

// ── Default empty CV ────────────────────────────────────────
export const emptyCV = (): CVData => ({
  title: 'My CV',
  template: 'classic',
  font: 'sans',
  atsScore: 0,
  fullName: '', jobTitle: '', email: '', phone: '',
  linkedin: '', github: '', summary: '',
  education: [], workExp: [], skills: [],
  projects: [], volunteering: [], references: [], customSections: [],
  sectionOrder: ['summary','education','work','projects','volunteering','skills','references'],
});

// ── Auth slice ───────────────────────────────────────────────
interface AuthSlice {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

// ── CV slice ─────────────────────────────────────────────────
interface CVSlice {
  cv: CVData;
  isDirty: boolean;
  isSaving: boolean;
  currentStep: number;
  setCVField: <K extends keyof CVData>(key: K, value: CVData[K]) => void;
  setCV: (cv: CVData) => void;
  resetCV: () => void;
  setCurrentStep: (step: number) => void;
  setIsSaving: (saving: boolean) => void;
}

// ── ATS slice ────────────────────────────────────────────────
interface ATSSlice {
  mode: 'quality' | 'match';
  breakdown: AtsBreakdown;
  matchScore: number | null;
  missingKeywords: string[];
  setMode: (mode: 'quality' | 'match') => void;
  setBreakdown: (b: AtsBreakdown) => void;
  setMatchResult: (score: number, missing: string[]) => void;
}

// ── Combined store ───────────────────────────────────────────
type Store = AuthSlice & CVSlice & ATSSlice;

export const useCVStore = create<Store>()(
  persist(
    (set) => ({
      // ── Auth ──
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null, cv: emptyCV() }),

      // ── CV ──
      cv: emptyCV(),
      isDirty: false,
      isSaving: false,
      currentStep: 0,

      setCVField: (key, value) =>
        set((state) => ({ cv: { ...state.cv, [key]: value }, isDirty: true })),

      setCV: (cv) => set({ cv, isDirty: false }),

      resetCV: () => set({ cv: emptyCV(), isDirty: false, currentStep: 0 }),

      setCurrentStep: (step) => set({ currentStep: step }),

      setIsSaving: (saving) => set({ isSaving: saving }),

      // ── ATS ──
      mode: 'quality',
      breakdown: { total: 10, content: 0, ats: 10, section: 0, impact: 0, appReady: 0 },
      matchScore: null,
      missingKeywords: [],
      setMode: (mode) => set({ mode }),
      setBreakdown: (breakdown) => set({ breakdown }),
      setMatchResult: (score, missing) => set({ matchScore: score, missingKeywords: missing }),
    }),
    {
      name: 'cv-builder-store',
      // Only persist auth + draft CV (not UI state)
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        cv: state.cv,
      }),
    }
  )
);
