'use client';
import { useCVStore } from '@/store/cvStore';
import { Field, Input, Grid, StepHeader, Desc, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import type { VolunteeringEntry } from '@/types/cv.types';

function uid() { return Math.random().toString(36).slice(2); }

export default function VolunteeringStep() {
  const { cv, setCVField } = useCVStore();

  function addEntry() {
    setCVField('volunteering', [...cv.volunteering, { id: uid(), role: '', org: '', period: '', desc: '' }]);
  }
  function removeEntry(id: string) {
    setCVField('volunteering', cv.volunteering.filter(e => e.id !== id));
  }
  function update(id: string, key: keyof VolunteeringEntry, value: string) {
    setCVField('volunteering', cv.volunteering.map(e => e.id === id ? { ...e, [key]: value } : e));
  }

  return (
    <>
      <StepHeader title="Volunteering" step={5} total={9} />
      <Desc>Include community service, NGO work, club leadership, or any unpaid roles that demonstrate values and skills.</Desc>

      {cv.volunteering.length === 0
        ? <EmptyState icon="🤝" text="No volunteering entries added yet." />
        : cv.volunteering.map((e, i) => (
            <EntryCard key={e.id} title={`Activity #${i + 1}`} onDelete={() => removeEntry(e.id!)}>
              <Grid>
                <Field label="Role / Position">
                  <Input placeholder="e.g. Group Leader, Logistics Head" value={e.role} onChange={ev => update(e.id!, 'role', ev.target.value)} />
                </Field>
                <Field label="Organisation">
                  <Input placeholder="e.g. HOSA Camp, MCRC, Red Cross" value={e.org} onChange={ev => update(e.id!, 'org', ev.target.value)} />
                </Field>
              </Grid>
              <Grid>
                <Field label="Period">
                  <Input placeholder="2022 – 2023 or Sep 2023" value={e.period} onChange={ev => update(e.id!, 'period', ev.target.value)} />
                </Field>
                <Field label="Brief Description">
                  <Input placeholder="Led team coordination, managed logistics..." value={e.desc} onChange={ev => update(e.id!, 'desc', ev.target.value)} />
                </Field>
              </Grid>
            </EntryCard>
          ))
      }
      <AddButton label="+ Add Volunteering / Activity" onClick={addEntry} />
    </>
  );
}
