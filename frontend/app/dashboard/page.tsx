'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cvAPI } from '@/lib/api';
import { useCVStore } from '@/store/cvStore';

interface CVSummary {
  id: string;
  title: string;
  atsScore: number;
  template: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router   = useRouter();
  const { token, clearAuth, setCV, resetCV } = useCVStore();
  const [cvs, setCvs]       = useState<CVSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.replace('/auth/login'); return; }
    cvAPI.list()
      .then(res => setCvs(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, router]);

  async function handleCreate() {
    try {
      const res = await cvAPI.create('My CV');
      const newCV = res.data.data;
      setCV(newCV);
      router.push(`/builder/${newCV.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleOpen(cv: CVSummary) {
    try {
      const res = await cvAPI.get(cv.id);
      setCV(res.data.data);
      router.push(`/builder/${cv.id}`);
    } catch (err) { console.error(err); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this CV?')) return;
    await cvAPI.delete(id);
    setCvs(prev => prev.filter(c => c.id !== id));
  }

  function handleLogout() {
    clearAuth();
    router.replace('/auth/login');
  }

  const scoreColor = (s: number) =>
    s >= 70 ? '#38A169' : s >= 40 ? '#D69E2E' : '#E53E3E';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top bar */}
      <header style={{ background: '#16213E', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: '#E53E3E', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>CV</div>
          <span style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>Resume Builder</span>
        </div>
        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          Sign Out
        </button>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, color: '#1A1A2E', fontWeight: 600 }}>My CVs</h1>
            <p style={{ fontSize: 13, color: '#718096', marginTop: 4 }}>Build, edit, and export your ATS-optimized resumes.</p>
          </div>
          <button onClick={handleCreate} style={{ background: '#E53E3E', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            + New CV
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#718096', textAlign: 'center', padding: 40 }}>Loading…</p>
        ) : cvs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <p style={{ fontWeight: 600, color: '#1A1A2E', marginBottom: 8 }}>No CVs yet</p>
            <p style={{ color: '#718096', fontSize: 13, marginBottom: 20 }}>Create your first professional CV</p>
            <button onClick={handleCreate} style={{ background: '#E53E3E', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
              Create CV
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {cvs.map(cv => (
              <div key={cv.id} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#1A1A2E' }}>{cv.title}</p>
                    <p style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>
                      {cv.template.charAt(0).toUpperCase() + cv.template.slice(1)} template · Updated {new Date(cv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ background: '#FFF5F5', border: '1px solid rgba(229,62,62,0.2)', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700, color: scoreColor(cv.atsScore) }}>
                    {cv.atsScore}/100
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleOpen(cv)} style={{ flex: 1, background: '#E53E3E', color: 'white', border: 'none', padding: '7px 0', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cv.id)} style={{ width: 34, background: 'none', border: '1px solid #FEB2B2', borderRadius: 6, color: '#E53E3E', cursor: 'pointer', fontSize: 13 }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
