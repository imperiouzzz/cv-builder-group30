'use client';
import type React from 'react';
import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import type { SectionKey } from '@/types/cv.types';

interface Props { onClose: () => void; }

const SECTION_LABELS: Record<SectionKey, string> = {
  summary:      'Professional Summary',
  education:    'Education',
  work:         'Work Experience',
  projects:     'Projects & Research',
  volunteering: 'Volunteering',
  skills:       'Skills',
  references:   'References',
  custom:       'Custom Sections',
};

// All valid section keys — used as fallback if sectionOrder is missing or malformed
const DEFAULT_ORDER: SectionKey[] = [
  'summary', 'education', 'work', 'projects', 'volunteering', 'skills', 'references', 'custom',
];

/** Safely parse sectionOrder regardless of whether it arrived as an array or JSON string */
function parseSectionOrder(raw: unknown): SectionKey[] {
  try {
    // Already a proper array
    if (Array.isArray(raw) && raw.length > 0) return raw as SectionKey[];
    // Prisma Json field comes back as a JSON string when loaded from DB
    if (typeof raw === 'string') {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as SectionKey[];
    }
  } catch (_) {}
  return DEFAULT_ORDER;
}

export default function OrderModal({ onClose }: Props) {
  const { cv, setCVField } = useCVStore();

  // Parse defensively — sectionOrder may be a JSON string from the DB
  const [order, setOrder] = useState<SectionKey[]>(() => parseSectionOrder(cv.sectionOrder));
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  function handleDragStart(i: number) { setDragIdx(i); }

  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverIdx(i);
  }

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const next = [...order];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    setOrder(next);
    setDragIdx(null);
    setOverIdx(null);
  }

  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...order];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setOrder(next);
  }

  function moveDown(i: number) {
    if (i === order.length - 1) return;
    const next = [...order];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setOrder(next);
  }

  function save() {
    setCVField('sectionOrder', order);
    onClose();
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 28,
        width: 440, maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>
          ⚙ Reorder CV Sections
        </h3>
        <p style={{ fontSize: 12, color: '#718096', marginBottom: 18, lineHeight: 1.5 }}>
          Drag items or use the arrows to change the order sections appear in your CV.
        </p>

        <div>
          {order.map((key, i) => (
            <div
              key={key}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={e => handleDragOver(e, i)}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 8, marginBottom: 6,
                cursor: 'grab', fontSize: 13, fontWeight: 500,
                userSelect: 'none',
                transition: 'background 0.1s, border 0.1s',
                border: overIdx === i && dragIdx !== i
                  ? '2px solid #E53E3E'
                  : '1px solid #E2E8F0',
                background: dragIdx === i
                  ? 'rgba(229,62,62,0.05)'
                  : overIdx === i && dragIdx !== i
                    ? '#FFF5F5'
                    : 'white',
                opacity: dragIdx === i ? 0.45 : 1,
              }}
            >
              {/* Drag handle */}
              <span style={{ fontSize: 18, color: '#718096', cursor: 'grab', lineHeight: 1 }}>⠿</span>

              {/* Section name */}
              <span style={{ flex: 1, color: '#2D3748' }}>
                {SECTION_LABELS[key] ?? key}
              </span>

              {/* Arrow buttons */}
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  title="Move up"
                  style={{
                    padding: '3px 8px', border: '1px solid #E2E8F0', borderRadius: 4,
                    background: 'none', fontSize: 12, lineHeight: 1,
                    cursor: i === 0 ? 'not-allowed' : 'pointer',
                    color: i === 0 ? '#E2E8F0' : '#718096',
                  }}
                >↑</button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === order.length - 1}
                  title="Move down"
                  style={{
                    padding: '3px 8px', border: '1px solid #E2E8F0', borderRadius: 4,
                    background: 'none', fontSize: 12, lineHeight: 1,
                    cursor: i === order.length - 1 ? 'not-allowed' : 'pointer',
                    color: i === order.length - 1 ? '#E2E8F0' : '#718096',
                  }}
                >↓</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: '#718096' }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            style={{ padding: '8px 22px', background: '#E53E3E', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
}
