/**
 * ATS Scoring Service
 * ─────────────────────────────────────────────────────────────
 * Scores a CV object out of 100 across 5 weighted categories:
 *
 *  Category              Weight  What's measured
 *  ──────────────────────────────────────────────────────────
 *  Content Quality         35    Has name, email, title, summary depth
 *  ATS & Structure         25    Contact completeness, no tables/graphics
 *  Section Completeness    20    Which sections are filled in
 *  Impact Language         15    Action verbs & quantified achievements
 *  Application Ready        5    LinkedIn, GitHub, phone present
 */

// Common strong action verbs rewarded by ATS systems
const ACTION_VERBS = new Set([
  'achieved','analysed','analyzed','architected','automated','built',
  'collaborated','configured','contributed','coordinated','created',
  'debugged','delivered','deployed','designed','developed','directed',
  'enhanced','established','evaluated','executed','facilitated',
  'generated','grew','implemented','improved','increased','initiated',
  'integrated','launched','led','maintained','managed','mentored',
  'migrated','optimised','optimized','organised','organized',
  'oversaw','performed','planned','presented','produced','provided',
  'reduced','refactored','researched','resolved','reviewed','scaled',
  'secured','spearheaded','streamlined','supervised','tested','trained',
  'transformed','troubleshot','upgraded','validated','worked',
]);

// Quantification pattern: "40%", "3 years", "$5k", "team of 5", etc.
const QUANT_RE = /\d+\s*(%|x\b|k\b|\$|usd|ghs|\+|years?|months?|members?|engineers?|hours?|days?|projects?|clients?|records?)/i;

/**
 * @param {Object} cv  — matches the shape sent from the frontend / stored in DB
 * @returns {number}   — integer 0-100
 */
function computeAtsScore(cv) {
  const {
    fullName = '', jobTitle = '', email = '', phone = '',
    linkedin = '', github = '',
    summary = '',
    education = [], workExp = [], skills = [],
    projects = [], volunteering = [], references = [],
  } = cv;

  let content = 0;   // /35
  let ats     = 0;   // /25
  let section = 0;   // /20
  let impact  = 0;   // /15
  let appReady = 0;  // /5

  // ── Content Quality (35) ────────────────────────────────────
  if (fullName.trim())           content += 8;
  if (email.trim())              content += 5;
  if (jobTitle.trim())           content += 4;
  const sumLen = summary.trim().length;
  if (sumLen > 30)               content += 3;
  if (sumLen > 100)              content += 5;   // good length
  if (sumLen > 250)              content += 5;   // comprehensive
  if (education.length > 0)      content += 5;
  // Check education has detail
  const richEdu = education.filter(e => e.degree && e.institution).length;
  if (richEdu > 0)               content += 5;  // max 35 total possible but capped below

  // ── ATS & Structure (25) ────────────────────────────────────
  if (fullName.trim())           ats += 5;
  if (email.trim())              ats += 5;
  if (jobTitle.trim())           ats += 5;
  if (skills.length >= 3)        ats += 5;
  if (skills.length >= 8)        ats += 5;

  // ── Section Completeness (20) ───────────────────────────────
  if (summary.trim().length > 20) section += 4;
  if (education.length > 0)       section += 4;
  if (workExp.length > 0)         section += 6;
  if (skills.length > 0)          section += 4;
  if (projects.length > 0)        section += 2;

  // ── Impact Language (15) ────────────────────────────────────
  // Check all description fields for action verbs + quantification
  const allDesc = [
    ...workExp.map(w => w.description || ''),
    ...projects.map(p => p.description || p.desc || ''),
    summary,
  ].join(' ').toLowerCase();

  const words   = allDesc.split(/\W+/);
  const verbHits = words.filter(w => ACTION_VERBS.has(w)).length;
  const quantHits = (allDesc.match(QUANT_RE) || []).length;

  if (verbHits >= 3)  impact += 5;
  if (verbHits >= 8)  impact += 5;
  if (quantHits >= 1) impact += 5;

  // ── Application Ready (5) ───────────────────────────────────
  if (phone.trim())    appReady += 2;
  if (linkedin.trim()) appReady += 2;
  if (github.trim())   appReady += 1;

  // ── Cap each category and sum ────────────────────────────────
  const total =
    Math.min(content, 35) +
    Math.min(ats,     25) +
    Math.min(section, 20) +
    Math.min(impact,  15) +
    Math.min(appReady, 5);

  return Math.min(Math.round(total), 100);
}

/**
 * Job description keyword match.
 * Returns a score 0-100 and lists matched + missing keywords.
 *
 * @param {Object} cv
 * @param {string} jobDescription
 * @returns {{ score: number, matched: string[], missing: string[] }}
 */
function matchJobDescription(cv, jobDescription) {
  const cvText = [
    cv.summary || '',
    cv.jobTitle || '',
    (cv.skills || []).map(s => s.name || s).join(' '),
    (cv.workExp || []).map(w => `${w.title} ${w.description}`).join(' '),
    (cv.projects || []).map(p => `${p.name} ${p.tech} ${p.description || p.desc}`).join(' '),
    (cv.education || []).map(e => e.degree).join(' '),
  ].join(' ').toLowerCase();

  // Extract meaningful words from JD (length > 3, not stop words)
  const STOP_WORDS = new Set(['that','with','this','have','from','they','will','your','been','were','their','there','would','could','which','about','should','other','these','those','after','before','where','while','through','between','during','against','within','without','around']);
  const jdWords = jobDescription
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));

  const uniqueJdWords = [...new Set(jdWords)];
  const matched = uniqueJdWords.filter(w => cvText.includes(w));
  const missing = uniqueJdWords.filter(w => !cvText.includes(w)).slice(0, 10);

  const score = uniqueJdWords.length > 0
    ? Math.min(100, Math.round((matched.length / uniqueJdWords.length) * 100 + 10))
    : 0;

  return { score, matched: matched.slice(0, 20), missing };
}

module.exports = { computeAtsScore, matchJobDescription };
