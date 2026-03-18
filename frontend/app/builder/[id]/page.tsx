'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCVStore } from '@/store/cvStore';
import { cvAPI, pdfAPI } from '@/lib/api';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useAtsScore } from '@/hooks/useAtsScore';
import Sidebar from '@/components/layout/Sidebar';
import FormPanel from '@/components/builder/FormPanel';
import PreviewPanel from '@/components/preview/PreviewPanel';

export default function BuilderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token, cv, setCV, isSaving } = useCVStore();
  const [loading, setLoading] = useState(true);

  // Register global hooks
  useAutoSave();
  useAtsScore();

  useEffect(() => {
    if (!token) { router.replace('/auth/login'); return; }
    // If the store already has this CV loaded, skip the fetch
    if (cv.id === params.id) { setLoading(false); return; }
    cvAPI.get(params.id)
      .then(res => { setCV(res.data.data); })
      .catch(() => router.replace('/dashboard'))
      .finally(() => setLoading(false));
  }, [params.id, token]); // eslint-disable-line

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1A1A2E', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans', sans-serif" }}>
        Loading CV…
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />
      <FormPanel onExport={() => pdfAPI.download(cv.id!)} />
      <PreviewPanel />
    </div>
  );
}
