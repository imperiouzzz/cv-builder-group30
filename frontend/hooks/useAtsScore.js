import { useEffect } from 'react';
import { useCVStore } from '@/store/cvStore';

// ── Local ATS scoring (mirrors backend service) ───────────────
const ACTION_VERBS = new Set(['achieved', 'analysed', 'analyzed', 'architected', 'automated', 'built', 'collaborated', 'configured', 'contributed', 'coordinated', 'created', 'debugged', 'delivered', 'deployed', 'designed', 'developed', 'directed', 'enhanced', 'established', 'executed', 'facilitated', 'generated', 'grew', 'implemented', 'improved', 'increased', 'initiated', 'integrated', 'launched', 'led', 'maintained', 'managed', 'mentored', 'migrated', 'optimised', 'optimized', 'organised', 'organized', 'oversaw', 'performed', 'planned', 'produced', 'provided', 'reduced', 'refactored', 'resolved', 'reviewed', 'scaled', 'secured', 'spearheaded', 'streamlined', 'supervised', 'tested', 'trained', 'transformed', 'troubleshot', 'upgraded', 'validated']);
const QUANT_RE = /\d+\s*(%|x\b|k\b|\$|ghs|\+|years?|months?|members?|engineers?|hours?|projects?|records?)/i;
export function computeLocalScore(cv) {
  let content = 0,
    ats = 0,
    section = 0,
    impact = 0,
    appReady = 0;
  if (cv.fullName) content += 8;
  if (cv.email) content += 5;
  if (cv.jobTitle) content += 4;
  const sumLen = cv.summary.length;
  if (sumLen > 30) content += 3;
  if (sumLen > 100) content += 5;
  if (sumLen > 250) content += 5;
  if (cv.education.length) content += 5;
  const richEdu = cv.education.filter(e => e.degree && e.institution).length;
  if (richEdu > 0) content += 5;
  if (cv.fullName) ats += 5;
  if (cv.email) ats += 5;
  if (cv.jobTitle) ats += 5;
  if (cv.skills.length >= 3) ats += 5;
  if (cv.skills.length >= 8) ats += 5;
  if (cv.summary.length > 20) section += 4;
  if (cv.education.length) section += 4;
  if (cv.workExp.length) section += 6;
  if (cv.skills.length) section += 4;
  if (cv.projects.length) section += 2;
  const allDesc = [...cv.workExp.map(w => w.description), ...cv.projects.map(p => p.description), cv.summary].join(' ').toLowerCase();
  const words = allDesc.split(/\W+/);
  const verbHits = words.filter(w => ACTION_VERBS.has(w)).length;
  const quantHits = (allDesc.match(QUANT_RE) || []).length;
  if (verbHits >= 3) impact += 5;
  if (verbHits >= 8) impact += 5;
  if (quantHits >= 1) impact += 5;
  if (cv.phone) appReady += 2;
  if (cv.linkedin) appReady += 2;
  if (cv.github) appReady += 1;
  const total = Math.min(Math.min(content, 35) + Math.min(ats, 25) + Math.min(section, 20) + Math.min(impact, 15) + Math.min(appReady, 5), 100);
  return {
    total,
    content: Math.min(content, 35),
    ats: Math.min(ats, 25),
    section: Math.min(section, 20),
    impact: Math.min(impact, 15),
    appReady: Math.min(appReady, 5)
  };
}

/**
 * Subscribes to cv changes and updates the ATS breakdown in the store.
 * Call once at the builder layout level.
 */
export function useAtsScore() {
  const {
    cv,
    setBreakdown
  } = useCVStore();
  useEffect(() => {
    const breakdown = computeLocalScore(cv);
    setBreakdown(breakdown);
  }, [cv, setBreakdown]);
}