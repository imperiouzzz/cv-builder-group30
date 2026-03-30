"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cvAPI } from "@/lib/api";
import { useCVStore } from "@/store/cvStore";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function DashboardPage() {
  const router = useRouter();
  const { token, clearAuth, setCV, resetCV } = useCVStore();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    cvAPI
      .list()
      .then((res) => setCvs(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, router]);
  async function handleCreate() {
    try {
      const res = await cvAPI.create("My CV");
      const newCV = res.data.data;
      setCV(newCV);
      router.push(`/builder/${newCV.id}`);
    } catch (err) {
      console.error(err);
    }
  }
  async function handleOpen(cv) {
    try {
      const res = await cvAPI.get(cv.id);
      setCV(res.data.data);
      router.push(`/builder/${cv.id}`);
    } catch (err) {
      console.error(err);
    }
  }
  async function handleDelete(id) {
    if (!confirm("Delete this CV?")) return;
    await cvAPI.delete(id);
    setCvs((prev) => prev.filter((c) => c.id !== id));
  }
  function handleLogout() {
    clearAuth();
    router.replace("/auth/login");
  }
  const scoreColor = (s) =>
    s >= 70 ? "#38A169" : s >= 40 ? "#D69E2E" : "#E53E3E";
  return /*#__PURE__*/ _jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#F8FAFF",
      fontFamily: "'DM Sans', sans-serif",
    },
    children: [
      /*#__PURE__*/ _jsxs("header", {
        style: {
          background: "#16213E",
          padding: "clamp(1rem, 3vw, 2rem)",
          height: "auto",
          minHeight: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "clamp(1rem, 2vw, 1.5rem)",
        },
        children: [
          /*#__PURE__*/ _jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "clamp(8px, 2vw, 10px)",
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
                  fontSize: "clamp(12px, 2vw, 13px)",
                  flexShrink: 0,
                },
                children: "CV",
              }),
              /*#__PURE__*/ _jsx("span", {
                style: {
                  color: "white",
                  fontWeight: 600,
                  fontSize: "clamp(14px, 2vw, 15px)",
                },
                children: "Resume Builder",
              }),
            ],
          }),
          /*#__PURE__*/ _jsx("button", {
            onClick: handleLogout,
            style: {
              background: "none",
              border: "none",
              color: "white",
              fontWeight: 500,
              fontSize: "clamp(12px, 2vw, 13px)",
              cursor: "pointer",
              padding: "clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)",
              borderRadius: 4,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            },
            onMouseEnter: (e) =>
              (e.target.style.background = "rgba(255,255,255,0.1)"),
            onMouseLeave: (e) => (e.target.style.background = "none"),
            children: "Logout",
          }),
        ],
      }),
      /*#__PURE__*/ _jsxs("div", {
        style: {
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(1.5rem, 4vw, 3rem)",
          width: "100%",
        },
        children: [
          /*#__PURE__*/ _jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "clamp(1rem, 2vw, 1.5rem)",
              marginBottom: "clamp(1.5rem, 3vw, 2rem)",
              flexWrap: "wrap",
            },
            children: [
              /*#__PURE__*/ _jsx("h1", {
                style: {
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(24px, 5vw, 32px)",
                  fontWeight: 600,
                  color: "#1A1A2E",
                },
                children: "Your CVs",
              }),
              /*#__PURE__*/ _jsx("button", {
                onClick: handleCreate,
                style: {
                  background: "#E53E3E",
                  color: "white",
                  border: "none",
                  padding: "clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "clamp(13px, 2vw, 14px)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                },
                onMouseEnter: (e) => (e.target.style.background = "#C53030"),
                onMouseLeave: (e) => (e.target.style.background = "#E53E3E"),
                children: "+ New CV",
              }),
            ],
          }),
          loading
            ? /*#__PURE__*/ _jsx("div", {
                style: {
                  textAlign: "center",
                  padding: "clamp(2rem, 5vw, 4rem)",
                  color: "#718096",
                  fontSize: "clamp(14px, 2vw, 16px)",
                },
                children: "Loading…",
              })
            : cvs.length === 0
              ? /*#__PURE__*/ _jsx("div", {
                  style: {
                    textAlign: "center",
                    padding: "clamp(2rem, 5vw, 4rem)",
                    background: "white",
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                  },
                  children: /*#__PURE__*/ _jsxs("div", {
                    children: [
                      /*#__PURE__*/ _jsx("div", {
                        style: {
                          fontSize: "clamp(36px, 8vw, 48px)",
                          marginBottom: "clamp(1rem, 2vw, 1.5rem)",
                        },
                        children: "📄",
                      }),
                      /*#__PURE__*/ _jsx("p", {
                        style: {
                          color: "#718096",
                          fontSize: "clamp(14px, 2vw, 16px)",
                          marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                          lineHeight: 1.6,
                        },
                        children:
                          "No CVs yet. Create your first resume to get started!",
                      }),
                      /*#__PURE__*/ _jsx("button", {
                        onClick: handleCreate,
                        style: {
                          background: "#E53E3E",
                          color: "white",
                          border: "none",
                          padding:
                            "clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)",
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: "clamp(13px, 2vw, 14px)",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        },
                        children: "+ Create First CV",
                      }),
                    ],
                  }),
                })
              : /*#__PURE__*/ _jsx("div", {
                  style: {
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(clamp(280px, 50vw, 320px), 1fr))",
                    gap: "clamp(1rem, 2vw, 1.5rem)",
                  },
                  children: cvs.map((cv) =>
                    /*#__PURE__*/ _jsxs(
                      "div",
                      {
                        style: {
                          background: "white",
                          borderRadius: 12,
                          border: "1px solid #E2E8F0",
                          overflow: "hidden",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        },
                        onMouseEnter: (e) => {
                          e.currentTarget.style.boxShadow =
                            "0 8px 24px rgba(0,0,0,0.12)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        },
                        onMouseLeave: (e) => {
                          e.currentTarget.style.boxShadow =
                            "0 1px 3px rgba(0,0,0,0.05)";
                          e.currentTarget.style.transform = "translateY(0)";
                        },
                        children: [
                          /*#__PURE__*/ _jsx("div", {
                            style: {
                              background: "#F8FAFF",
                              padding: "clamp(1rem, 2vw, 1.5rem)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "clamp(0.5rem, 1vw, 1rem)",
                              flexWrap: "wrap",
                            },
                            children: /*#__PURE__*/ _jsxs("div", {
                              children: [
                                /*#__PURE__*/ _jsx("h3", {
                                  style: {
                                    fontSize: "clamp(14px, 2vw, 16px)",
                                    fontWeight: 600,
                                    color: "#1A1A2E",
                                    marginBottom: "clamp(4px, 1vw, 6px)",
                                    wordBreak: "break-word",
                                  },
                                  children: cv.fullName || "Untitled CV",
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                  style: {
                                    fontSize: "clamp(11px, 1.5vw, 12px)",
                                    color: "#718096",
                                  },
                                  children: new Date(
                                    cv.updatedAt,
                                  ).toLocaleDateString(),
                                }),
                              ],
                            }),
                          }),
                          /*#__PURE__*/ _jsx("div", {
                            style: {
                              padding: "clamp(0.75rem, 2vw, 1rem)",
                              background: "white",
                              borderTop: "1px solid #E2E8F0",
                              display: "flex",
                              gap: "clamp(6px, 1.5vw, 8px)",
                            },
                            children: [
                              /*#__PURE__*/ _jsx("button", {
                                onClick: () => handleOpen(cv),
                                style: {
                                  flex: 1,
                                  background: "#E53E3E",
                                  color: "white",
                                  border: "none",
                                  padding: "clamp(6px, 1.5vw, 8px)",
                                  borderRadius: 6,
                                  fontSize: "clamp(11px, 1.5vw, 12px)",
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  transition: "all 0.2s",
                                  whiteSpace: "nowrap",
                                },
                                onMouseEnter: (e) =>
                                  (e.target.style.background = "#C53030"),
                                onMouseLeave: (e) =>
                                  (e.target.style.background = "#E53E3E"),
                                children: "Edit",
                              }),
                              /*#__PURE__*/ _jsx("button", {
                                onClick: () => handleDelete(cv.id),
                                style: {
                                  background: "transparent",
                                  border: "1px solid #E2E8F0",
                                  color: "#718096",
                                  padding: "clamp(6px, 1.5vw, 8px)",
                                  borderRadius: 6,
                                  fontSize: "clamp(11px, 1.5vw, 12px)",
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  transition: "all 0.2s",
                                },
                                onMouseEnter: (e) => {
                                  e.target.style.borderColor = "#E53E3E";
                                  e.target.style.color = "#E53E3E";
                                },
                                onMouseLeave: (e) => {
                                  e.target.style.borderColor = "#E2E8F0";
                                  e.target.style.color = "#718096";
                                },
                                children: "Delete",
                              }),
                            ],
                          }),
                        ],
                      },
                      cv.id,
                    ),
                  ),
                }),
        ],
      }),
    ],
  });
}
