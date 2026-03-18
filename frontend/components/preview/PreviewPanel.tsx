"use client";

import { useCVStore } from "@/store/cvStore";
import type { SectionKey } from "@/types/cv.types";

const FONTS: Record<
  string,
  { bodyFamily: string; nameFamily: string; googleUrl: string }
> = {
  sans: {
    bodyFamily: "'DM Sans', Arial, sans-serif",
    nameFamily: "'Fraunces', serif",
    googleUrl:
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600&display=swap",
  },
  fraunces: {
    bodyFamily: "'Fraunces', Georgia, serif",
    nameFamily: "'Fraunces', Georgia, serif",
    googleUrl:
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap",
  },
  dm: {
    bodyFamily: "'DM Sans', Arial, sans-serif",
    nameFamily: "'DM Sans', Arial, sans-serif",
    googleUrl:
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap",
  },
};

const DEFAULT_ORDER: SectionKey[] = [
  "summary",
  "education",
  "work",
  "projects",
  "volunteering",
  "skills",
  "references",
  "custom",
];

function parseSectionOrder(raw: unknown): SectionKey[] {
  if (Array.isArray(raw) && raw.length > 0) return raw as SectionKey[];
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw);
      if (Array.isArray(p) && p.length > 0) return p as SectionKey[];
    } catch (_) {}
  }
  return DEFAULT_ORDER;
}

