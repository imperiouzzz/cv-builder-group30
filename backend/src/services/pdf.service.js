/**
 * PDF Generation Service — Puppeteer
 * Renders the CV as HTML and returns a text-selectable PDF buffer.
 */

const puppeteer = require("puppeteer");

async function generateCVPdf(cv) {
  const html = buildHtml(cv);

  const browser = await puppeteer.launch({
    headless: true, // works across all Puppeteer versions including v23+
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu", // needed on some Windows setups
      "--disable-extensions",
    ],
  });

  try {
    const page = await browser.newPage();

    // Set viewport to A4 width at 96dpi
    await page.setViewport({ width: 794, height: 1123 });

    // Load content and wait for everything to render
    await page.setContent(html, { waitUntil: "load" });

    // Small delay so fonts finish loading
    await new Promise((r) => setTimeout(r, 300));

    const pdfResult = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", right: "0", bottom: "15mm", left: "0" },
    });

    // Puppeteer v22+ returns Uint8Array — convert to Node.js Buffer
    // so Express Content-Length and res.send() work correctly
    return Buffer.from(pdfResult);
  } finally {
    await browser.close();
  }
}

// ── HTML template ─────────────────────────────────────────────
function buildHtml(cv) {
  const isModern = cv.template === "modern";

  const headerBg = isModern
    ? "background: linear-gradient(135deg, #1A1A2E, #E53E3E);"
    : "background: #1A1A2E;";

  const sectionTitleStyle = isModern
    ? "border-bottom: 2px solid #E53E3E; color: #1A1A2E;"
    : "border-bottom: 1px solid #E2E8F0; color: #E53E3E;";

  const esc = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const section = (title, content) => `
    <div class="cv-section">
      <div class="section-title">${title}</div>
      ${content}
    </div>`;

  let body = "";

  if (cv.summary) {
    body += section(
      "Professional Summary",
      `<p class="summary">${esc(cv.summary)}</p>`,
    );
  }

  if (cv.education?.length) {
    body += section(
      "Education",
      cv.education
        .map(
          (e) => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${esc(e.degree)}</span>
          <span class="entry-date">${esc(e.startDate)}${e.endDate ? " \u2013 " + esc(e.endDate) : ""}</span>
        </div>
        <div class="entry-sub">${esc(e.institution)}${e.location ? ", " + esc(e.location) : ""}</div>
        ${e.gpa ? `<div class="entry-detail">GPA: ${esc(e.gpa)}</div>` : ""}
        ${e.achievements ? `<div class="entry-detail">${esc(e.achievements)}</div>` : ""}
      </div>`,
        )
        .join(""),
    );
  }

  if (cv.workExp?.length) {
    body += section(
      "Work Experience",
      cv.workExp
        .map(
          (e) => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${esc(e.title)}</span>
          <span class="entry-date">${esc(e.startDate)}${e.endDate ? " \u2013 " + esc(e.endDate) : ""}</span>
        </div>
        <div class="entry-sub">${esc(e.company)}${e.location ? ", " + esc(e.location) : ""}</div>
        ${e.description ? `<div class="entry-detail">${esc(e.description).replace(/\n/g, "<br>")}</div>` : ""}
      </div>`,
        )
        .join(""),
    );
  }

  if (cv.projects?.length) {
    body += section(
      "Projects &amp; Research",
      cv.projects
        .map(
          (e) => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${esc(e.name)}</span>
          <span class="entry-date">${esc(e.period)}</span>
        </div>
        ${e.tech ? `<div class="entry-sub">${esc(e.tech)}</div>` : ""}
        ${e.description ? `<div class="entry-detail">${esc(e.description)}</div>` : ""}
      </div>`,
        )
        .join(""),
    );
  }

  if (cv.volunteering?.length) {
    body += section(
      "Volunteering",
      cv.volunteering
        .map(
          (e) => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${esc(e.role)}</span>
          <span class="entry-date">${esc(e.period)}</span>
        </div>
        <div class="entry-sub">${esc(e.org)}</div>
        ${e.desc ? `<div class="entry-detail">${esc(e.desc)}</div>` : ""}
      </div>`,
        )
        .join(""),
    );
  }

  if (cv.skills?.length) {
    body += section(
      "Skills",
      `
      <div class="skills-grid">
        ${cv.skills.map((s) => `<span class="skill-pill">${esc(s.name)}</span>`).join("")}
      </div>`,
    );
  }

  if (cv.references?.length) {
    body += section(
      "References",
      cv.references
        .map(
          (e) => `
      <div class="entry">
        <div class="entry-title">${esc(e.name)}</div>
        <div class="entry-sub">${esc(e.title)}${e.org ? ", " + esc(e.org) : ""}</div>
        ${e.email ? `<div class="entry-detail">\u2709 ${esc(e.email)}</div>` : ""}
        ${e.phone ? `<div class="entry-detail">\u260e ${esc(e.phone)}</div>` : ""}
      </div>`,
        )
        .join(""),
    );
  }

  if (cv.customSections?.length) {
    cv.customSections.forEach((c) => {
      if (c.sectionTitle) {
        body += section(
          esc(c.sectionTitle),
          `<div class="entry-detail">${esc(c.entries)}</div>`,
        );
      }
    });
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(cv.fullName)} \u2014 CV</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #2D3748;
    font-size: 11pt;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .cv-header {
    ${headerBg}
    padding: 28px 36px 20px;
    color: white;
  }
  .cv-name {
    font-size: 24pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }
  .cv-role {
    font-size: 11pt;
    color: rgba(255,255,255,0.8);
    margin-bottom: 10px;
  }
  .cv-contact {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 9pt;
    color: rgba(255,255,255,0.7);
  }
  .cv-body { padding: 20px 36px; }
  .cv-section { margin-bottom: 18px; page-break-inside: avoid; }
  .section-title {
    font-size: 8.5pt;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding-bottom: 4px;
    margin-bottom: 10px;
    ${sectionTitleStyle}
  }
  .entry { margin-bottom: 10px; page-break-inside: avoid; }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .entry-title { font-weight: 600; font-size: 11pt; color: #1A1A2E; }
  .entry-date  { font-size: 9pt; color: #718096; white-space: nowrap; }
  .entry-sub   { font-size: 9.5pt; color: #718096; margin-bottom: 3px; }
  .entry-detail {
    font-size: 9.5pt;
    color: #2D3748;
    line-height: 1.6;
    white-space: pre-line;
    margin-top: 3px;
  }
  .summary {
    font-size: 10pt;
    color: #2D3748;
    line-height: 1.7;
  }
  .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-pill {
    padding: 3px 10px;
    background: #FFF5F5;
    color: #C53030;
    border-radius: 12px;
    font-size: 9pt;
    font-weight: 500;
    border: 1px solid #FEB2B2;
  }
</style>
</head>
<body>
  <div class="cv-header">
    <div class="cv-name">${esc(cv.fullName) || "YOUR NAME"}</div>
    ${cv.jobTitle ? `<div class="cv-role">${esc(cv.jobTitle)}</div>` : ""}
    <div class="cv-contact">
      ${cv.email ? `<span>\u2709 ${esc(cv.email)}</span>` : ""}
      ${cv.phone ? `<span>\u260e ${esc(cv.phone)}</span>` : ""}
      ${cv.linkedin ? `<span>in ${esc(cv.linkedin.replace("https://linkedin.com/in/", "").replace("https://www.linkedin.com/in/", ""))}</span>` : ""}
      ${cv.github ? `<span>\u2693 ${esc(cv.github.replace("https://github.com/", ""))}</span>` : ""}
    </div>
  </div>
  <div class="cv-body">${body}</div>
</body>
</html>`;
}

module.exports = { generateCVPdf };
