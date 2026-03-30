import "./globals.css";
import { jsx as _jsx } from "react/jsx-runtime";
export const metadata = {
  title: "CV Builder — Group 30 KNUST",
  description: "Build a professional, ATS-optimized CV in minutes.",
  viewport:
    "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes",
};
export default function RootLayout({ children }) {
  return /*#__PURE__*/ _jsx("html", {
    lang: "en",
    children: /*#__PURE__*/ _jsx("body", {
      children: children,
    }),
  });
}
