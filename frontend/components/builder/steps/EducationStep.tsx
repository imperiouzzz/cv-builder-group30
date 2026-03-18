'use client';
import { useCVStore } from '@/store/cvStore';
import { Field, Input, Grid, StepHeader, Desc, TipBox, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import type { EducationEntry } from '@/types/cv.types';

function uid() { return Math.random().toString(36).slice(2); }

export default function EducationStep() {
  const { cv, setCVField } = useCVStore();

  function addEntry() {
    setCVField('education', [...cv.education, { id: uid(), degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '', achievements: '' }]);
  }

  function removeEntry(id: string) {
    setCVField('education', cv.education.filter(e => e.id !== id));
  }

  function updateEntry(id: string, key: keyof EducationEntry, value: string) {
    setCVField('education', cv.education.map(e => e.id === id ? { ...e, [key]: value } : e));
  }

  return (
    <>
      <StepHeader title="Education" step={3} total={9} />
      <Desc>Add your qualifications starting with the most recent.</Desc>
      <TipBox>💡 Include GPA only if it&apos;s 3.0+ or First/Second Class. Add relevant coursework for entry-level roles.</TipBox>

      {cv.education.length === 0
        ? <EmptyState icon="📚" text="No education added yet. Click below to add your first qualification." />
        : cv.education.map((e, i) => (
            <EntryCard key={e.id} title={`Education #${i + 1}`} onDelete={() => removeEntry(e.id!)}>
              <Grid>
                <Field label="Degree & Major" required>
                  <Input placeholder="e.g. BSc. Computer Science" value={e.degree} onChange={ev => updateEntry(e.id!, 'degree', ev.target.value)} />
                </Field>
                <Field label="Institution" required>
                  <Input placeholder="e.g. KNUST, University of Ghana" value={e.institution} onChange={ev => updateEntry(e.id!, 'institution', ev.target.value)} />
                </Field>
              </Grid>
              <Grid cols={3}>
                <Field label="Location">
                  <Input placeholder="Kumasi, Ghana" value={e.location} onChange={ev => updateEntry(e.id!, 'location', ev.target.value)} />
                </Field>
                <Field label="Start Date">
                  <Input placeholder="Sep 2021" value={e.startDate} onChange={ev => updateEntry(e.id!, 'startDate', ev.target.value)} />
                </Field>
                <Field label="End Date">
                  <Input placeholder="Sep 2027 or Expected" value={e.endDate} onChange={ev => updateEntry(e.id!, 'endDate', ev.target.value)} />
                </Field>
              </Grid>
              <Grid>
                <Field label="GPA (Optional)">
                  <Input placeholder="e.g. 3.8/4.0 or First Class" value={e.gpa} onChange={ev => updateEntry(e.id!, 'gpa', ev.target.value)} />
                </Field>
                <Field label="Achievements / Coursework">
                  <Input placeholder="Dean's List, Data Structures, Algorithms..." value={e.achievements} onChange={ev => updateEntry(e.id!, 'achievements', ev.target.value)} />
                </Field>
              </Grid>
            </EntryCard>
          ))
      }
      <AddButton label="+ Add Education" onClick={addEntry} />
    </>
  );
}
