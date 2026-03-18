"use client";

import { useCVStore } from "@/store/cvStore";
import JobMatchModal from "@/components/builder/modals/JobMatchModal";
import { useState } from "react";

const STEPS = [
  "Personal",
  "Profile",
  "Education",
  "Work Experience",
  "Volunteering",
  "Projects & Research",
  "Skills",
  "References",
  "Custom",
];

function isStepDone(
  cv: ReturnType<typeof useCVStore.getState>["cv"],
  i: number,
): boolean {
  if (i === 0) return cv.fullName.length > 0;
  if (i === 1) return cv.summary.length > 0;
  if (i === 2) return cv.education.length > 0;
  if (i === 3) return cv.workExp.length > 0;
  if (i === 4) return cv.volunteering.length > 0;
  if (i === 5) return cv.projects.length > 0;
  if (i === 6) return cv.skills.length > 0;
  if (i === 7) return cv.references.length > 0;
  return false;
}

export default function Sidebar() {
  const { cv, currentStep, setCurrentStep, breakdown, isSaving } = useCVStore();

  // Job Match modal is controlled locally — no need to touch global mode state
  const [activeTab, setActiveTab] = useState<"quality" | "match">("quality");
  const [showJobMatch, setShowJobMatch] = useState(false);

  const score = breakdown.total;
  const circ = 175.93;
  const offset = circ - (score / 100) * circ;

  const scoreLabel =
    score < 30
      ? "Getting Started"
      : score < 50
        ? "Needs Work"
        : score < 70
          ? "Looking Good"
          : score < 85
            ? "Strong CV"
            : "Excellent!";

  const barColor = (val: number, max: number) =>
    val / max > 0.6 ? "#38A169" : val / max > 0.3 ? "#D69E2E" : "#E53E3E";

  // When user clicks "Job Match" tab, open the modal immediately
  function handleTabClick(tab: "quality" | "match") {
    setActiveTab(tab);
    if (tab === "match") setShowJobMatch(true);
  }

  return (
    <>
      <aside
        style={{
          width: 220,
          minWidth: 220,
          background: "#16213E",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: "#E53E3E",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            CV
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Resume Builder
          </span>
          <span
            style={{
              fontSize: 10,
              marginLeft: "auto",
              color: isSaving ? "#D69E2E" : "#38A169",
            }}
          >
            {isSaving ? "● Saving…" : "● Saved"}
          </span>
        </div>

        {/* ATS Panel */}
        <div
          style={{
            padding: 12,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            🤖 AI Coach
          </div>

          {/* Mode toggle */}
          <div
            style={{
              display: "flex",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 6,
              padding: 2,
              marginBottom: 10,
              gap: 2,
            }}
          >
            {(["quality", "match"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                style={{
                  flex: 1,
                  fontSize: 10,
                  padding: "4px 0",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  transition: "all 0.15s",
                  background: activeTab === tab ? "#E53E3E" : "transparent",
                  color: activeTab === tab ? "white" : "rgba(255,255,255,0.4)",
                }}
              >
                {tab === "quality" ? "Resume Quality" : "Job Match"}
              </button>
            ))}
          </div>

          {/* Score ring */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "8px 0",
            }}
          >
            <div style={{ position: "relative", width: 72, height: 72 }}>
              <svg viewBox="0 0 72 72" style={{ width: 72, height: 72 }}>
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="6"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  fill="none"
                  stroke="#E53E3E"
                  strokeWidth="6"
                  strokeDasharray="175.93"
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 36 36)"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 20,
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                <span>{score}</span>
                <small
                  style={{
                    fontSize: 9,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  /100
                </small>
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#E53E3E",
                marginTop: 6,
              }}
            >
              {scoreLabel}
            </div>
          </div>

          {/* Breakdown bars */}
          <ul style={{ listStyle: "none", fontSize: 11, marginTop: 8 }}>
            {[
              { label: "Content Quality", val: breakdown.content, max: 35 },
              { label: "ATS & Structure", val: breakdown.ats, max: 25 },
              { label: "Section Complete", val: breakdown.section, max: 20 },
              { label: "Impact Language", val: breakdown.impact, max: 15 },
              { label: "App Ready", val: breakdown.appReady, max: 5 },
            ].map(({ label, val, max }) => (
              <li
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 6px",
                  color: "rgba(255,255,255,0.7)",
                  borderRadius: 4,
                }}
              >
                <span style={{ flex: 1, fontSize: 10 }}>{label}</span>
                <div
                  style={{
                    width: 30,
                    height: 3,
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(val / max) * 100}%`,
                      height: "100%",
                      background: barColor(val, max),
                      borderRadius: 2,
                      transition: "width 0.5s",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.5)",
                    minWidth: 30,
                    textAlign: "right",
                  }}
                >
                  {val}/{max}
                </span>
              </li>
            ))}
          </ul>

          {/* Job Match hint — shows below the ring when match tab is active */}
          {activeTab === "match" && (
            <button
              onClick={() => setShowJobMatch(true)}
              style={{
                width: "100%",
                marginTop: 10,
                padding: "7px 0",
                background: "rgba(229,62,62,0.2)",
                border: "1px solid rgba(229,62,62,0.4)",
                borderRadius: 6,
                color: "white",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              🎯 Run Job Match Analysis
            </button>
          )}
        </div>

        {/* Section navigation */}
        <div style={{ flex: 1, padding: "8px 8px", overflowY: "auto" }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "10px 8px 4px",
            }}
          >
            Sections
          </div>
          {STEPS.map((label, i) => {
            const done = isStepDone(cv, i) && i !== currentStep;
            const active = i === currentStep;
            return (
              <div
                key={i}
                onClick={() => setCurrentStep(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 8px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  marginBottom: 1,
                  transition: "all 0.15s",
                  color: active
                    ? "white"
                    : done
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(255,255,255,0.5)",
                  background: active ? "rgba(229,62,62,0.2)" : "transparent",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 600,
                    flexShrink: 0,
                    background: active
                      ? "#E53E3E"
                      : done
                        ? "#38A169"
                        : "rgba(255,255,255,0.1)",
                    color: active || done ? "white" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Job Match modal — rendered outside the aside so it covers the full screen */}
      {showJobMatch && (
        <JobMatchModal
          onClose={() => {
            setShowJobMatch(false);
            setActiveTab("quality"); // switch back to quality tab when modal closes
          }}
        />
      )}
    </>
  );
}
