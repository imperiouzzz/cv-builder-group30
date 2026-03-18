'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCVStore } from '@/store/cvStore';

export default function RootPage() {
  const router = useRouter();
  const token  = useCVStore(s => s.token);

  useEffect(() => {
    router.replace(token ? '/dashboard' : '/auth/login');
  }, [token, router]);

  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#1A1A2E',
      fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.4)',
      fontSize: 13,
    }}>
      Loading…
    </div>
  );
}
