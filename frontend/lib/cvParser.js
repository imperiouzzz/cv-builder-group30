/**
 * CV Text Parser
 * ─────────────────────────────────────────────────────────────
 * Parses plain text from an uploaded file or paste into a CVData
 * object. Handles the common Ghanaian/KNUST CV format as well as
 * general international CV formats.
 *
 * Exported as a pure function — no DOM access, safe for SSR.
 */

import { emptyCV } from '@/store/cvStore';

// ── Section heading keyword map ──────────────────────────────
const SECTION_MAP = [{
  key: 'summary',
  re: /\b(summary|profile|objective|about me|personal statement|career objective)\b/i
}, {
  key: 'education',
  re: /\b(education|academic|qualifications?|degrees?|schooling)\b/i
}, {
  key: 'work',
  re: /\b(work experience|work history|employment|professional experience|internship experience)\b|^experience$/i
}, {
  key: 'leadership',
  re: /\b(leadership)\b/i
}, {
  key: 'volunteering',
  re: /\b(volunteer|voluntary|extra.?curricular|extracurricular|community|activities)\b/i
}, {
  key: 'skills',
  re: /\b(skills?|abilities|competenc|expertise|technologies|proficiencies)\b/i
}, {
  key: 'projects',
  re: /\b(projects?|research|portfolio)\b/i
}, {
  key: 'references',
  re: /\b(references?|referees?)\b/i
}, {
  key: 'custom',
  re: /\b(awards?|certifications?|publications?|achievements?|honours?|hobbies|interests?|memberships?)\b/i
}];
function classifyHeading(line) {
  if (!line || line.length < 2 || line.length > 80) return null;
  const isAllCaps = /^[A-Z][A-Z\s\/\-&\.]{1,}$/.test(line);
  const isTitleish = /^[A-Z][a-zA-Z\s\/\-&]{2,}$/.test(line) && !/[,\.\!\?;:]/.test(line) && line.split(/\s+/).length <= 6;
  if (!isAllCaps && !isTitleish) return null;
  for (const {
    key,
    re
  } of SECTION_MAP) {
    if (re.test(line)) return key;
  }
  return null;
}

// ── Date extraction ──────────────────────────────────────────
const MONTH = '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const DATE_RANGE_RE = new RegExp(`(${MONTH}\\s+\\d{4})\\s*[\\-–—to]+\\s*((${MONTH}\\s+\\d{4})|present|current|now|\\d{4})`, 'i');
const YEAR_RANGE_RE = /\b((?:19|20)\d{2})\s*[\-–—to]+\s*((?:19|20)\d{2}|present|current|now)\b/i;
const SINGLE_MONTH_RE = new RegExp(`\\b(${MONTH}\\s+\\d{4})`, 'i');
const SINGLE_YEAR_RE = /\b((?:19|20)\d{2})\b/;
function extractDates(block) {
  const r = DATE_RANGE_RE.exec(block);
  if (r) return {
    start: toTitleDate(r[1]),
    end: /^(present|current|now)$/i.test(r[2]) ? 'Present' : toTitleDate(r[2])
  };
  const y = YEAR_RANGE_RE.exec(block);
  if (y) return {
    start: y[1],
    end: /^(present|current|now)$/i.test(y[2]) ? 'Present' : y[2]
  };
  const m = SINGLE_MONTH_RE.exec(block);
  if (m) return {
    start: toTitleDate(m[1]),
    end: ''
  };
  const s = SINGLE_YEAR_RE.exec(block);
  if (s) return {
    start: s[1],
    end: ''
  };
  return {
    start: '',
    end: ''
  };
}

// ── String helpers ───────────────────────────────────────────
function toTitleDate(s) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}
function toProperName(s) {
  return s.split(/\s+/).map(w => w.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('-')).join(' ');
}
function clean(s) {
  return String(s || '').replace(/\s+/g, ' ').replace(/^[\s|\-•*–—]+|[\s|\-•*–—]+$/g, '').trim();
}
function uid() {
  return Math.random().toString(36).slice(2);
}

