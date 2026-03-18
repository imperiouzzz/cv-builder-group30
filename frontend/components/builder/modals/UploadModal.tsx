'use client';
import { useState, useRef } from 'react';
import { useCVStore } from '@/store/cvStore';
import { parseCV } from '@/lib/cvParser';

interface Props { onClose: () => void; }

export default function UploadModal({ onClose }: Props) {
  const setCV = useCVStore(s => s.setCV);
  const cv    = useCVStore(s => s.cv);
  const [status, setStatus] = useState<'idle' | 'reading' | 'done' | 'error'>('idle');
  const [filled, setFilled]  = useState<string[]>([]);
  const [error, setError]    = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function processFile(file: File) {
    if (!file) return;
    setStatus('reading');
    setError('');
    const reader = new FileReader();
    reader.onload = e => {
      try {
        let raw = (e.target?.result as string) || '';
        // Strip PDF/binary noise, keep printable chars
        raw = raw
          .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, ' ')
          .replace(/\(([^)]{1,200})\)/g, '$1 ')
          .replace(/\s{2,}/g, ' ')
          .replace(/ ?\n ?/g, '\n');

        const { data, filled: f } = parseCV(raw);
        // Merge parsed data into current CV (don't overwrite existing non-empty fields)
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
        setStatus('done');
      } catch (err) {
        setStatus('error');
        setError('Could not parse this file. Try copying and pasting the text instead.');
      }
    };
    reader.onerror = () => { setStatus('error'); setError('Failed to read file.'); };
    reader.readAsText(file, 'utf-8');
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 28, width: 460, maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>📤 Upload Your CV</h3>
        <p style={{ fontSize: 12, color: '#718096', marginBottom: 18, lineHeight: 1.5 }}>
          Upload a <strong>.txt</strong> file for best results. PDF and DOCX text extraction is also supported — if results are incomplete, use the Paste option instead.
        </p>

        {status !== 'done' ? (
          <>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? '#E53E3E' : '#E2E8F0'}`,
                borderRadius: 10, padding: 32, textAlign: 'center', cursor: 'pointer',
                background: dragging ? '#FFF5F5' : 'white', marginBottom: 14, transition: 'all 0.15s',
              }}
            >
              <input ref={inputRef} type="file" accept=".txt,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileChange} />
              <div style={{ fontSize: 32, marginBottom: 10 }}>📎</div>
              {status === 'reading'
                ? <><p style={{ fontWeight: 600, color: '#1A1A2E', marginBottom: 4 }}>Reading file…</p><p style={{ fontSize: 12, color: '#718096' }}>Please wait</p></>
                : <><p style={{ fontWeight: 600, color: '#1A1A2E', marginBottom: 4 }}>Click to browse or drag & drop</p><p style={{ fontSize: 12, color: '#718096' }}>Supports TXT, PDF, DOCX — max 10MB</p></>
              }
            </div>
            {error && <div style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#C53030', marginBottom: 12 }}>{error}</div>}
          </>
        ) : (
          /* Success state */
          <div style={{ background: '#F0FFF4', border: '1px solid #9AE6B4', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <p style={{ fontWeight: 600, fontSize: 13, color: '#276749', marginBottom: 10 }}>✅ Import complete!</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {filled.map(f => (
                <span key={f} style={{ padding: '3px 10px', background: 'white', border: '1px solid #9AE6B4', borderRadius: 20, fontSize: 11, color: '#276749', fontWeight: 500 }}>✓ {f}</span>
              ))}
            </div>
            {filled.length === 0 && <p style={{ fontSize: 12, color: '#718096' }}>No sections could be auto-detected — please fill the form manually.</p>}
            <p style={{ fontSize: 11, color: '#718096', marginTop: 10 }}>Review each section carefully — automated parsing may miss details. You can edit any field directly.</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '8px 20px', background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: '#718096' }}>
            {status === 'done' ? 'Done' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
