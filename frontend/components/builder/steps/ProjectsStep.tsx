'use client';
import { useCVStore } from '@/store/cvStore';
import { Field, Input, Textarea, Grid, StepHeader, Desc, TipBox, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import type { ProjectEntry } from '@/types/cv.types';

function uid() { return Math.random().toString(36).slice(2); }

export default function ProjectsStep() {
  const { cv, setCVField } = useCVStore();

  function addEntry() {
    setCVField('projects', [...cv.projects, { id: uid(), name: '', tech: '', period: '', description: '', link: '' }]);
  }
  function removeEntry(id: string) {
    setCVField('projects', cv.projects.filter(e => e.id !== id));
  }
  function update(id: string, key: keyof ProjectEntry, value: string) {
    setCVField('projects', cv.projects.map(e => e.id === id ? { ...e, [key]: value } : e));
  }

  return (
    <>
      <StepHeader title="Projects & Research" step={6} total={9} />
      <Desc>Showcase academic projects, personal builds, or research that demonstrates your technical skills.</Desc>
      <TipBox>💡 ATS Tip: Include the exact technology names used (e.g. "TensorFlow", "Django REST Framework") — these are keywords recruiters search for.</TipBox>

      {cv.projects.length === 0
        ? <EmptyState icon="🛠" text="No projects added yet. Click below to showcase your work." />
        : cv.projects.map((e, i) => (
            <EntryCard key={e.id} title={`Project #${i + 1}`} onDelete={() => removeEntry(e.id!)}>
              <Grid>
                <Field label="Project Name">
                  <Input placeholder="e.g. Facial Recognition System, CV Builder App" value={e.name} onChange={ev => update(e.id!, 'name', ev.target.value)} />
                </Field>
                <Field label="Technologies Used">
                  <Input placeholder="e.g. Python, TensorFlow, OpenCV, Django" value={e.tech} onChange={ev => update(e.id!, 'tech', ev.target.value)} />
                </Field>
              </Grid>
              <Grid>
                <Field label="Period">
                  <Input placeholder="Mar 2025 or 2024 – Present" value={e.period} onChange={ev => update(e.id!, 'period', ev.target.value)} />
                </Field>
                <Field label="Project Link (optional)">
                  <Input placeholder="https://github.com/username/project" value={e.link} onChange={ev => update(e.id!, 'link', ev.target.value)} />
                </Field>
              </Grid>
              <Field label="Description" span="full">
                <Textarea
                  placeholder="Describe what the project does, your specific contributions, and any results or metrics achieved."
                  value={e.description}
                  onChange={ev => update(e.id!, 'description', ev.target.value)}
                />
              </Field>
            </EntryCard>
          ))
      }
      <AddButton label="+ Add Project" onClick={addEntry} />
    </>
  );
}
