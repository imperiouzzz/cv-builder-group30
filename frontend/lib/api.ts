import axios from "axios";
import type { CVData } from "@/types/cv.types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

// ── Attach JWT to every request ──────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("cv-builder-store");
      if (raw) {
        const { state } = JSON.parse(raw);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch (_) {}
  }
  return config;
});

// ── Redirect to login on 401 ─────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("cv-builder-store");
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  },
);

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (email: string, password: string) =>
    api.post("/auth/register", { email, password }),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

// ── CVs ──────────────────────────────────────────────────────
export const cvAPI = {
  list: () => api.get("/cvs"),
  get: (id: string) => api.get(`/cvs/${id}`),
  create: (title?: string) => api.post("/cvs", { title }),
  save: (id: string, data: Partial<CVData>) => api.put(`/cvs/${id}`, data),
  delete: (id: string) => api.delete(`/cvs/${id}`),
  duplicate: (id: string) => api.post(`/cvs/${id}/duplicate`),
};

// ── ATS ───────────────────────────────────────────────────────
export const atsAPI = {
  score: (cvId: string) => api.post(`/ats/score/${cvId}`),
  match: (cvId: string, jobDescription: string) =>
    api.post(`/ats/match/${cvId}`, { jobDescription }),
};

// ── PDF ───────────────────────────────────────────────────────
export const pdfAPI = {
  /**
   * Downloads the CV as a PDF from the backend (Puppeteer-generated).
   * The blob URL is kept alive long enough for the browser to trigger
   * the download before being released.
   */
  download: async (cvId: string): Promise<void> => {
    try {
      const res = await api.get(`/pdf/${cvId}`, {
        responseType: "blob",
      });

      // Verify we actually got a PDF back
      const contentType = res.headers["content-type"] || "";
      if (!contentType.includes("pdf")) {
        // Backend returned an error JSON as a blob — decode and show it
        const text = await (res.data as Blob).text();
        let msg = "PDF generation failed.";
        try {
          msg = JSON.parse(text).message || msg;
        } catch (_) {}
        alert(`Export failed: ${msg}`);
        return;
      }

      // Create blob URL, trigger download, then revoke after a short delay
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "CV.pdf";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revoke after 10 seconds — long enough for any browser to start the download
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (err: unknown) {
      console.error("[PDF Download]", err);
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      alert(
        message ||
          "Could not generate PDF. Make sure the backend server is running.",
      );
    }
  },

  /**
   * Opens the CV as a PDF in a new browser tab.
   * Useful as an alternative if the download prompt is blocked.
   */
  openInTab: async (cvId: string): Promise<void> => {
    const res = await api.get(`/pdf/${cvId}`, { responseType: "blob" });
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  },
};

export default api;
