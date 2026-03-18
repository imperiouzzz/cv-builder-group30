'use client';
import { useCVStore } from '@/store/cvStore';
import { Field, Input, Grid, StepHeader, Desc, TipBox, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import type { ReferenceEntry } from '@/types/cv.types';

function uid() { return Math.random().toString(36).slice(2); }

export default function ReferencesStep() {
  const { cv, setCVField } = useCVStore();

  function addEntry() {
    setCVField('references', [...cv.references, { id: uid(), name: '', title: '', org: '', email: '', phone: '' }]);
  }
  function removeEntry(id: string) {
    setCVField('references', cv.references.filter(e => e.id !== id));
  }
  function update(id: string, key: keyof ReferenceEntry, value: string) {
    setCVField('references', cv.references.map(e => e.id === id ? { ...e, [key]: value } : e));
  }

  return (
    <>
      <StepHeader title="References" step={8} total={9} />
      <Desc>Add professional references who can vouch for your skills and work ethic.</Desc>
      <TipBox>💡 Always ask permission before listing someone as a reference. Provide at least 2 references — one academic and one professional.</TipBox>

      {cv.references.length === 0
        ? <EmptyState icon="👤" text="No references added yet. Click below to add your first referee." />
        : cv.references.map((e, i) => (
            <EntryCard key={e.id} title={`Referee #${i + 1}`} onDelete={() => removeEntry(e.id!)}>
              <Grid>
                <Field label="Full Name">
                  <Input placeholder="e.g. Abiola Olabiyi" value={e.name} onChange={ev => update(e.id!, 'name', ev.target.value)} />
                </Field>
                <Field label="Job Title">
                  <Input placeholder="e.g. System Administrator, Software Developer" value={e.title} onChange={ev => update(e.id!, 'title', ev.target.value)} />
                </Field>
              </Grid>
              <Grid>
                <Field label="Organisation">
                  <Input placeholder="e.g. Fidelity Bank Ghana, Bsystems Limited" value={e.org} onChange={ev => update(e.id!, 'org', ev.target.value)} />
                </Field>
                <Field label="Email">
                  <Input type="email" placeholder="referee@company.com" value={e.email} onChange={ev => update(e.id!, 'email', ev.target.value)} />
                </Field>
              </Grid>
              <Grid>
                <Field label="Phone">
                  <Input placeholder="+233 50 160 3188" value={e.phone} onChange={ev => update(e.id!, 'phone', ev.target.value)} />
                </Field>
              </Grid>
            </EntryCard>
          ))
      }
      <AddButton label="+ Add Reference" onClick={addEntry} />
    </>
  );
}
