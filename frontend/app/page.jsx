"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCVStore } from "@/store/cvStore";
import { jsx as _jsx } from "react/jsx-runtime";
export default function RootPage() {
  const router = useRouter();
  const token = useCVStore((s) => s.token);
  useEffect(() => {
    router.replace(token ? "/dashboard" : "/auth/login");
  }, [token, router]);
  return /*#__PURE__*/ _jsx("div", {
    style: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#1A1A2E",
      fontFamily: "'DM Sans', sans-serif",
      color: "rgba(255,255,255,0.4)",
      fontSize: "clamp(12px, 3vw, 13px)",
      padding: "1rem",
    },
    children: "Loading\u2026",
  });
}
