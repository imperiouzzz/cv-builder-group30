'use client';
import { useCVStore } from '@/store/cvStore';
import { Field, Input, Grid, StepHeader, Desc } from '../FormPrimitives';

export default function PersonalStep() {
  const { cv, setCVField } = useCVStore();
  const set = (k: keyof typeof cv) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCVField(k, e.target.value);

  return (
    <>
      <StepHeader title="Personal Information" step={1} total={9} />
      <Desc>This appears at the top of your resume. Use your professional name and a reliable contact email.</Desc>

      <Grid>
        <Field label="Full Name" required hint="As it appears on official documents">
          <Input placeholder="e.g. Okang-Mensah Maurus" value={cv.fullName} onChange={set('fullName')} />
        </Field>
        <Field label="Job Title / Professional Title" hint="Your current or target role">
          <Input placeholder="e.g. Backend Developer, Software Engineer" value={cv.jobTitle} onChange={set('jobTitle')} />
        </Field>
      </Grid>

      <Grid>
        <Field label="Email" required>
          <Input type="email" placeholder="you@example.com" value={cv.email} onChange={set('email')} />
        </Field>
        <Field label="Phone" hint="Include country code (e.g. +233)">
          <Input placeholder="+233 55 360 3362" value={cv.phone} onChange={set('phone')} />
        </Field>
      </Grid>

      <Grid>
        <Field label="LinkedIn">
          <Input placeholder="https://linkedin.com/in/yourname" value={cv.linkedin} onChange={set('linkedin')} />
        </Field>
        <Field label="Portfolio / GitHub">
          <Input placeholder="https://github.com/yourname" value={cv.github} onChange={set('github')} />
        </Field>
      </Grid>
    </>
  );
}
