"use client";

import { useState } from "react";
import { useCVStore } from "@/store/cvStore";
import { atsAPI } from "@/lib/api";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export default function JobMatchModal({
  onClose
}) {
  const {
    cv,
    setMatchResult
  } = useCVStore();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  async function handleAnalyse() {
    if (jd.trim().length < 50) {
      setError("Please paste a more complete job description (at least 50 characters).");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (cv.id) {
        const res = await atsAPI.match(cv.id, jd);
        const data = res.data.data;
        setResult(data);
        setMatchResult(data.score, data.missing);
      } else {
        const data = localMatch(cv, jd);
        setResult(data);
        setMatchResult(data.score, data.missing);
      }
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  const scoreColor = s => s >= 70 ? "#38A169" : s >= 40 ? "#D69E2E" : "#E53E3E";
  return /*#__PURE__*/_jsx("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(26,26,46,0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 200
    },
    children: /*#__PURE__*/_jsxs("div", {
      style: {
        background: "white",
        borderRadius: 16,
        padding: 28,
        width: 520,
        maxWidth: "95vw",
        maxHeight: "85vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      },
      children: [/*#__PURE__*/_jsx("h3", {
        style: {
          fontFamily: "Fraunces, serif",
          fontSize: 18,
          fontWeight: 600,
          color: "#1A1A2E",
          marginBottom: 6
        },
        children: "\uD83C\uDFAF Job Match Analysis"
      }), /*#__PURE__*/_jsx("p", {
        style: {
          fontSize: 12,
          color: "#718096",
          marginBottom: 18,
          lineHeight: 1.5
        },
        children: "Paste a job description below. We'll compare it against your CV and show which keywords you're matching \u2014 and which are missing."
      }), !result ? /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx("textarea", {
          value: jd,
          onChange: e => setJd(e.target.value),
          placeholder: "Paste the full job description here...",
          style: {
            width: "100%",
            minHeight: 180,
            padding: "10px 12px",
            border: "1px solid #E2E8F0",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
            color: "#2D3748",
            resize: "vertical",
            outline: "none",
            marginBottom: 12
          },
          onFocus: e => {
            e.target.style.borderColor = "#E53E3E";
          },
          onBlur: e => {
            e.target.style.borderColor = "#E2E8F0";
          }
        }), error && /*#__PURE__*/_jsx("div", {
          style: {
            background: "#FFF5F5",
            border: "1px solid #FEB2B2",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            color: "#C53030",
            marginBottom: 12
          },
          children: error
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: "flex",
            justifyContent: "flex-end",
            gap: 8
          },
          children: [/*#__PURE__*/_jsx(Btn, {
            onClick: onClose,
            children: "Cancel"
          }), /*#__PURE__*/_jsx(Btn, {
            primary: true,
            onClick: handleAnalyse,
            disabled: loading || jd.trim().length < 20,
            children: loading ? "Analysing…" : "Analyse Match"
          })]
        })]
      }) : /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#F8FAFF",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 20
          },
          children: [/*#__PURE__*/_jsx("div", {
            style: {
              fontSize: 36,
              fontWeight: 700,
              color: scoreColor(result.score),
              lineHeight: 1
            },
            children: result.score
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                fontSize: 11,
                color: "#718096"
              },
              children: "Keyword Match Score"
            }), /*#__PURE__*/_jsx("div", {
              style: {
                fontSize: 13,
                fontWeight: 600,
                color: scoreColor(result.score)
              },
              children: result.score >= 70 ? "Strong Match" : result.score >= 40 ? "Partial Match" : "Low Match"
            })]
          })]
        }), result.matched.length > 0 && /*#__PURE__*/_jsxs("div", {
          style: {
            marginBottom: 16
          },
          children: [/*#__PURE__*/_jsxs("p", {
            style: {
              fontSize: 11,
              fontWeight: 600,
              color: "#276749",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.06em"
            },
            children: ["\u2705 Matched Keywords (", result.matched.length, ")"]
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: 6
            },
            children: result.matched.map(k => /*#__PURE__*/_jsx("span", {
              style: {
                padding: "3px 10px",
                background: "#F0FFF4",
                border: "1px solid #9AE6B4",
                borderRadius: 20,
                fontSize: 11,
                color: "#276749",
                fontWeight: 500
              },
              children: k
            }, k))
          })]
        }), result.missing.length > 0 && /*#__PURE__*/_jsxs("div", {
          style: {
            marginBottom: 20
          },
          children: [/*#__PURE__*/_jsxs("p", {
            style: {
              fontSize: 11,
              fontWeight: 600,
              color: "#C53030",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.06em"
            },
            children: ["\u274C Missing Keywords (", result.missing.length, ")"]
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: 6
            },
            children: result.missing.map(k => /*#__PURE__*/_jsx("span", {
              style: {
                padding: "3px 10px",
                background: "#FFF5F5",
                border: "1px solid #FEB2B2",
                borderRadius: 20,
                fontSize: 11,
                color: "#C53030",
                fontWeight: 500
              },
              children: k
            }, k))
          }), /*#__PURE__*/_jsx("p", {
            style: {
              fontSize: 11,
              color: "#718096",
              marginTop: 10,
              lineHeight: 1.5
            },
            children: "\uD83D\uDCA1 Add missing keywords naturally into your summary, work descriptions, or skills section."
          })]
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: "flex",
            justifyContent: "flex-end",
            gap: 8
          },
          children: [/*#__PURE__*/_jsx(Btn, {
            onClick: () => setResult(null),
            children: "Try Another JD"
          }), /*#__PURE__*/_jsx(Btn, {
            primary: true,
            onClick: onClose,
            children: "Done"
          })]
        })]
      })]
    })
  });
}
function Btn({
  children,
  onClick,
  primary,
  disabled
}) {
  return /*#__PURE__*/_jsx("button", {
    onClick: onClick,
    disabled: disabled,
    style: {
      padding: "8px 20px",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "'DM Sans', sans-serif",
      opacity: disabled ? 0.6 : 1,
      background: primary ? "#E53E3E" : "white",
      border: primary ? "1px solid #E53E3E" : "1px solid #E2E8F0",
      color: primary ? "white" : "#718096"
    },
    children: children
  });
}

// ── Local keyword match (used when CV has no id yet) ──────────
function localMatch(cv, jd) {
  const cvText = [cv.summary, cv.jobTitle, cv.skills.map(s => s.name).join(" "), cv.workExp.map(w => `${w.title} ${w.description}`).join(" "), cv.projects.map(p => `${p.name} ${p.tech} ${p.description}`).join(" "), cv.education.map(e => e.degree).join(" ")].join(" ").toLowerCase();
  const STOP = new Set(["that", "with", "this", "have", "from", "they", "will", "your", "been", "were", "their", "there", "would", "could", "which", "about", "should", "other", "these", "those", "after", "before", "where", "while"]);
  const jdWords = [...new Set(jd.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !STOP.has(w)))];
  const matched = jdWords.filter(w => cvText.includes(w));
  const missing = jdWords.filter(w => !cvText.includes(w)).slice(0, 10);
  const score = jdWords.length > 0 ? Math.min(100, Math.round(matched.length / jdWords.length * 100 + 10)) : 0;
  return {
    score,
    matched: matched.slice(0, 20),
    missing
  };
}