export default function PreviewPanel() {
  const { cv, setCVField } = useCVStore();

  const isModern = cv.template === "modern";
  const fontKey = cv.font || "sans";
  const font = FONTS[fontKey] ?? FONTS.sans;
  const order = parseSectionOrder(cv.sectionOrder);

  const esc = (s: string | undefined | null) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const sTitle = isModern
    ? `font-size:8px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#1A1A2E;border-bottom:2px solid #E53E3E;padding-bottom:3px;margin-bottom:6px;font-family:${font.bodyFamily}`
    : `font-size:8px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#E53E3E;border-bottom:1px solid #E2E8F0;padding-bottom:3px;margin-bottom:6px;font-family:${font.bodyFamily}`;

  const headerStyle = isModern
    ? "background:linear-gradient(135deg,#1A1A2E,#E53E3E);padding:14px 14px 10px;color:white"
    : "background:#1A1A2E;padding:14px 14px 10px;color:white";

  const bt = `font-family:${font.bodyFamily}`; // shorthand body-text style

  function sec(title: string, content: string) {
    return `<div style="margin-bottom:10px"><div style="${sTitle}">${title}</div>${content}</div>`;
  }

  // ── Section renderers keyed by SectionKey ──────────────────
  const renderSection: Record<SectionKey, () => string> = {
    summary: () =>
      cv.summary
        ? sec(
            "Professional Summary",
            `<div style="font-size:8px;color:#2D3748;line-height:1.6;font-style:italic;${bt}">${esc(cv.summary)}</div>`,
          )
        : "",

    education: () =>
      cv.education.length
        ? sec(
            "Education",
            cv.education
              .map(
                (e) => `
        <div style="margin-bottom:6px">
          <div style="display:flex;justify-content:space-between">
            <span style="font-weight:600;font-size:8.5px;color:#1A1A2E;${bt}">${esc(e.degree)}</span>
            <span style="font-size:7.5px;color:#718096;${bt}">${esc(e.startDate)}${e.endDate ? " – " + esc(e.endDate) : ""}</span>
          </div>
          <div style="font-size:8px;color:#718096;${bt}">${esc(e.institution)}${e.location ? ", " + esc(e.location) : ""}</div>
          ${e.gpa ? `<div style="font-size:7.5px;color:#2D3748;${bt}">GPA: ${esc(e.gpa)}</div>` : ""}
          ${e.achievements ? `<div style="font-size:7.5px;color:#2D3748;${bt}">${esc(e.achievements)}</div>` : ""}
        </div>`,
              )
              .join(""),
          )
        : "",

    work: () =>
      cv.workExp.length
        ? sec(
            "Work Experience",
            cv.workExp
              .map(
                (e) => `
        <div style="margin-bottom:6px">
          <div style="display:flex;justify-content:space-between">
            <span style="font-weight:600;font-size:8.5px;color:#1A1A2E;${bt}">${esc(e.title)}</span>
            <span style="font-size:7.5px;color:#718096;${bt}">${esc(e.startDate)}${e.endDate ? " – " + esc(e.endDate) : ""}</span>
          </div>
          <div style="font-size:8px;color:#718096;${bt}">${esc(e.company)}${e.location ? ", " + esc(e.location) : ""}</div>
          ${e.description ? `<div style="font-size:7.5px;color:#2D3748;line-height:1.5;white-space:pre-line;${bt}">${esc(e.description)}</div>` : ""}
        </div>`,
              )
              .join(""),
          )
        : "",

    projects: () =>
      cv.projects.length
        ? sec(
            "Projects &amp; Research",
            cv.projects
              .map(
                (e) => `
        <div style="margin-bottom:6px">
          <div style="display:flex;justify-content:space-between">
            <span style="font-weight:600;font-size:8.5px;color:#1A1A2E;${bt}">${esc(e.name)}</span>
            <span style="font-size:7.5px;color:#718096;${bt}">${esc(e.period)}</span>
          </div>
          ${e.tech ? `<div style="font-size:8px;color:#718096;${bt}">${esc(e.tech)}</div>` : ""}
          ${e.description ? `<div style="font-size:7.5px;color:#2D3748;${bt}">${esc(e.description)}</div>` : ""}
        </div>`,
              )
              .join(""),
          )
        : "",

    volunteering: () =>
      cv.volunteering.length
        ? sec(
            "Volunteering",
            cv.volunteering
              .map(
                (e) => `
        <div style="margin-bottom:6px">
          <div style="display:flex;justify-content:space-between">
            <span style="font-weight:600;font-size:8.5px;color:#1A1A2E;${bt}">${esc(e.role)}</span>
            <span style="font-size:7.5px;color:#718096;${bt}">${esc(e.period)}</span>
          </div>
          <div style="font-size:8px;color:#718096;${bt}">${esc(e.org)}</div>
          ${e.desc ? `<div style="font-size:7.5px;color:#2D3748;${bt}">${esc(e.desc)}</div>` : ""}
        </div>`,
              )
              .join(""),
          )
        : "",

    skills: () =>
      cv.skills.length
        ? sec(
            "Skills",
            `<div style="display:flex;flex-wrap:wrap;gap:4px">
        ${cv.skills.map((s) => `<span style="padding:2px 7px;background:#FFF5F5;color:#C53030;border-radius:10px;font-size:7.5px;font-weight:500;${bt}">${esc(s.name)}</span>`).join("")}
      </div>`,
          )
        : "",

    references: () =>
      cv.references.length
        ? sec(
            "References",
            cv.references
              .map(
                (e) => `
        <div style="margin-bottom:6px">
          <div style="font-weight:600;font-size:8.5px;color:#1A1A2E;${bt}">${esc(e.name)}</div>
          <div style="font-size:8px;color:#718096;${bt}">${esc(e.title)}${e.org ? ", " + esc(e.org) : ""}</div>
          ${e.email ? `<div style="font-size:7.5px;color:#2D3748;${bt}">✉ ${esc(e.email)}</div>` : ""}
          ${e.phone ? `<div style="font-size:7.5px;color:#2D3748;${bt}">📞 ${esc(e.phone)}</div>` : ""}
        </div>`,
              )
              .join(""),
          )
        : "",

    custom: () =>
      cv.customSections
        ?.filter((c) => c.sectionTitle)
        .map((c) =>
          sec(
            esc(c.sectionTitle),
            `<div style="font-size:7.5px;color:#2D3748;${bt}">${esc(c.entries)}</div>`,
          ),
        )
        .join("") ?? "",
  };

  // ── Build body following the saved section order ────────────
  const hasContent =
    cv.fullName ||
    cv.summary ||
    cv.education.length ||
    cv.workExp.length ||
    cv.skills.length;

  const body = order.map((key) => renderSection[key]?.() ?? "").join("");

  const fontLink = `<link rel="stylesheet" href="${font.googleUrl}">`;

  const previewHTML = !hasContent
    ? `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;color:#718096;text-align:center;min-height:360px">
        <div style="font-size:36px;margin-bottom:10px;opacity:0.4">📄</div>
        <p style="font-size:11px;line-height:1.6">Start filling out the form<br>to see your resume preview.</p>
       </div>`
    : `${fontLink}
       <div style="${headerStyle}">
         <div style="font-family:${font.nameFamily};font-size:16px;font-weight:600;margin-bottom:2px">${esc(cv.fullName) || "YOUR NAME"}</div>
         ${cv.jobTitle ? `<div style="font-size:9px;color:rgba(255,255,255,0.75);margin-bottom:6px;${bt}">${esc(cv.jobTitle)}</div>` : ""}
         <div style="display:flex;gap:10px;font-size:8px;color:rgba(255,255,255,0.65);flex-wrap:wrap;${bt}">
           ${cv.email ? `<span>✉ ${esc(cv.email)}</span>` : ""}
           ${cv.phone ? `<span>📞 ${esc(cv.phone)}</span>` : ""}
           ${cv.linkedin ? `<span>in ${esc(cv.linkedin.replace("https://linkedin.com/in/", "").replace("https://www.linkedin.com/in/", ""))}</span>` : ""}
           ${cv.github ? `<span>⚓ ${esc(cv.github.replace("https://github.com/", ""))}</span>` : ""}
         </div>
       </div>
       <div style="padding:10px 14px;${bt}">${body}</div>`;

  return (
    <aside
      style={{
        width: 280,
        minWidth: 280,
        background: "white",
        borderLeft: "1px solid #E2E8F0",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Topbar */}
      <div
        style={{
          padding: "0 14px",
          height: 48,
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}
      >
        <span
          style={{ fontSize: 11, fontWeight: 600, color: "#2D3748", flex: 1 }}
        >
          Live Preview
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {(["classic", "modern"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setCVField("template", t)}
              style={{
                padding: "4px 8px",
                fontSize: 10,
                border: "1px solid #E2E8F0",
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s",
                background: cv.template === t ? "#1A1A2E" : "white",
                color: cv.template === t ? "white" : "#718096",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={cv.font || "sans"}
          onChange={(e) => setCVField("font", e.target.value)}
          style={{
            fontSize: 10,
            border: "1px solid #E2E8F0",
            borderRadius: 4,
            padding: "3px 6px",
            fontFamily: "'DM Sans', sans-serif",
            color: "#2D3748",
            background: "white",
            cursor: "pointer",
          }}
        >
          <option value="sans">Sans (DM Sans)</option>
          <option value="fraunces">Fraunces (Serif)</option>
          <option value="dm">DM Sans</option>
        </select>
      </div>

      {/* Preview */}
      <div
        id="cv-preview"
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#F7FAFC",
          padding: "14px 10px",
        }}
      >
        <div
          style={{
            background: "white",
            minHeight: 360,
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            overflow: "hidden",
            fontSize: 9,
            lineHeight: 1.4,
          }}
          dangerouslySetInnerHTML={{ __html: previewHTML }}
        />
      </div>
    </aside>
  );
}
