"use client";

import { useCVStore } from "@/store/cvStore";
import PersonalStep from "./steps/PersonalStep";
import ProfileStep from "./steps/ProfileStep";
import EducationStep from "./steps/EducationStep";
import WorkStep from "./steps/WorkStep";
import VolunteeringStep from "./steps/VolunteeringStep";
import ProjectsStep from "./steps/ProjectsStep";
import SkillsStep from "./steps/SkillsStep";
import ReferencesStep from "./steps/ReferencesStep";
import CustomStep from "./steps/CustomStep";
import UploadModal from "./modals/UploadModal";
import PasteModal from "./modals/PasteModal";
import OrderModal from "./modals/OrderModal";
import JobMatchModal from "./modals/JobMatchModal";
import FinishScreen from "./FinishScreen";
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
const STEP_COMPONENTS = [
  PersonalStep,
  ProfileStep,
  EducationStep,
  WorkStep,
  VolunteeringStep,
  ProjectsStep,
  SkillsStep,
  ReferencesStep,
  CustomStep,
];
export default function FormPanel({ onExport, isMobile }) {
  const { currentStep, setCurrentStep } = useCVStore();
  const [finished, setFinished] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showJobMatch, setShowJobMatch] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const StepComponent = STEP_COMPONENTS[currentStep];

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
  const { cv } = useCVStore();

  return /*#__PURE__*/ _jsxs("div", {
    id: "form-panel",
    style: {
      flex: isMobile ? "0 0 100%" : 1,
      background: "#F8FAFF",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      minWidth: 0,
      width: isMobile ? "100%" : "auto",
    },
    children: [
      /*#__PURE__*/ _jsxs("div", {
        style: {
          background: "white",
          borderBottom: "1px solid #E2E8F0",
          padding: isMobile
            ? "clamp(8px, 2vw, 12px)"
            : "0 clamp(16px, 2vw, 20px)",
          height: isMobile ? "auto" : "48px",
          display: "flex",
          alignItems: "center",
          gap: "clamp(4px, 1vw, 8px)",
          flexShrink: 0,
          flexDirection: isMobile ? "column" : "row",
          rowGap: isMobile ? "clamp(8px, 2vw, 12px)" : 0,
        },
        children: [
          /*#__PURE__*/ _jsx("div", {
            style: {
              display: "flex",
              gap: "clamp(2px, 1vw, 4px)",
              overflowX: "auto",
              flex: 1,
              width: isMobile ? "100%" : "auto",
              maxWidth: "100%",
            },
            children: STEPS.map((s, i) => {
              const done = isStepDone(cv, i) && i !== currentStep;
              const active = i === currentStep;
              return /*#__PURE__*/ _jsxs(
                "button",
                {
                  onClick: () => {
                    setFinished(false);
                    setCurrentStep(i);
                  },
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? 0 : 3,
                    padding: isMobile
                      ? "clamp(4px, 1vw, 6px) clamp(4px, 1vw, 6px)"
                      : "5px clamp(6px, 1vw, 10px)",
                    borderRadius: 20,
                    fontSize: isMobile
                      ? "clamp(9px, 2vw, 10px)"
                      : "clamp(10px, 1.5vw, 11px)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    transition: "all 0.15s",
                    border: done
                      ? "1px solid #38A169"
                      : "1px solid transparent",
                    background: active ? "#E53E3E" : "transparent",
                    color: active ? "white" : done ? "#38A169" : "#718096",
                    flexShrink: 0,
                  },
                  children: [
                    /*#__PURE__*/ _jsx("span", {
                      style: {
                        width: isMobile ? 14 : 16,
                        height: isMobile ? 14 : 16,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isMobile ? 8 : 9,
                        fontWeight: 700,
                        background: active
                          ? "rgba(255,255,255,0.3)"
                          : done
                            ? "#38A169"
                            : "rgba(0,0,0,0.1)",
                        color: active || done ? "white" : "inherit",
                        flexShrink: 0,
                      },
                      children: done ? "✓" : i + 1,
                    }),
                    !isMobile && s,
                  ],
                },
                i,
              );
            }),
          }),
          /*#__PURE__*/ _jsxs("div", {
            style: {
              display: isMobile ? "grid" : "flex",
              gridTemplateColumns: isMobile
                ? "repeat(auto-fit, minmax(60px, 1fr))"
                : undefined,
              gap: isMobile ? "clamp(4px, 1vw, 6px)" : "clamp(4px, 1vw, 6px)",
              flexShrink: 0,
              width: isMobile ? "100%" : "auto",
            },
            children: [
              /*#__PURE__*/ _jsx(Btn, {
                onClick: () => setShowUpload(true),
                isMobile: isMobile,
                children: isMobile ? "📄" : "📄 Upload",
              }),
              /*#__PURE__*/ _jsx(Btn, {
                onClick: () => setShowPaste(true),
                isMobile: isMobile,
                children: isMobile ? "📋" : "📋 Paste",
              }),
              /*#__PURE__*/ _jsx(Btn, {
                onClick: () => setShowOrder(true),
                isMobile: isMobile,
                children: isMobile ? "⚙" : "⚙ Order",
              }),
              /*#__PURE__*/ _jsx(Btn, {
                onClick: () => setShowJobMatch(true),
                isMobile: isMobile,
                children: isMobile ? "🏌️" : "🏌️ Job Match",
              }),
              /*#__PURE__*/ _jsx(Btn, {
                primary: true,
                onClick: onExport,
                isMobile: isMobile,
                children: isMobile ? "📥" : "📥 Export PDF",
              }),
            ],
          }),
        ],
      }),
      finished
        ? /*#__PURE__*/ _jsx(FinishScreen, {
            onEdit: () => setFinished(false),
            onExport: onExport,
          })
        : /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
              /*#__PURE__*/ _jsx("div", {
                style: {
                  flex: 1,
                  overflowY: "auto",
                  padding: isMobile
                    ? "clamp(12px, 3vw, 16px)"
                    : "clamp(16px, 2vw, 24px)",
                  minHeight: 0,
                },
                children: /*#__PURE__*/ _jsx(StepComponent, {}),
              }),
              /*#__PURE__*/ _jsxs("div", {
                style: {
                  background: "white",
                  borderTop: "1px solid #E2E8F0",
                  padding: isMobile
                    ? "clamp(8px, 2vw, 12px)"
                    : "clamp(8px, 1.5vw, 10px) clamp(16px, 2vw, 24px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "clamp(8px, 2vw, 12px)" : 0,
                  flexShrink: 0,
                },
                children: [
                  /*#__PURE__*/ _jsxs("span", {
                    style: {
                      fontSize: isMobile
                        ? "clamp(10px, 2vw, 11px)"
                        : "clamp(10px, 1.5vw, 11px)",
                      color: "#718096",
                    },
                    children: ["Step ", currentStep + 1, " of ", STEPS.length],
                  }),
                  /*#__PURE__*/ _jsxs("div", {
                    style: {
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      gap: isMobile
                        ? "clamp(6px, 1.5vw, 8px)"
                        : "clamp(6px, 1vw, 8px)",
                      width: isMobile ? "100%" : "auto",
                    },
                    children: [
                      currentStep > 0 &&
                        /*#__PURE__*/ _jsx(Btn, {
                          onClick: () => setCurrentStep(currentStep - 1),
                          isMobile: isMobile,
                          style: { flex: isMobile ? 1 : undefined },
                          children: isMobile ? "← Back" : "← Previous",
                        }),
                      /*#__PURE__*/ _jsx(Btn, {
                        primary: true,
                        onClick: () => {
                          if (currentStep < STEPS.length - 1)
                            setCurrentStep(currentStep + 1);
                          else setFinished(true);
                        },
                        isMobile: isMobile,
                        style: { flex: isMobile ? 1 : undefined },
                        children:
                          currentStep === STEPS.length - 1
                            ? isMobile
                              ? "Finish ✓"
                              : "Finish ✓"
                            : isMobile
                              ? "Next →"
                              : "Next →",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
      showUpload &&
        /*#__PURE__*/ _jsx(UploadModal, {
          onClose: () => setShowUpload(false),
        }),
      showPaste &&
        /*#__PURE__*/ _jsx(PasteModal, {
          onClose: () => setShowPaste(false),
        }),
      showOrder &&
        /*#__PURE__*/ _jsx(OrderModal, {
          onClose: () => setShowOrder(false),
        }),
      showJobMatch &&
        /*#__PURE__*/ _jsx(JobMatchModal, {
          onClose: () => setShowJobMatch(false),
        }),
    ],
  });
}
function Btn({ children, onClick, primary, isMobile, style }) {
  return /*#__PURE__*/ _jsx("button", {
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: isMobile ? 2 : 4,
      padding: isMobile
        ? "clamp(6px, 1.5vw, 8px) clamp(6px, 1.5vw, 8px)"
        : "clamp(4px, 1vw, 5px) clamp(8px, 1.5vw, 10px)",
      borderRadius: 6,
      fontSize: isMobile ? "clamp(9px, 2vw, 10px)" : "clamp(10px, 1.5vw, 11px)",
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.15s",
      background: primary ? "#E53E3E" : "white",
      border: primary ? "1px solid #E53E3E" : "1px solid #E2E8F0",
      color: primary ? "white" : "#2D3748",
      whiteSpace: "nowrap",
      ...style,
    },
    children: children,
  });
}
