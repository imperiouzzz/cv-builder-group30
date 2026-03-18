'use client';
import { useCVStore } from '@/store/cvStore';
import { Field, Input, Textarea, StepHeader, Desc, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import type { CustomSection } from '@/types/cv.types';

function uid() { return Math.random().toString(36).slice(2); }

export default function CustomStep() {
  const { cv, setCVField } = useCVStore();

  function addEntry() {
    setCVField('customSections', [...cv.customSections, { id: uid(), sectionTitle: '', entries: '' }]);
  }
  function removeEntry(id: string) {
    setCVField('customSections', cv.customSections.filter(e => e.id !== id));
  }
  function update(id: string, key: keyof CustomSection, value: string) {
    setCVField('customSections', cv.customSections.map(e => e.id === id ? { ...e, [key]: value } : e));
  }

  return (
    <>
      <StepHeader title="Custom Sections" step={9} total={9} />
      <Desc>Add any additional sections — Certifications, Awards, Publications, Languages, Hobbies, etc.</Desc>

      {cv.customSections.length === 0
        ? <EmptyState icon="✨" text="No custom sections yet. Add certifications, awards, languages, or anything else." />
        : cv.customSections.map((e, i) => (
            <EntryCard key={e.id} title={`Section #${i + 1}`} onDelete={() => removeEntry(e.id!)}>
              <Field label="Section Title" span="full">
                <Input placeholder="e.g. Certifications, Awards, Languages, Hobbies" value={e.sectionTitle} onChange={ev => update(e.id!, 'sectionTitle', ev.target.value)} />
              </Field>
              <Field label="Content" span="full">
                <Textarea
                  placeholder={'List your items here, one per line:\n• AWS Cloud Practitioner — Amazon (2024)\n• Google IT Support Certificate — Coursera (2024)'}
                  value={e.entries}
                  onChange={ev => update(e.id!, 'entries', ev.target.value)}
                  style={{ minHeight: 100 }}
                />
              </Field>
            </EntryCard>
          ))
      }
      <AddButton label="+ Add Custom Section" onClick={addEntry} />

      {/* Final summary card */}
      <div style={{ marginTop: 24, padding: 16, background: 'white', borderRadius: 10, border: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>🎓 Almost done!</div>
        <p style={{ fontSize: 11, color: '#718096', lineHeight: 1.6, marginBottom: 10 }}>
          Review your CV in the live preview panel on the right. Click <strong>Finish ✓</strong> below to complete, or <strong>Export PDF</strong> in the toolbar to download now.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFF5F5', border: '1px solid rgba(229,62,62,0.2)', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 700, color: '#E53E3E' }}>
          ATS Score: {cv.atsScore}/100
        </div>
      </div>
    </>
  );
}