// ── Split helpers ────────────────────────────────────────────
function splitByPredicate(lines, pred) {
  if (!lines.length) return [];
  const result = [];
  let buf = [lines[0]];
  for (let i = 1; i < lines.length; i++) {
    if (pred(lines[i], i)) {
      if (buf.length) result.push([...buf]);
      buf = [];
    }
    buf.push(lines[i]);
  }
  if (buf.length) result.push(buf);
  return result;
}
function splitByBlankLines(lines) {
  const result = [];
  let buf = [];
  lines.forEach(l => {
    if (!l.length && buf.length) {
      result.push([...buf]);
      buf = [];
    } else if (l.length) buf.push(l);
  });
  if (buf.length) result.push(buf);
  return result.length ? result : [lines];
}

// ── Main parser ───────────────────────────────────────────────

export function parseCV(raw) {
  const cv = emptyCV();
  const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, '');
  const lines = text.split('\n').map(l => l.trim());
  const nonEmpty = lines.filter(l => l.length > 0);
  const fullText = lines.join('\n');

  // ── 1. Contact info ────────────────────────────────────────
  const emailM = fullText.match(/[\w.+\-]+@[\w\-]+\.[a-zA-Z]{2,6}/);
  if (emailM) cv.email = emailM[0];
  const phoneM = fullText.match(/(?<!\d)(\+?[\d][\d\s\-\.\(\)]{6,17}[\d])(?!\d)/);
  if (phoneM) {
    const digits = phoneM[1].replace(/\D/g, '');
    if (digits.length >= 7 && digits.length <= 15) cv.phone = phoneM[1].trim();
  }
  const liM = fullText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([\w\d\-]+)/i);
  if (liM) cv.linkedin = 'https://linkedin.com/in/' + liM[1];
  const ghM = fullText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([\w\d\-]+)/i);
  if (ghM) cv.github = 'https://github.com/' + ghM[1];

  // ── 2. Name ────────────────────────────────────────────────
  const SKIP_NAME = /^(summary|profile|objective|education|experience|skills|contact|references|projects|about|cv\b|resume)/i;
  const nameLine = nonEmpty.slice(0, 8).find(l => {
    if (l.length < 4 || l.length > 70 || /[@\d\/\\<>]/.test(l) || SKIP_NAME.test(l)) return false;
    const words = l.split(/\s+/);
    if (words.length < 2 || words.length > 5) return false;
    return words.every(w => w.split('-').every(p => /^[A-Z][a-z'\.]*$/.test(p) || /^[A-Z]{2,}$/.test(p)));
  });
  if (nameLine) cv.fullName = toProperName(nameLine);

  // ── 3. Section buckets ────────────────────────────────────
  const sections = {
    header: []
  };
  let curSec = 'header';
  for (const line of lines) {
    const h = classifyHeading(line);
    if (h !== null) {
      curSec = h;
      sections[curSec] = sections[curSec] || [];
    } else {
      sections[curSec] = sections[curSec] || [];
      sections[curSec].push(line);
    }
  }

  // ── 4. Summary ────────────────────────────────────────────
  const sumSrc = sections.summary || [];
  const sumLines = sumSrc.filter(l => l.length > 15);
  if (sumLines.length) cv.summary = sumLines.join(' ').replace(/\s+/g, ' ').trim().substring(0, 500);
  if (!cv.summary) {
    const prose = (sections.header || []).filter(l => l.length > 60 && /[a-z]/.test(l) && !/@/.test(l));
    if (prose.length) cv.summary = prose.join(' ').replace(/\s+/g, ' ').trim().substring(0, 500);
  }

  // ── 5. Education ──────────────────────────────────────────
  const DEGREE_RE = /\b(ph\.?d|d\.?sc|m\.?sc?|m\.?phil|b\.?sc?|b\.?a\.?|m\.?a\.?|m\.?ba|hnd|b\.?eng?|b\.?tech|diploma|certificate|associate|bachelor|master|doctor|wassce|w\.a\.s\.s\.c\.e|sssce)\b/i;
  const INST_RE = /\b(university|college|school|institute|polytechnic|knust|ug\b|ucc|uew|uhas|academy)\b/i;
  if (sections.education) {
    const eduLines = sections.education.filter(l => l.length > 2);
    const entries = splitByPredicate(eduLines, (l, i) => i > 0 && (DEGREE_RE.test(l) || l.length === 0));
    entries.forEach(entry => {
      const nb = entry.filter(l => l.length > 0);
      const block = nb.join('\n');
      const edu = {
        id: uid(),
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        achievements: ''
      };
      const degM = block.match(new RegExp(DEGREE_RE.source + '[^\\n]*', 'i'));
      if (degM) edu.degree = clean(degM[0]);
      const instM = block.match(new RegExp(INST_RE.source + '[^\\n]*', 'i'));
      if (instM) edu.institution = clean(instM[0]);
      const locM = block.match(/\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?),\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/);
      if (locM && locM[0].length < 60 && !/university|school|college|science|technology/i.test(locM[0])) {
        edu.location = locM[0].trim();
      }
      if (/expected\s+to\s+(graduate|finish|complete)/i.test(block)) {
        const cleaned = block.replace(/expected\s+to\s+graduate\s*/i, '');
        const d = extractDates(cleaned);
        edu.startDate = '';
        edu.endDate = d.start || d.end || '';
        const startLines = nb.filter(l => /\d{4}/.test(l) && !/expected/i.test(l));
        if (startLines.length) {
          const ds = extractDates(startLines.join('\n'));
          if (ds.start) edu.startDate = ds.start;
        }
      } else {
        const d = extractDates(block);
        edu.startDate = d.start;
        edu.endDate = d.end;
      }
      const gpaM = block.match(/(?:gpa|cgpa|grade|class)[:\s]*([\d.]+\s*\/\s*[\d.]+|first class|second class upper|second class lower|third class|distinction|merit|pass)/i);
      if (gpaM) edu.gpa = clean(gpaM[1]);
      const achM = block.match(/(dean'?s list|best student|award|honour|distinction|scholarship)[^\n]*/i);
      if (achM) edu.achievements = clean(achM[0]);
      if (edu.degree || edu.institution) cv.education.push(edu);
    });
  }

  // ── 6. Work experience ────────────────────────────────────
  const TITLE_WORDS = /\b(engineer|developer|analyst|manager|designer|officer|intern|director|consultant|coordinator|specialist|associate|lead|head|executive|assistant|technician|administrator|accountant|researcher|programmer|architect|scientist)\b/i;
  const DATE_ONLY = /^[\w\s–\-,]+\d{4}[\w\s–\-,]*$/;
  if (sections.work) {
    const workLines = sections.work.filter(l => l.length > 0);
    const isJobHeader = l => /\|/.test(l) && TITLE_WORDS.test(l) || TITLE_WORDS.test(l) && l.length < 100 && !l.startsWith('•') && !l.startsWith('-') && !/^(key responsibilities)/i.test(l);
    const entries = splitByPredicate(workLines, (l, i) => i > 0 && isJobHeader(l));
    entries.forEach(entry => {
      const nb = entry.filter(l => l.length > 0);
      if (!nb.length) return;
      const block = nb.join('\n');
      const job = {
        id: uid(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      };
      if (/\|/.test(nb[0])) {
        const pipeIdx = nb[0].indexOf('|');
        job.title = clean(nb[0].substring(0, pipeIdx));
        job.company = clean(nb[0].substring(pipeIdx + 1)).replace(/^\s*,\s*|\s*,\s*$/g, '').trim();
      } else if (/\s+at\s+/i.test(nb[0])) {
        const m = nb[0].match(/^(.+?)\s+at\s+(.+)$/i);
        if (m) {
          job.title = clean(m[1]);
          job.company = clean(m[2]);
        }
      } else {
        job.title = clean(nb[0]).substring(0, 80);
        const next = nb.find((l, i) => i > 0 && !extractDates(l).start && l.length > 2 && !l.startsWith('•'));
        if (next) job.company = clean(next).substring(0, 80);
      }
      const d = extractDates(block);
      job.startDate = d.start;
      job.endDate = d.end;
      const locM = block.match(/\b([A-Z][a-zA-Z\s]+),\s*([A-Z][a-zA-Z\s]+(?:Ghana|Nigeria|Region|UK|US|USA|Africa)?)/);
      if (locM && locM[0].length < 50) job.location = locM[0].trim();
      const bullets = nb.filter(l => /^[•\-*>–]/.test(l) || l.length > 40 && !isJobHeader(l) && !DATE_ONLY.test(l) && !/^(key responsibilities|at bsystems|during my|this experience|this internship)/i.test(l)).slice(0, 12).map(l => l.replace(/^[•\-*>–]\s*/, '• '));
      if (bullets.length) job.description = bullets.join('\n').substring(0, 1000);
      if (job.title || job.company) cv.workExp.push(job);
    });
  }

  // ── 7. Skills ─────────────────────────────────────────────
  if (sections.skills) {
    const skillLines = sections.skills.filter(l => l.length > 1);
    skillLines.forEach(line => {
      const stripped = line.replace(/^[•\-*>\s]+/, '').trim();
      if (!stripped) return;
      const dashIdx = stripped.search(/\s*[–—]\s*/);
      const skillName = dashIdx > 0 ? stripped.substring(0, dashIdx).trim() : stripped;
      if (skillName.length < 2 || skillName.length > 50) return;
      if (/^(technical|soft|skills?|abilities|hard skills)/i.test(skillName)) return;
      const final = skillName.replace(/\s*\(.*?\)/, '').trim();
      if (final.length >= 2 && /[a-zA-Z]/.test(final) && !cv.skills.find(s => s.name === final)) {
        cv.skills.push({
          id: uid(),
          name: final,
          category: 'technical'
        });
      }
    });
    if (!cv.skills.length) {
      skillLines.join(', ').split(/[,\n]+/).map(s => s.replace(/^[•\-*\s]+/, '').trim()).forEach(s => {
        if (s.length >= 2 && s.length <= 50 && /[a-zA-Z]/.test(s)) {
          cv.skills.push({
            id: uid(),
            name: s,
            category: 'technical'
          });
        }
      });
    }
  }

  // ── 8. Projects ───────────────────────────────────────────
  if (sections.projects) {
    const projLines = sections.projects.filter(l => l.length > 2);
    splitByBlankLines(projLines).forEach(entry => {
      const block = entry.join('\n');
      const proj = {
        id: uid(),
        name: '',
        tech: '',
        period: '',
        description: '',
        link: ''
      };
      proj.name = clean(entry[0] || '').substring(0, 80);
      const techM = block.match(/(?:tech|stack|built with|tools?|using)[:\s]*([^\n]+)/i);
      if (techM) proj.tech = clean(techM[1]).substring(0, 120);
      const parenM = proj.name.match(/\(([^)]+)\)/);
      if (parenM && !proj.tech) proj.tech = parenM[1];
      const linkM = block.match(/https?:\/\/[\w.\-/?=&%]+/);
      if (linkM) proj.link = linkM[0];
      const d = extractDates(block);
      if (d.start) proj.period = d.start + (d.end ? ' – ' + d.end : '');
      const desc = entry.slice(1).filter(l => l.length > 10).slice(0, 5);
      if (desc.length) proj.description = desc.join(' ').substring(0, 400);
      if (proj.name && proj.name.length > 2) cv.projects.push(proj);
    });
  }

  // ── 9. Volunteering + Leadership ─────────────────────────
  const volSrc = [...(sections.volunteering || []), ...(sections.leadership || [])];
  if (volSrc.some(l => l.length > 3)) {
    const volLines = volSrc.filter(l => l.length > 0);
    splitByPredicate(volLines, (l, i) => i > 0 && !l.startsWith('•') && !l.startsWith('-') && l.length > 3 && l.length < 100 && !/^(key responsibilities)/i.test(l)).forEach(entry => {
      const nb = entry.filter(l => l.length > 0);
      if (!nb.length) return;
      const block = nb.join('\n');
      const vol = {
        id: uid(),
        role: '',
        org: '',
        period: '',
        desc: ''
      };
      if (/[–—\-]/.test(nb[0])) {
        const parts = nb[0].split(/\s*[–—\-]\s*/);
        vol.org = clean(parts[0]).substring(0, 80);
        vol.role = clean(parts[parts.length - 1]).substring(0, 60);
      } else {
        vol.org = clean(nb[0]).substring(0, 80);
        const roleLine = nb.find((l, i) => i > 0 && !l.startsWith('•') && l.length < 60);
        if (roleLine) vol.role = clean(roleLine).substring(0, 60);
      }
      const d = extractDates(block);
      if (d.start) vol.period = d.start + (d.end ? ' – ' + d.end : '');
      const bullets = nb.filter(l => /^[•\-*]/.test(l)).slice(0, 4);
      if (bullets.length) vol.desc = bullets.map(l => l.replace(/^[•\-*]\s*/, '')).join(' ').substring(0, 300);
      if (vol.org || vol.role) cv.volunteering.push(vol);
    });
  }

  // ── 10. References ────────────────────────────────────────
  if (sections.references) {
    const refLines = sections.references.filter(l => l.length > 1);
    if (!/available on request|upon request/i.test(refLines.join(' '))) {
      const JOB_WORDS = /\b(administrator|developer|engineer|manager|director|professor|lecturer|analyst|officer|head|ceo|cto|consultant|limited|ltd|inc|corp|bank|school|university)\b/i;
      function isPersonName(l) {
        if (!/^([A-Z][a-zA-Z'\-]+)\s+([A-Z][a-zA-Z'\-]+)$/.test(l)) return false;
        if (/[\/\d]/.test(l)) return false;
        const words = l.split(/\s+/);
        if (words.length !== 2) return false;
        return words.filter(w => JOB_WORDS.test(w)).length < 2;
      }
      const refEntries = splitByPredicate(refLines, (l, i) => i > 0 && isPersonName(l));
      const finalEntries = refEntries.length > 1 ? refEntries : splitByBlankLines(refLines);
      finalEntries.forEach(entry => {
        const nb = entry.filter(l => l.length > 1);
        if (!nb.length) return;
        const block = nb.join('\n');
        const ref = {
          id: uid(),
          name: '',
          title: '',
          org: '',
          email: '',
          phone: ''
        };
        ref.name = clean(nb.find(l => isPersonName(l)) || nb[0]).substring(0, 60);
        const titM = block.match(/\b(administrator|developer|engineer|manager|director|professor|lecturer|ceo|cto|analyst|officer|head|consultant)\b[^\n]*/i);
        if (titM) ref.title = clean(titM[0]).replace(/\s*--\s*/g, ' — ').substring(0, 80);
        const orgLine = nb.find(l => l !== ref.name && !ref.title.includes(l.substring(0, 10)) && !/^\+?\d/.test(l) && !/@/.test(l) && l.length > 3);
        if (orgLine) ref.org = clean(orgLine).substring(0, 80);
        const eM = block.match(/[\w.+\-]+@[\w\-]+\.[a-zA-Z]{2,6}/);
        if (eM) ref.email = eM[0];
        const pM = block.match(/(?<!\w)(\+?\d[\d\s\-\.]{6,15}\d)(?!\w)/);
        if (pM) {
          const d = pM[1].replace(/\D/g, '');
          if (d.length >= 7) ref.phone = pM[1].trim();
        }
        if (ref.name.length > 2) cv.references.push(ref);
      });
    }
  }

  // ── 11. Custom sections ───────────────────────────────────
  if (sections.custom?.some(l => l.length > 2)) {
    cv.customSections.push({
      id: uid(),
      sectionTitle: 'Certifications & Awards',
      entries: sections.custom.filter(l => l.length > 2).join('\n').substring(0, 600)
    });
  }

  // ── Build filled summary ──────────────────────────────────
  const filled = [];
  if (cv.fullName) filled.push('Name');
  if (cv.email) filled.push('Email');
  if (cv.phone) filled.push('Phone');
  if (cv.linkedin) filled.push('LinkedIn');
  if (cv.summary) filled.push('Summary');
  if (cv.education.length) filled.push(`Education (${cv.education.length})`);
  if (cv.workExp.length) filled.push(`Work (${cv.workExp.length})`);
  if (cv.skills.length) filled.push(`Skills (${cv.skills.length})`);
  if (cv.projects.length) filled.push(`Projects (${cv.projects.length})`);
  if (cv.volunteering.length) filled.push(`Volunteering (${cv.volunteering.length})`);
  if (cv.references.length) filled.push(`References (${cv.references.length})`);
  return {
    data: cv,
    filled
  };
}