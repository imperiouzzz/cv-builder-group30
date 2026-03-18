'use client';
import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { Field, Input, Textarea, Grid, StepHeader, Desc, WritingTips, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import type { WorkEntry } from '@/types/cv.types';

function uid() { return Math.random().toString(36).slice(2); }

export default function WorkStep() {
  const { cv, setCVField } = useCVStore();
  const [activeTab, setActiveTab] = useState<'work' | 'leadership'>('work');

  function addEntry() {
    setCVField('workExp', [...cv.workExp, { id: uid(), title: '', company: '', location: '', startDate: '', endDate: '', description: '' }]);
  }
  function removeEntry(id: string) {
    setCVField('workExp', cv.workExp.filter(e => e.id !== id));
  }
  function updateEntry(id: string, key: keyof WorkEntry, value: string) {
    setCVField('workExp', cv.workExp.map(e => e.id === id ? { ...e, [key]: value } : e));
  }

  return (
    <>
      <StepHeader title="Work Experience" step={4} total={9} />

      {/* Tab row */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: 14 }}>
        {(['work', 'leadership'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 16px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            border: 'none', background: 'none', fontFamily: "'DM Sans', sans-serif",
            borderBottom: activeTab === tab ? '2px solid #E53E3E' : '2px solid transparent',
            color: activeTab === tab ? '#E53E3E' : '#718096', marginBottom: -1,
          }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <WritingTips tips={[
        'Accomplished X by implementing Y which led to Z',
        'Increased performance by 40% through optimization',
        'Led a team of 5 engineers to deliver the project on time',
        'Reduced API response time by 60% using caching',
      ]} />

      <Desc>Start with your most recent position. Use bullet points for achievements.</Desc>

      {cv.workExp.length === 0
        ? <EmptyState icon="💼" text="No positions added yet. Click below to add your first role." />
        : cv.workExp.map((e, i) => (
            <EntryCard key={e.id} title={`Position #${i + 1}`} onDelete={() => removeEntry(e.id!)}>
              <Grid>
                <Field label="Job Title">
                  <Input placeholder="e.g. Intern, Software Engineer" value={e.title} onChange={ev => updateEntry(e.id!, 'title', ev.target.value)} />
                </Field>
                <Field label="Company / Organisation">
                  <Input placeholder="e.g. Bsystems Limited, Fidelity Bank" value={e.company} onChange={ev => updateEntry(e.id!, 'company', ev.target.value)} />
                </Field>
              </Grid>
              <Grid cols={3}>
                <Field label="Location">
                  <Input placeholder="Accra, Ghana or Remote" value={e.location} onChange={ev => updateEntry(e.id!, 'location', ev.target.value)} />
                </Field>
                <Field label="Start Date">
                  <Input placeholder="September 2024" value={e.startDate} onChange={ev => updateEntry(e.id!, 'startDate', ev.target.value)} />
                </Field>
                <Field label="End Date">
                  <Input placeholder="October 2024 or Present" value={e.endDate} onChange={ev => updateEntry(e.id!, 'endDate', ev.target.value)} />
                </Field>
              </Grid>
              <Field label="Key Achievements / Responsibilities" span="full">
                <Textarea
                  placeholder={'• Built and maintained REST APIs using Django REST Framework\n• Reduced page load time by 40% through performance optimisation\n• Collaborated with a team of 5 developers across 3 sprints'}
                  value={e.description}
                  onChange={ev => updateEntry(e.id!, 'description', ev.target.value)}
                  style={{ minHeight: 100 }}
                />
              </Field>
            </EntryCard>
          ))
      }
      <AddButton label="+ Add Position" onClick={addEntry} />
    </>
  );
}
