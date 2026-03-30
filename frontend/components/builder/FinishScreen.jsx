'use client';

import { useCVStore } from '@/store/cvStore';
import { pdfAPI } from '@/lib/api';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function FinishScreen({
  onEdit,
  onExport
}) {
  const {
    cv,
    breakdown,
    resetCV
  } = useCVStore();
  const score = breakdown.total;
  const scoreColor = score >= 70 ? '#38A169' : score >= 40 ? '#D69E2E' : '#E53E3E';
  const scoreLabel = score >= 85 ? 'Excellent!' : score >= 70 ? 'Strong CV' : score >= 50 ? 'Looking Good' : score >= 30 ? 'Needs Work' : 'Getting Started';
  const tips = [];
  if (!cv.summary) tips.push('Add a Professional Summary to boost your content score.');
  if (cv.workExp.length === 0) tips.push('Add at least one Work Experience or Internship entry.');
  if (cv.skills.length < 5) tips.push(`Add more skills — you have ${cv.skills.length}, aim for 8+.`);
  if (!cv.linkedin) tips.push('Add your LinkedIn URL to complete the Application Ready section.');
  if (score < 70 && cv.workExp.some(w => !w.description)) tips.push('Add bullet point achievements to your work experience entries.');

  // ── Print: build a full A4 HTML document from CV data and
  //    open it in a hidden iframe, then call print() on the iframe.
  //    This is 100% reliable because we build the HTML ourselves
  //    instead of trying to clone & scale the miniature preview widget.
  function handlePrint() {
    const html = buildPrintHTML(cv);
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      return;
    }
    doc.open();
    doc.write(html);
    doc.close();

    // Wait for the iframe content (including any fonts) to finish loading
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } finally {
          // Clean up after the print dialog is dismissed
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 3000);
        }
      }, 600);
    };
  }

  // ── Open PDF in new browser tab so user can view / save / print from there
  async function handleOpenInTab() {
    if (!cv.id) {
      alert('Save your CV first by clicking "Download PDF".');
      return;
    }
    await pdfAPI.openInTab(cv.id);
  }
  return /*#__PURE__*/_jsxs("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 32px',
      textAlign: 'center',
      background: '#F8FAFF',
      overflowY: 'auto'
    },
    children: [/*#__PURE__*/_jsx("div", {
      style: {
        fontSize: 56,
        marginBottom: 20
      },
      children: "\uD83C\uDF89"
    }), /*#__PURE__*/_jsx("h2", {
      style: {
        fontFamily: 'Fraunces, serif',
        fontSize: 26,
        fontWeight: 600,
        color: '#1A1A2E',
        marginBottom: 10
      },
      children: "Your CV is Complete!"
    }), /*#__PURE__*/_jsxs("p", {
      style: {
        fontSize: 14,
        color: '#718096',
        maxWidth: 440,
        lineHeight: 1.6,
        marginBottom: 28
      },
      children: ["Great work, ", /*#__PURE__*/_jsx("strong", {
        children: cv.fullName || 'there'
      }), "! Review the live preview on the right, then export your ATS-optimised PDF."]
    }), /*#__PURE__*/_jsxs("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'white',
        border: '1px solid #E2E8F0',
        borderRadius: 14,
        padding: '16px 28px',
        marginBottom: 28,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      },
      children: [/*#__PURE__*/_jsx("div", {
        style: {
          fontSize: 40,
          fontWeight: 700,
          color: scoreColor,
          lineHeight: 1
        },
        children: score
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          textAlign: 'left'
        },
        children: [/*#__PURE__*/_jsx("div", {
          style: {
            fontSize: 11,
            color: '#718096'
          },
          children: "ATS Score out of 100"
        }), /*#__PURE__*/_jsx("div", {
          style: {
            fontSize: 14,
            fontWeight: 600,
            color: scoreColor
          },
          children: scoreLabel
        })]
      })]
    }), tips.length > 0 && /*#__PURE__*/_jsxs("div", {
      style: {
        background: '#FFFBF0',
        border: '1px solid #FAD56A',
        borderRadius: 10,
        padding: '14px 18px',
        marginBottom: 24,
        maxWidth: 440,
        textAlign: 'left'
      },
      children: [/*#__PURE__*/_jsx("p", {
        style: {
          fontSize: 11,
          fontWeight: 600,
          color: '#744210',
          marginBottom: 8
        },
        children: "\uD83D\uDCA1 Tips to improve your score:"
      }), /*#__PURE__*/_jsx("ul", {
        style: {
          listStyle: 'none',
          fontSize: 12,
          color: '#7B5E17'
        },
        children: tips.map((t, i) => /*#__PURE__*/_jsxs("li", {
          style: {
            padding: '2px 0'
          },
          children: ["\u2022 ", t]
        }, i))
      })]
    }), /*#__PURE__*/_jsxs("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        justifyContent: 'center'
      },
      children: [/*#__PURE__*/_jsx(ActionBtn, {
        primary: true,
        onClick: onExport,
        children: "\uD83D\uDCE5 Download PDF"
      }), /*#__PURE__*/_jsx(ActionBtn, {
        onClick: handleOpenInTab,
        children: "\uD83D\uDD17 Open in Tab"
      }), /*#__PURE__*/_jsx(ActionBtn, {
        onClick: handlePrint,
        children: "\uD83D\uDDA8 Print CV"
      }), /*#__PURE__*/_jsx(ActionBtn, {
        onClick: onEdit,
        children: "\u270F Edit CV"
      }), /*#__PURE__*/_jsx(ActionBtn, {
        danger: true,
        onClick: () => {
          if (confirm('Start a new CV? All current data will be cleared.')) resetCV();
        },
        children: "\uD83D\uDD04 New CV"
      })]
    }), /*#__PURE__*/_jsxs("p", {
      style: {
        fontSize: 11,
        color: '#718096',
        marginTop: 18,
        maxWidth: 380,
        lineHeight: 1.6
      },
      children: [/*#__PURE__*/_jsx("strong", {
        children: "Download PDF"
      }), " saves the file \xB7", ' ', /*#__PURE__*/_jsx("strong", {
        children: "Open in Tab"
      }), " lets you view & print via your browser \xB7", ' ', /*#__PURE__*/_jsx("strong", {
        children: "Print CV"
      }), " opens your printer directly"]
    })]
  });
}

