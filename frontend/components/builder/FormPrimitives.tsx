import React from 'react';

// ── Field wrapper ────────────────────────────────────────────
interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  span?: 'full';
}
export function Field({ label, required, hint, children, span }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: span === 'full' ? '1 / -1' : undefined }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#2D3748', display: 'flex', gap: 4 }}>
        {label}
        {required && <span style={{ color: '#E53E3E' }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: 10, color: '#718096' }}>{hint}</span>}
    </div>
  );
}

// ── Text input ───────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export function Input(props: InputProps) {
  return (
    <input
      {...props}
      style={{
        padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: 6,
        fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: '#2D3748',
        background: 'white', outline: 'none', width: '100%',
        transition: 'border 0.15s, box-shadow 0.15s',
        ...(props.style || {}),
      }}
      onFocus={e => { e.target.style.borderColor = '#E53E3E'; e.target.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.08)'; }}
      onBlur={e  => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
    />
  );
}

// ── Textarea ─────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export function Textarea(props: TextareaProps) {
  return (
    <textarea
      {...props}
      style={{
        padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: 6,
        fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: '#2D3748',
        background: 'white', outline: 'none', width: '100%', resize: 'vertical', minHeight: 80,
        transition: 'border 0.15s, box-shadow 0.15s',
        ...(props.style || {}),
      }}
      onFocus={e => { e.target.style.borderColor = '#E53E3E'; e.target.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.08)'; }}
      onBlur={e  => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
    />
  );
}

// ── Two-column grid ──────────────────────────────────────────
export function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12, marginBottom: 12 }}>
      {children}
    </div>
  );
}

// ── Section header ───────────────────────────────────────────
export function StepHeader({ title, step, total }: { title: string; step: number; total?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 600, color: '#1A1A2E' }}>{title}</h2>
      {total && <span style={{ fontSize: 11, color: '#718096' }}>Step {step} of {total}</span>}
    </div>
  );
}

// ── Muted description text ───────────────────────────────────
export function Desc({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 12, color: '#718096', marginBottom: 16, lineHeight: 1.5 }}>{children}</p>;
}

// ── Tip box (blue) ───────────────────────────────────────────
export function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#EBF8FF', border: '1px solid #BEE3F8', borderRadius: 6, padding: '8px 10px', fontSize: 11, color: '#2A69AC', marginBottom: 12 }}>
      {children}
    </div>
  );
}

// ── Writing tips box (yellow) ────────────────────────────────
export function WritingTips({ tips }: { tips: string[] }) {
  return (
    <div style={{ background: '#FFFBF0', border: '1px solid #FAD56A', borderRadius: 8, padding: '10px 12px', marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#744210', marginBottom: 6 }}>💡 Writing Tips</div>
      <ul style={{ listStyle: 'none', fontSize: 11, color: '#7B5E17' }}>
        {tips.map((t, i) => <li key={i} style={{ padding: '1px 0' }}>• {t}</li>)}
      </ul>
    </div>
  );
}

// ── Entry card ───────────────────────────────────────────────
interface EntryCardProps { title: string; onDelete: () => void; children: React.ReactNode; }
export function EntryCard({ title, onDelete, children }: EntryCardProps) {
  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: 14, background: 'white', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1A2E', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#718096', fontSize: 14, cursor: 'grab' }}>⠿</span>
          {title}
        </div>
        <button onClick={onDelete} style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid #FEB2B2', borderRadius: 4, color: '#E53E3E', cursor: 'pointer', fontSize: 12 }}>
          ✕
        </button>
      </div>
      {children}
    </div>
  );
}

// ── Add entry button ─────────────────────────────────────────
export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: 10, border: '1.5px dashed #E2E8F0', borderRadius: 8, background: 'none', color: '#E53E3E', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 8, transition: 'all 0.15s' }}
      onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#FFF5F5'; (e.currentTarget as HTMLElement).style.borderColor = '#E53E3E'; }}
      onMouseOut={e  => { (e.currentTarget as HTMLElement).style.background = 'none';    (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; }}
    >
      {label}
    </button>
  );
}

// ── Empty state ──────────────────────────────────────────────
export function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: 24, color: '#718096', fontSize: 12 }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      {text}
    </div>
  );
}
