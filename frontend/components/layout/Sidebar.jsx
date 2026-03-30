"use client";

import { useCVStore } from "@/store/cvStore";
import JobMatchModal from "@/components/builder/modals/JobMatchModal";
import { useState, useEffect } from "react";
import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
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
function isStepDone(cv, i) {
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

  const [activeTab, setActiveTab] = useState("quality");
  const [showJobMatch, setShowJobMatch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
  const barColor = (val, max) =>
    val / max > 0.6 ? "#38A169" : val / max > 0.3 ? "#D69E2E" : "#E53E3E";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function handleTabClick(tab) {
    setActiveTab(tab);
    if (tab === "match") setShowJobMatch(true);
  }

  const sidebarWidth = isMobile ? "100vw" : "220px";
  const sidebarMinWidth = isMobile ? "unset" : "220px";

  return /*#__PURE__*/ _jsxs(_Fragment, {
    children: [
      /*#__PURE__*/ _jsxs("aside", {
        id: "sidebar",
        style: {
          width: sidebarWidth,
          minWidth: sidebarMinWidth,
          maxWidth: isMobile ? "100vw" : "280px",
          background: "#16213E",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          fontSize: "clamp(11px, 2vw, 13px)",
        },
        children: [
          /*#__PURE__*/ _jsxs("div", {
            style: {
              padding:
                "clamp(12px, 3vw, 16px) clamp(12px, 3vw, 16px) clamp(10px, 2vw, 12px)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              gap: "clamp(6px, 2vw, 8px)",
              flexShrink: 0,
            },
            children: [
              /*#__PURE__*/ _jsx("div", {
                style: {
                  width: "clamp(24px, 4vw, 28px)",
                  height: "clamp(24px, 4vw, 28px)",
                  background: "#E53E3E",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "clamp(11px, 2vw, 13px)",
                  flexShrink: 0,
                },
                children: "CV",
              }),
              /*#__PURE__*/ _jsx("span", {
                style: {
                  fontSize: "clamp(11px, 2vw, 13px)",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.9)",
                  whiteSpace: isMobile ? "nowrap" : "normal",
                  overflow: isMobile ? "hidden" : "visible",
                  textOverflow: isMobile ? "ellipsis" : "clip",
                },
                children: isMobile ? "CV Builder" : "Resume Builder",
              }),
              /*#__PURE__*/ _jsx("span", {
                style: {
                  fontSize: "clamp(9px, 1.5vw, 10px)",
                  marginLeft: "auto",
                  color: isSaving ? "#D69E2E" : "#38A169",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                },
                children: isSaving ? "● Saving…" : "● Saved",
              }),
            ],
          }),
          /*#__PURE__*/ _jsxs("div", {
            style: {
              padding: "clamp(10px, 2vw, 12px)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
            },
            children: [
              /*#__PURE__*/ _jsx("div", {
                style: {
                  fontSize: "clamp(9px, 1.5vw, 10px)",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "clamp(6px, 1vw, 8px)",
                },
                children: "\uD83E\uDD16 AI Coach",
              }),
              /*#__PURE__*/ _jsx("div", {
                style: {
                  display: "flex",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  padding: isMobile ? "2px" : "2px",
                  marginBottom: "clamp(8px, 2vw, 10px)",
                  gap: "2px",
                },
                children: ["quality", "match"].map((tab) =>
                  /*#__PURE__*/ _jsx(
                    "button",
                    {
                      onClick: () => handleTabClick(tab),
                      style: {
                        flex: 1,
                        fontSize: "clamp(9px, 1.5vw, 10px)",
                        padding: "clamp(3px, 1vw, 4px) 0",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        transition: "all 0.15s",
                        background:
                          activeTab === tab ? "#E53E3E" : "transparent",
                        color:
                          activeTab === tab ? "white" : "rgba(255,255,255,0.4)",
                        whiteSpace: "nowrap",
                      },
                      children:
                        tab === "quality"
                          ? isMobile
                            ? "Quality"
                            : "Resume Quality"
                          : "Job Match",
                    },
                    tab,
                  ),
                ),
              }),
              /*#__PURE__*/ _jsxs("div", {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "clamp(6px, 1.5vw, 8px) 0",
                },
                children: [
                  /*#__PURE__*/ _jsxs("div", {
                    style: {
                      position: "relative",
                      width: isMobile ? 56 : 72,
                      height: isMobile ? 56 : 72,
                    },
                    children: [
                      /*#__PURE__*/ _jsxs("svg", {
                        viewBox: "0 0 72 72",
                        style: {
                          width: "100%",
                          height: "100%",
                        },
                        children: [
                          /*#__PURE__*/ _jsx("circle", {
                            cx: "36",
                            cy: "36",
                            r: "28",
                            fill: "none",
                            stroke: "rgba(255,255,255,0.1)",
                            strokeWidth: "6",
                          }),
                          /*#__PURE__*/ _jsx("circle", {
                            cx: "36",
                            cy: "36",
                            r: "28",
                            fill: "none",
                            stroke: "#E53E3E",
                            strokeWidth: "6",
                            strokeDasharray: "175.93",
                            strokeDashoffset: offset,
                            strokeLinecap: "round",
                            transform: "rotate(-90 36 36)",
                            style: {
                              transition: "stroke-dashoffset 0.6s ease",
                            },
                          }),
                        ],
                      }),
                      /*#__PURE__*/ _jsxs("div", {
                        style: {
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: isMobile ? 14 : 20,
                          fontWeight: 600,
                          lineHeight: 1,
                        },
                        children: [
                          /*#__PURE__*/ _jsx("span", {
                            children: score,
                          }),
                          /*#__PURE__*/ _jsx("small", {
                            style: {
                              fontSize: isMobile ? 7 : 9,
                              fontWeight: 400,
                              color: "rgba(255,255,255,0.5)",
                            },
                            children: "/100",
                          }),
                        ],
                      }),
                    ],
                  }),
                  /*#__PURE__*/ _jsx("div", {
                    style: {
                      fontSize: "clamp(10px, 1.5vw, 11px)",
                      fontWeight: 600,
                      color: "#E53E3E",
                      marginTop: "clamp(4px, 1vw, 6px)",
                      textAlign: "center",
                    },
                    children: scoreLabel,
                  }),
                ],
              }),
              /*#__PURE__*/ _jsx("ul", {
                style: {
                  listStyle: "none",
                  fontSize: "clamp(10px, 1.5vw, 11px)",
                  marginTop: "clamp(6px, 1.5vw, 8px)",
                  display: isMobile && activeTab === "match" ? "none" : "block",
                },
                children: [
                  {
                    label: "Content Quality",
                    val: breakdown.content,
                    max: 35,
                  },
                  {
                    label: "ATS & Structure",
                    val: breakdown.ats,
                    max: 25,
                  },
                  {
                    label: "Section Complete",
                    val: breakdown.section,
                    max: 20,
                  },
                  {
                    label: "Impact Language",
                    val: breakdown.impact,
                    max: 15,
                  },
                  {
                    label: "App Ready",
                    val: breakdown.appReady,
                    max: 5,
                  },
                ].map(({ label, val, max }) =>
                  /*#__PURE__*/ _jsxs(
                    "li",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(4px, 1vw, 6px)",
                        padding: "clamp(3px, 1vw, 4px) clamp(4px, 1vw, 6px)",
                        color: "rgba(255,255,255,0.7)",
                        borderRadius: 4,
                        fontSize: "clamp(9px, 1.5vw, 10px)",
                      },
                      children: [
                        /*#__PURE__*/ _jsx("span", {
                          style: {
                            flex: 1,
                            fontSize: "clamp(9px, 1.5vw, 10px)",
                            whiteSpace: "nowrap",
                          },
                          children: isMobile ? label.split(" ")[0] : label,
                        }),
                        /*#__PURE__*/ _jsx("div", {
                          style: {
                            width: isMobile ? 20 : 30,
                            height: 3,
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: 2,
                            overflow: "hidden",
                            flexShrink: 0,
                          },
                          children: /*#__PURE__*/ _jsx("div", {
                            style: {
                              width: `${(val / max) * 100}%`,
                              height: "100%",
                              background: barColor(val, max),
                              borderRadius: 2,
                              transition: "width 0.5s",
                            },
                          }),
                        }),
                        /*#__PURE__*/ _jsx("span", {
                          style: {
                            fontSize: "clamp(8px, 1.5vw, 10px)",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.5)",
                            minWidth: isMobile ? 24 : 30,
                            textAlign: "right",
                            whiteSpace: "nowrap",
                          },
                          children: isMobile ? val : `${val}/${max}`,
                        }),
                      ],
                    },
                    label,
                  ),
                ),
              }),
              activeTab === "match" &&
                /*#__PURE__*/ _jsx("button", {
                  onClick: () => setShowJobMatch(true),
                  style: {
                    width: "100%",
                    marginTop: "clamp(8px, 2vw, 10px)",
                    padding: "clamp(5px, 1.5vw, 7px) 0",
                    background: "rgba(229,62,62,0.2)",
                    border: "1px solid rgba(229,62,62,0.4)",
                    borderRadius: 6,
                    color: "white",
                    fontSize: "clamp(10px, 1.5vw, 11px)",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  },
                  children: "\uD83C\uDFAF Run Job Match Analysis",
                }),
            ],
          }),
          /*#__PURE__*/ _jsxs("div", {
            style: {
              flex: 1,
              padding: "clamp(6px, 1.5vw, 8px) clamp(6px, 1.5vw, 8px)",
              overflowY: "auto",
              minHeight: 0,
            },
            children: [
              /*#__PURE__*/ _jsx("div", {
                style: {
                  fontSize: "clamp(8px, 1.5vw, 9px)",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding:
                    "clamp(8px, 1.5vw, 10px) clamp(6px, 1.5vw, 8px) clamp(3px, 1vw, 4px)",
                },
                children: "Sections",
              }),
              STEPS.map((label, i) => {
                const done = isStepDone(cv, i) && i !== currentStep;
                const active = i === currentStep;
                return /*#__PURE__*/ _jsxs(
                  "div",
                  {
                    onClick: () => setCurrentStep(i),
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "clamp(6px, 1.5vw, 8px)",
                      padding: "clamp(5px, 1.5vw, 7px) clamp(6px, 1.5vw, 8px)",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: "clamp(11px, 2vw, 12px)",
                      marginBottom: 1,
                      transition: "all 0.15s",
                      color: active
                        ? "white"
                        : done
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(255,255,255,0.5)",
                      background: active
                        ? "rgba(229,62,62,0.2)"
                        : "transparent",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    children: [
                      /*#__PURE__*/ _jsx("div", {
                        style: {
                          width: "clamp(16px, 3vw, 18px)",
                          height: "clamp(16px, 3vw, 18px)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "clamp(8px, 1.5vw, 9px)",
                          fontWeight: 600,
                          flexShrink: 0,
                          background: active
                            ? "#E53E3E"
                            : done
                              ? "#38A169"
                              : "rgba(255,255,255,0.1)",
                          color:
                            active || done ? "white" : "rgba(255,255,255,0.5)",
                        },
                        children: done ? "✓" : i + 1,
                      }),
                      /*#__PURE__*/ _jsx("span", {
                        style: {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                        children:
                          isMobile && label.length > 15
                            ? label.substring(0, 12) + "..."
                            : label,
                      }),
                    ],
                  },
                  i,
                );
              }),
            ],
          }),
        ],
      }),
      showJobMatch &&
        /*#__PURE__*/ _jsx(JobMatchModal, {
          onClose: () => {
            setShowJobMatch(false);
            setActiveTab("quality");
          },
        }),
    ],
  });
}
