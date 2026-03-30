import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// ── Default empty CV ────────────────────────────────────────
export const emptyCV = () => ({
  title: 'My CV',
  template: 'classic',
  font: 'sans',
  atsScore: 0,
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  summary: '',
  education: [],
  workExp: [],
  skills: [],
  projects: [],
  volunteering: [],
  references: [],
  customSections: [],
  sectionOrder: ['summary', 'education', 'work', 'projects', 'volunteering', 'skills', 'references']
});

// ── Auth slice ───────────────────────────────────────────────

// ── CV slice ─────────────────────────────────────────────────

// ── ATS slice ────────────────────────────────────────────────

// ── Combined store ───────────────────────────────────────────

export const useCVStore = create()(persist(set => ({
  // ── Auth ──
  user: null,
  token: null,
  setAuth: (user, token) => set({
    user,
    token
  }),
  clearAuth: () => set({
    user: null,
    token: null,
    cv: emptyCV()
  }),
  // ── CV ──
  cv: emptyCV(),
  isDirty: false,
  isSaving: false,
  currentStep: 0,
  setCVField: (key, value) => set(state => ({
    cv: {
      ...state.cv,
      [key]: value
    },
    isDirty: true
  })),
  setCV: cv => set({
    cv,
    isDirty: false
  }),
  resetCV: () => set({
    cv: emptyCV(),
    isDirty: false,
    currentStep: 0
  }),
  setCurrentStep: step => set({
    currentStep: step
  }),
  setIsSaving: saving => set({
    isSaving: saving
  }),
  // ── ATS ──
  mode: 'quality',
  breakdown: {
    total: 10,
    content: 0,
    ats: 10,
    section: 0,
    impact: 0,
    appReady: 0
  },
  matchScore: null,
  missingKeywords: [],
  setMode: mode => set({
    mode
  }),
  setBreakdown: breakdown => set({
    breakdown
  }),
  setMatchResult: (score, missing) => set({
    matchScore: score,
    missingKeywords: missing
  })
}), {
  name: 'cv-builder-store',
  // Only persist auth + draft CV (not UI state)
  partialize: state => ({
    user: state.user,
    token: state.token,
    cv: state.cv
  })
}));