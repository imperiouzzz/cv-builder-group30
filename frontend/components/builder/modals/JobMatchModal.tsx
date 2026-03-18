"use client";
import type React from "react";
import { useState } from "react";
import { useCVStore } from "@/store/cvStore";
import { atsAPI } from "@/lib/api";
import type { CVData } from "@/types/cv.types";

interface Props {
  onClose: () => void;
}

export default function JobMatchModal({ onClose }: Props) {
  const { cv, setMatchResult } = useCVStore();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    matched: string[];
    missing: string[];
  } | null>(null);
  const [error, setError] = useState("");

  async function handleAnalyse() {
    if (jd.trim().length < 50) {
      setError(
        "Please paste a more complete job description (at least 50 characters).",
      );
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

  const scoreColor = (s: number) =>
    s >= 70 ? "#38A169" : s >= 40 ? "#D69E2E" : "#E53E3E";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,26,46,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 28,
          width: 520,
          maxWidth: "95vw",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <h3
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: 18,
            fontWeight: 600,
            color: "#1A1A2E",
            marginBottom: 6,
          }}
        >
          🎯 Job Match Analysis
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "#718096",
            marginBottom: 18,
            lineHeight: 1.5,
          }}
        >
          Paste a job description below. We&apos;ll compare it against your CV
          and show which keywords you&apos;re matching — and which are missing.
        </p>

        {!result ? (
          <>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here..."
              style={{
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
                marginBottom: 12,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#E53E3E";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E2E8F0";
              }}
            />
            {error && (
              <div
                style={{
                  background: "#FFF5F5",
                  border: "1px solid #FEB2B2",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "#C53030",
                  marginBottom: 12,
                }}
              >
                {error}
              </div>
            )}
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <Btn onClick={onClose}>Cancel</Btn>
              <Btn
                primary
                onClick={handleAnalyse}
                disabled={loading || jd.trim().length < 20}
              >
                {loading ? "Analysing…" : "Analyse Match"}
              </Btn>
            </div>
          </>
        ) : (
          <>
            {/* Score */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "#F8FAFF",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: scoreColor(result.score),
                  lineHeight: 1,
                }}
              >
                {result.score}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#718096" }}>
                  Keyword Match Score
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: scoreColor(result.score),
                  }}
                >
                  {result.score >= 70
                    ? "Strong Match"
                    : result.score >= 40
                      ? "Partial Match"
                      : "Low Match"}
                </div>
              </div>
            </div>

            {/* Matched */}
            {result.matched.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#276749",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  ✅ Matched Keywords ({result.matched.length})
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.matched.map((k) => (
                    <span
                      key={k}
                      style={{
                        padding: "3px 10px",
                        background: "#F0FFF4",
                        border: "1px solid #9AE6B4",
                        borderRadius: 20,
                        fontSize: 11,
                        color: "#276749",
                        fontWeight: 500,
                      }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing */}
            {result.missing.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#C53030",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  ❌ Missing Keywords ({result.missing.length})
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.missing.map((k) => (
                    <span
                      key={k}
                      style={{
                        padding: "3px 10px",
                        background: "#FFF5F5",
                        border: "1px solid #FEB2B2",
                        borderRadius: 20,
                        fontSize: 11,
                        color: "#C53030",
                        fontWeight: 500,
                      }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "#718096",
                    marginTop: 10,
                    lineHeight: 1.5,
                  }}
                >
                  💡 Add missing keywords naturally into your summary, work
                  descriptions, or skills section.
                </p>
              </div>
            )}

            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <Btn onClick={() => setResult(null)}>Try Another JD</Btn>
              <Btn primary onClick={onClose}>
                Done
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  primary,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 20px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'DM Sans', sans-serif",
        opacity: disabled ? 0.6 : 1,
        background: primary ? "#E53E3E" : "white",
        border: primary ? "1px solid #E53E3E" : "1px solid #E2E8F0",
        color: primary ? "white" : "#718096",
      }}
    >
      {children}
    </button>
  );
}

// ── Local keyword match (used when CV has no id yet) ──────────
function localMatch(cv: CVData, jd: string) {
  const cvText = [
    cv.summary,
    cv.jobTitle,
    cv.skills.map((s) => s.name).join(" "),
    cv.workExp.map((w) => `${w.title} ${w.description}`).join(" "),
    cv.projects.map((p) => `${p.name} ${p.tech} ${p.description}`).join(" "),
    cv.education.map((e) => e.degree).join(" "),
  ]
    .join(" ")
    .toLowerCase();

  const STOP = new Set([
    "that",
    "with",
    "this",
    "have",
    "from",
    "they",
    "will",
    "your",
    "been",
    "were",
    "their",
    "there",
    "would",
    "could",
    "which",
    "about",
    "should",
    "other",
    "these",
    "those",
    "after",
    "before",
    "where",
    "while",
  ]);

  const jdWords = [
    ...new Set(
      jd
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3 && !STOP.has(w)),
    ),
  ];

  const matched = jdWords.filter((w) => cvText.includes(w));
  const missing = jdWords.filter((w) => !cvText.includes(w)).slice(0, 10);
  const score =
    jdWords.length > 0
      ? Math.min(100, Math.round((matched.length / jdWords.length) * 100 + 10))
      : 0;

  return { score, matched: matched.slice(0, 20), missing };
}
