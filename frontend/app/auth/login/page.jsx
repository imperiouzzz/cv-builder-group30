"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { useCVStore } from "@/store/cvStore";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function LoginPage() {
  const router = useRouter();
  const setAuth = useCVStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      setAuth(res.data.user, res.data.token);
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  }
  return /*#__PURE__*/ _jsx("div", {
    style: {
      minHeight: "100vh",
      background: "#1A1A2E",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: "clamp(1rem, 4vw, 2rem)",
    },
    children: /*#__PURE__*/ _jsxs("div", {
      style: {
        background: "white",
        borderRadius: "clamp(12px, 3vw, 16px)",
        padding: "clamp(24px, 6vw, 36px)",
        width: "100%",
        maxWidth: "380px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      },
      children: [
        /*#__PURE__*/ _jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "clamp(8px, 2vw, 10px)",
            marginBottom: "clamp(16px, 4vw, 24px)",
          },
          children: [
            /*#__PURE__*/ _jsx("div", {
              style: {
                width: "clamp(28px, 5vw, 32px)",
                height: "clamp(28px, 5vw, 32px)",
                background: "#E53E3E",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "clamp(14px, 2vw, 16px)",
                flexShrink: 0,
              },
              children: "CV",
            }),
            /*#__PURE__*/ _jsx("span", {
              style: {
                fontFamily: "Fraunces, serif",
                fontSize: "clamp(14px, 3vw, 18px)",
                fontWeight: 600,
                color: "#1A1A2E",
              },
              children: "Resume Builder",
            }),
          ],
        }),
        /*#__PURE__*/ _jsx("h1", {
          style: {
            fontFamily: "Fraunces, serif",
            fontSize: "clamp(18px, 4vw, 22px)",
            fontWeight: 600,
            color: "#1A1A2E",
            marginBottom: "clamp(4px, 1vw, 6px)",
          },
          children: "Sign in",
        }),
        /*#__PURE__*/ _jsx("p", {
          style: {
            fontSize: "clamp(12px, 2vw, 13px)",
            color: "#718096",
            marginBottom: "clamp(16px, 4vw, 24px)",
            lineHeight: 1.5,
          },
          children: "Welcome back. Build your career today.",
        }),
        error &&
          /*#__PURE__*/ _jsx("div", {
            style: {
              background: "#FFF5F5",
              border: "1px solid #FEB2B2",
              borderRadius: 8,
              padding: "clamp(8px, 2vw, 10px) clamp(12px, 2vw, 14px)",
              fontSize: "clamp(11px, 2vw, 12px)",
              color: "#C53030",
              marginBottom: "clamp(12px, 2vw, 16px)",
              lineHeight: 1.5,
            },
            children: error,
          }),
        /*#__PURE__*/ _jsxs("form", {
          onSubmit: handleSubmit,
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "clamp(10px, 2vw, 14px)",
          },
          children: [
            /*#__PURE__*/ _jsxs("div", {
              children: [
                /*#__PURE__*/ _jsx("label", {
                  className: "form-label",
                  style: {
                    display: "block",
                    fontSize: "clamp(11px, 2vw, 12px)",
                    fontWeight: 600,
                    marginBottom: "clamp(6px, 1vw, 8px)",
                    color: "#2D3748",
                  },
                  children: "Email",
                }),
                /*#__PURE__*/ _jsx("input", {
                  type: "email",
                  required: true,
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  placeholder: "you@example.com",
                  className: "input-field",
                  style: {
                    fontSize: "clamp(13px, 2vw, 14px)",
                    padding: "clamp(8px, 2vw, 10px)",
                  },
                }),
              ],
            }),
            /*#__PURE__*/ _jsxs("div", {
              children: [
                /*#__PURE__*/ _jsx("label", {
                  className: "form-label",
                  style: {
                    display: "block",
                    fontSize: "clamp(11px, 2vw, 12px)",
                    fontWeight: 600,
                    marginBottom: "clamp(6px, 1vw, 8px)",
                    color: "#2D3748",
                  },
                  children: "Password",
                }),
                /*#__PURE__*/ _jsx("input", {
                  type: "password",
                  required: true,
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  placeholder:
                    "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                  className: "input-field",
                  style: {
                    fontSize: "clamp(13px, 2vw, 14px)",
                    padding: "clamp(8px, 2vw, 10px)",
                  },
                }),
              ],
            }),
            /*#__PURE__*/ _jsx("button", {
              type: "submit",
              disabled: loading,
              style: {
                background: "#E53E3E",
                color: "white",
                border: "none",
                padding: "clamp(10px, 2vw, 11px)",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "clamp(13px, 2vw, 14px)",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: "clamp(2px, 1vw, 4px)",
                transition: "all 0.2s",
              },
              children: loading ? "Signing in…" : "Sign In",
            }),
          ],
        }),
        /*#__PURE__*/ _jsxs("p", {
          style: {
            textAlign: "center",
            marginTop: "clamp(16px, 4vw, 20px)",
            fontSize: "clamp(12px, 2vw, 13px)",
            color: "#718096",
            lineHeight: 1.5,
          },
          children: [
            "Don't have an account?",
            " ",
            /*#__PURE__*/ _jsx(Link, {
              href: "/auth/register",
              style: {
                color: "#E53E3E",
                fontWeight: 600,
                textDecoration: "none",
                transition: "opacity 0.2s",
              },
              children: "Create one",
            }),
          ],
        }),
      ],
    }),
  });
}