// ── Shared ActionBtn component ────────────────────────────────
function ActionBtn({
  children,
  onClick,
  primary,
  danger
}) {
  return /*#__PURE__*/_jsx("button", {
    onClick: onClick,
    style: {
      padding: '10px 20px',
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif",
      transition: 'all 0.15s',
      background: primary ? '#E53E3E' : 'white',
      border: primary ? '1px solid #E53E3E' : danger ? '1px solid #FEB2B2' : '1px solid #E2E8F0',
      color: primary ? 'white' : danger ? '#E53E3E' : '#2D3748'
    },
    children: children
  });
}

// ── Build a complete A4 HTML document from CV data ────────────
// This mirrors what the backend Puppeteer service renders,
// so Print and Download PDF look identical.
// Font map — mirrors PreviewPanel FONTS
const PRINT_FONTS = {
  sans: {
    bodyFamily: "'DM Sans', Arial, sans-serif",
    nameFamily: "'Fraunces', serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600&display=swap'
  },
  fraunces: {
    bodyFamily: "'Fraunces', Georgia, serif",
    nameFamily: "'Fraunces', Georgia, serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap'
  },
  dm: {
    bodyFamily: "'DM Sans', Arial, sans-serif",
    nameFamily: "'DM Sans', Arial, sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap'
  }
};
function buildPrintHTML(cv) {
  const isModern = cv.template === 'modern';
  const font = PRINT_FONTS[cv.font || 'sans'] ?? PRINT_FONTS.sans;
  const headerBg = isModern ? 'background:linear-gradient(135deg,#1A1A2E,#E53E3E)' : 'background:#1A1A2E';
  const sectionTitleStyle = isModern ? 'border-bottom:2px solid #E53E3E;color:#1A1A2E' : 'border-bottom:1px solid #E2E8F0;color:#E53E3E';
  const e = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const sec = (title, content) => `
    <div class="section">
      <div class="sec-title" style="${sectionTitleStyle}">${title}</div>
      ${content}
    </div>`;

  // Section renderers — same keys as SectionKey type
  const renderSection = {
    summary: () => cv.summary ? sec('Professional Summary', `<p class="summary">${e(cv.summary)}</p>`) : '',
    education: () => cv.education?.length ? sec('Education', cv.education.map(ed => `
          <div class="entry">
            <div class="row"><span class="bold">${e(ed.degree)}</span><span class="date">${e(ed.startDate)}${ed.endDate ? ' – ' + e(ed.endDate) : ''}</span></div>
            <div class="sub">${e(ed.institution)}${ed.location ? ', ' + e(ed.location) : ''}</div>
            ${ed.gpa ? `<div class="detail">GPA: ${e(ed.gpa)}</div>` : ''}
            ${ed.achievements ? `<div class="detail">${e(ed.achievements)}</div>` : ''}
          </div>`).join('')) : '',
    work: () => cv.workExp?.length ? sec('Work Experience', cv.workExp.map(w => `
          <div class="entry">
            <div class="row"><span class="bold">${e(w.title)}</span><span class="date">${e(w.startDate)}${w.endDate ? ' – ' + e(w.endDate) : ''}</span></div>
            <div class="sub">${e(w.company)}${w.location ? ', ' + e(w.location) : ''}</div>
            ${w.description ? `<div class="detail">${e(w.description).replace(/\n/g, '<br>')}</div>` : ''}
          </div>`).join('')) : '',
    projects: () => cv.projects?.length ? sec('Projects &amp; Research', cv.projects.map(p => `
          <div class="entry">
            <div class="row"><span class="bold">${e(p.name)}</span><span class="date">${e(p.period)}</span></div>
            ${p.tech ? `<div class="sub">${e(p.tech)}</div>` : ''}
            ${p.description ? `<div class="detail">${e(p.description)}</div>` : ''}
          </div>`).join('')) : '',
    volunteering: () => cv.volunteering?.length ? sec('Volunteering', cv.volunteering.map(v => `
          <div class="entry">
            <div class="row"><span class="bold">${e(v.role)}</span><span class="date">${e(v.period)}</span></div>
            <div class="sub">${e(v.org)}</div>
            ${v.desc ? `<div class="detail">${e(v.desc)}</div>` : ''}
          </div>`).join('')) : '',
    skills: () => cv.skills?.length ? sec('Skills', `<div class="skills">${cv.skills.map(s => `<span class="pill">${e(s.name)}</span>`).join('')}</div>`) : '',
    references: () => cv.references?.length ? sec('References', cv.references.map(r => `
          <div class="entry">
            <div class="bold">${e(r.name)}</div>
            <div class="sub">${e(r.title)}${r.org ? ', ' + e(r.org) : ''}</div>
            ${r.email ? `<div class="detail">✉ ${e(r.email)}</div>` : ''}
            ${r.phone ? `<div class="detail">📞 ${e(r.phone)}</div>` : ''}
          </div>`).join('')) : '',
    custom: () => cv.customSections?.filter(c => c.sectionTitle).map(c => sec(e(c.sectionTitle), `<div class="detail">${e(c.entries)}</div>`)).join('') ?? ''
  };

  // Parse sectionOrder defensively (may be JSON string from DB)
  let order = [];
  const rawOrder = cv.sectionOrder;
  if (Array.isArray(rawOrder) && rawOrder.length > 0) {
    order = rawOrder;
  } else if (typeof rawOrder === 'string') {
    try {
      const p = JSON.parse(rawOrder);
      if (Array.isArray(p)) order = p;
    } catch (_) {}
  }
  if (!order.length) {
    order = ['summary', 'education', 'work', 'projects', 'volunteering', 'skills', 'references', 'custom'];
  }
  const body = order.map(key => renderSection[key]?.() ?? '').join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${e(cv.fullName)} — CV</title>
<style>
  @import url('${font.googleUrl}');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 210mm; background: white; }
  body {
    font-family: ${font.bodyFamily};
    font-size: 10.5pt;
    line-height: 1.5;
    color: #2D3748;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .header {
    ${headerBg};
    padding: 28px 36px 20px;
    color: white;
  }
  .name    { font-family: ${font.nameFamily}; font-size: 24pt; font-weight: 600; margin-bottom: 4px; }
  .role    { font-size: 11pt; color: rgba(255,255,255,0.8); margin-bottom: 10px; }
  .contact { display: flex; flex-wrap: wrap; gap: 16px; font-size: 9pt; color: rgba(255,255,255,0.75); }
  .body    { padding: 22px 36px; }
  .section { margin-bottom: 18px; page-break-inside: avoid; }
  .sec-title {
    font-size: 8pt; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; padding-bottom: 4px; margin-bottom: 10px;
  }
  .entry   { margin-bottom: 10px; page-break-inside: avoid; }
  .row     { display: flex; justify-content: space-between; align-items: baseline; }
  .bold    { font-weight: 600; font-size: 10.5pt; color: #1A1A2E; }
  .date    { font-size: 9pt; color: #718096; white-space: nowrap; }
  .sub     { font-size: 9.5pt; color: #718096; margin-bottom: 2px; }
  .detail  { font-size: 9.5pt; color: #2D3748; line-height: 1.6; white-space: pre-line; margin-top: 2px; }
  .summary { font-size: 10pt; color: #2D3748; line-height: 1.7; }
  .skills  { display: flex; flex-wrap: wrap; gap: 6px; }
  .pill    {
    padding: 3px 10px; background: #FFF5F5; color: #C53030;
    border-radius: 12px; font-size: 9pt; font-weight: 500;
    border: 1px solid #FEB2B2;
  }
  @page { margin: 0; size: A4 portrait; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
  <div class="header">
    <div class="name">${e(cv.fullName) || 'YOUR NAME'}</div>
    ${cv.jobTitle ? `<div class="role">${e(cv.jobTitle)}</div>` : ''}
    <div class="contact">
      ${cv.email ? `<span>✉ ${e(cv.email)}</span>` : ''}
      ${cv.phone ? `<span>📞 ${e(cv.phone)}</span>` : ''}
      ${cv.linkedin ? `<span>in ${e(cv.linkedin.replace('https://linkedin.com/in/', '').replace('https://www.linkedin.com/in/', ''))}</span>` : ''}
      ${cv.github ? `<span>⚓ ${e(cv.github.replace('https://github.com/', ''))}</span>` : ''}
    </div>
  </div>
  <div class="body">${body}</div>
</body>
</html>`;
}