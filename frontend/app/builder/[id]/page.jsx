"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCVStore } from "@/store/cvStore";
import { cvAPI, pdfAPI } from "@/lib/api";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useAtsScore } from "@/hooks/useAtsScore";
import Sidebar from "@/components/layout/Sidebar";
import FormPanel from "@/components/builder/FormPanel";
import PreviewPanel from "@/components/preview/PreviewPanel";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { token, cv, setCV, isSaving } = useCVStore();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Register global hooks
  useAutoSave();
  useAtsScore();

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    // If the store already has this CV loaded, skip the fetch
    if (cv.id === params.id) {
      setLoading(false);
      return;
    }
    cvAPI
      .get(params.id)
      .then((res) => {
        setCV(res.data.data);
      })
      .catch(() => router.replace("/dashboard"))
      .finally(() => setLoading(false));
  }, [params.id, token]); // eslint-disable-line

  if (loading) {
    return /*#__PURE__*/ _jsx("div", {
      style: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1A1A2E",
        color: "rgba(255,255,255,0.6)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "clamp(14px, 4vw, 16px)",
      },
      children: "Loading CV\u2026",
    });
  }

  return /*#__PURE__*/ _jsxs("div", {
    style: {
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
      flexDirection: isMobile ? "column" : "row",
    },
    children: [
      // Mobile hamburger menu
      isMobile &&
        /*#__PURE__*/ _jsx("button", {
          onClick: () => setSidebarOpen(!sidebarOpen),
          style: {
            position: "absolute",
            top: "1rem",
            left: "1rem",
            zIndex: 50,
            background: "#16213E",
            border: "none",
            color: "white",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "clamp(12px, 3vw, 14px)",
            fontWeight: 600,
          },
          children: sidebarOpen ? "✕ Close" : "☰ Menu",
        }),

      // Sidebar with overlay on mobile
      /*#__PURE__*/ _jsxs("div", {
        style: {
          position: isMobile ? "fixed" : "relative",
          left: 0,
          top: 0,
          width: isMobile ? "100%" : "auto",
          height: isMobile ? "100%" : "auto",
          zIndex: isMobile ? (sidebarOpen ? 40 : -1) : "auto",
          transform:
            isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 0.3s ease-in-out",
          overflow: isMobile ? "auto" : "visible",
        },
        children: [
          // Mobile overlay
          isMobile &&
            sidebarOpen &&
            /*#__PURE__*/ _jsx("div", {
              onClick: () => setSidebarOpen(false),
              style: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 30,
              },
            }),
          /*#__PURE__*/ _jsx(Sidebar, {}),
        ],
      }),

      // Form and Preview panels
      /*#__PURE__*/ _jsxs("div", {
        style: {
          display: "flex",
          flex: 1,
          width: "100%",
          minWidth: 0,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 0 : "1px",
        },
        children: [
          /*#__PURE__*/ _jsx(FormPanel, {
            onExport: () => pdfAPI.download(cv.id),
            isMobile: isMobile,
          }),
          /*#__PURE__*/ _jsx(PreviewPanel, {
            isMobile: isMobile,
          }),
        ],
      }),
    ],
  });
}
