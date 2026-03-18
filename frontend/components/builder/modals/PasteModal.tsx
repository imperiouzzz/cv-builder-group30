'use client';
import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { parseCV } from '@/lib/cvParser';

interface Props { onClose: () => void; }

export default function PasteModal({ onClose }: Props) {
  const { cv, setCV } = useCVStore();
  const [text, setText]   = useState('');
  const [filled, setFilled] = useState<string[]>([]);
  const [done, setDone]     = useState(false);

  function handleImport() {
    if (!text.trim()) return;
    const { data, filled: f } = parseCV(text);

    // Merge: only fill fields that are currently empty
    const merged = { ...cv };
    (Object.keys(data) as Array<keyof typeof data>).forEach(key => {
      const val = data[key];
      if (Array.isArray(val)) {
        if ((merged[key] as unknown[]).length === 0 && val.length > 0) {
          (merged as Record<string, unknown>)[key] = val;
        }
      } else if (typeof val === 'string' && val) {
        if (!(merged[key] as string)) (merged as Record<string, unknown>)[key] = val;
      }
    });
    setCV(merged as typeof cv);
    setFilled(f);
    setDone(true);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 28, width: 520, maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>📋 Paste CV Text</h3>
        <p style={{ fontSize: 12, color: '#718096', marginBottom: 16, lineHeight: 1.5 }}>
          Open your existing CV, select all (Ctrl+A), copy (Ctrl+C), then paste below. The parser will detect and fill your name, contact info, education, work history, and skills.
        </p>

        {!done ? (
          <>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={'JOHN KWAME DOE\njohn@example.com | +233 24 123 4567\nlinkedin.com/in/johndoe\n\nEDUCATION\nBSc. Computer Science\nKNUST, Kumasi — 2021–2025\n\nWORK EXPERIENCE\nIntern | Bsystems Limited\nSeptember 2024 – October 2024\n• Built REST APIs using Django REST Framework\n\nSKILLS\n• Python, Django, Git, PostgreSQL, TensorFlow'}
              style={{ width: '100%', minHeight: 220, padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', color: '#2D3748', resize: 'vertical', outline: 'none', marginBottom: 16 }}
              onFocus={e => e.target.style.borderColor = '#E53E3E'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={onClose} style={{ padding: '8px 18px', background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: '#718096' }}>Cancel</button>
              <button onClick={handleImport} disabled={!text.trim()} style={{ padding: '8px 20px', background: text.trim() ? '#E53E3E' : '#E2E8F0', color: text.trim() ? 'white' : '#718096', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: text.trim() ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif" }}>
                Auto-Fill from Text
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ background: '#F0FFF4', border: '1px solid #9AE6B4', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: '#276749', marginBottom: 10 }}>✅ Import complete!</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {filled.length > 0
                  ? filled.map(f => <span key={f} style={{ padding: '3px 10px', background: 'white', border: '1px solid #9AE6B4', borderRadius: 20, fontSize: 11, color: '#276749', fontWeight: 500 }}>✓ {f}</span>)
                  : <p style={{ fontSize: 12, color: '#718096' }}>Nothing was auto-detected. Check that the text includes section headings like EDUCATION, WORK EXPERIENCE, SKILLS.</p>
                }
              </div>
              <p style={{ fontSize: 11, color: '#718096', marginTop: 10 }}>Review each section and edit any fields the parser may have missed.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{ padding: '8px 24px', background: '#E53E3E', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Done, review my CV →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
