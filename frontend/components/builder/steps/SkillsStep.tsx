'use client';
import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { StepHeader, Desc, TipBox } from '../FormPrimitives';
import type { Skill } from '@/types/cv.types';

function uid() { return Math.random().toString(36).slice(2); }

const SUGGESTED: Skill[] = [
  'Python','Django REST Framework','JavaScript','TypeScript','React','Node.js',
  'PostgreSQL','MySQL','Git','Docker','Linux','REST APIs','TensorFlow','Postman',
  'Figma','Microsoft Office','Communication','Teamwork','Problem Solving','Leadership',
].map(name => ({ id: uid(), name, category: 'technical' as const }));

export default function SkillsStep() {
  const { cv, setCVField } = useCVStore();
  const [input, setInput] = useState('');

  function addSkill(name: string) {
    const trimmed = name.trim();
    if (!trimmed || cv.skills.find(s => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    setCVField('skills', [...cv.skills, { id: uid(), name: trimmed, category: 'technical' }]);
    setInput('');
  }

  function removeSkill(id: string) {
    setCVField('skills', cv.skills.filter(s => s.id !== id));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(input); }
    // Comma also triggers add
    if (e.key === ',') { e.preventDefault(); addSkill(input); }
  }

  const alreadyAdded = (name: string) => cv.skills.some(s => s.name.toLowerCase() === name.toLowerCase());

  return (
    <>
      <StepHeader title="Skills" step={7} total={9} />
      <Desc>Add technical skills, tools, soft skills, and languages. These are critical for ATS keyword matching.</Desc>
      <TipBox>💡 ATS Tip: Copy skill names directly from job descriptions for the highest match score. Press Enter or comma to add each skill.</TipBox>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter (e.g. Python, React, Cisco Packet Tracer)…"
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: '#2D3748', outline: 'none' }}
          onFocus={e => { e.target.style.borderColor = '#E53E3E'; e.target.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.08)'; }}
          onBlur={e  => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
        />
        <button
          onClick={() => addSkill(input)}
          style={{ padding: '8px 16px', background: '#E53E3E', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}
        >
          + Add
        </button>
      </div>

      {/* Skills tags */}
      {cv.skills.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {cv.skills.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(229,62,62,0.08)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: 20, fontSize: 12, color: '#C53030', fontWeight: 500 }}>
              {s.name}
              <button onClick={() => removeSkill(s.id!)} style={{ background: 'none', border: 'none', color: '#E53E3E', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 12, color: '#718096', marginBottom: 20 }}>No skills added yet. Type above or pick from suggestions below.</p>
      )}

      {/* Suggested skills */}
      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#718096', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suggested Skills</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SUGGESTED.map(s => (
            <button
              key={s.name}
              onClick={() => addSkill(s.name)}
              disabled={alreadyAdded(s.name)}
              style={{
                padding: '4px 12px', fontSize: 11, borderRadius: 20, cursor: alreadyAdded(s.name) ? 'default' : 'pointer',
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
                background: alreadyAdded(s.name) ? 'rgba(56,161,105,0.1)' : 'white',
                border: alreadyAdded(s.name) ? '1px solid #38A169' : '1px solid #E2E8F0',
                color: alreadyAdded(s.name) ? '#38A169' : '#718096',
              }}
            >
              {alreadyAdded(s.name) ? '✓ ' : '+ '}{s.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
