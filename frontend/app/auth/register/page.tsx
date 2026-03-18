'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useCVStore } from '@/store/cvStore';

export default function RegisterPage() {
  const router  = useRouter();
  const setAuth = useCVStore(s => s.setAuth);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const res = await authAPI.register(email, password);
      setAuth(res.data.user, res.data.token);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 36, width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, background: '#E53E3E', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>CV</div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 600, color: '#1A1A2E' }}>Resume Builder</span>
        </div>

        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>Create account</h1>
        <p style={{ fontSize: 13, color: '#718096', marginBottom: 24 }}>Start building your professional CV today.</p>

        {error && (
          <div style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#C53030', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
          </div>
          <div>
            <label className="form-label">Password <span style={{ color: '#718096', fontWeight: 400 }}>(min 6 characters)</span></label>
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input-field" />
          </div>
          <div>
            <label className="form-label">Confirm Password</label>
            <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" className="input-field" />
          </div>
          <button
            type="submit" disabled={loading}
            style={{ background: '#E53E3E', color: 'white', border: 'none', padding: '11px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#718096' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#E53E3E', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
