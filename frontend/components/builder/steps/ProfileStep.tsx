'use client';
import { useCVStore } from '@/store/cvStore';
import { Field, Textarea, StepHeader, Desc, WritingTips } from '../FormPrimitives';

export default function ProfileStep() {
  const { cv, setCVField } = useCVStore();

  return (
    <>
      <StepHeader title="Professional Summary" step={2} total={9} />
      <Desc>A brief overview of your experience and career goals — the first thing recruiters read.</Desc>

      <WritingTips tips={[
        'Start with your title and years of experience',
        'Mention 2–3 key skills or technologies',
        'Include a measurable achievement if possible',
        'Keep it under 4 sentences (100–250 characters ideal)',
      ]} />

      <Field label="Summary / Profile Statement">
        <Textarea
          placeholder="Results-driven Computer Science student at KNUST with hands-on experience in Python, Django REST Framework, TensorFlow, and OpenCV. Strong analytical thinking and collaborative work ethic developed through internships at Bsystems and Fidelity Bank."
          value={cv.summary}
          onChange={e => setCVField('summary', e.target.value)}
          style={{ minHeight: 140 }}
        />
        <span style={{ fontSize: 10, color: cv.summary.length > 450 ? '#E53E3E' : '#718096', marginTop: 4 }}>
          {cv.summary.length} / 500 characters
        </span>
      </Field>
    </>
  );
}
