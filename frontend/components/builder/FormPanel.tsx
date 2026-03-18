'use client';

import { useCVStore } from '@/store/cvStore';
import PersonalStep from './steps/PersonalStep';
import ProfileStep from './steps/ProfileStep';
import EducationStep from './steps/EducationStep';
import WorkStep from './steps/WorkStep';
import VolunteeringStep from './steps/VolunteeringStep';
import ProjectsStep from './steps/ProjectsStep';
import SkillsStep from './steps/SkillsStep';
import ReferencesStep from './steps/ReferencesStep';
import CustomStep from './steps/CustomStep';
import UploadModal from './modals/UploadModal';
import PasteModal from './modals/PasteModal';
import OrderModal from './modals/OrderModal';
import JobMatchModal from './modals/JobMatchModal';
import FinishScreen from './FinishScreen';
import { useState } from 'react';

const STEPS = [
  'Personal','Profile','Education','Work Experience',
  'Volunteering','Projects & Research','Skills','References','Custom',
];

const STEP_COMPONENTS = [
  PersonalStep, ProfileStep, EducationStep, WorkStep,
  VolunteeringStep, ProjectsStep, SkillsStep, ReferencesStep, CustomStep,
];

interface Props { onExport: () => void; }

export default function FormPanel({ onExport }: Props) {
  const { currentStep, setCurrentStep } = useCVStore();
  const [finished, setFinished]   = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showPaste, setShowPaste]   = useState(false);
  const [showOrder, setShowOrder]   = useState(false);
  const [showJobMatch, setShowJobMatch] = useState(false);

  const StepComponent = STEP_COMPONENTS[currentStep];

  function isStepDone(cv: ReturnType<typeof useCVStore.getState>['cv'], i: number) {
    if (i === 0) return cv.fullName.length > 0;
    if (i === 1) return cv.summary.length > 0;
    if (i === 2) return cv.education.length > 0;
    if (i === 3) return cv.workExp.length > 0;
    if (i === 4) return cv.volunteering.length > 0;
    if (i === 5) return cv.projects.length > 0;
    if (i === 6) return cv.skills.length > 0;
    if (i === 7) return cv.references.length > 0;
    return false;
  }

  const { cv } = useCVStore();

  return (
    <div style={{ flex: 1, background: '#F8FAFF', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      {/* Topbar */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 20px', height: 48, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Step pills */}
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', flex: 1 }}>
          {STEPS.map((s, i) => {
            const done   = isStepDone(cv, i) && i !== currentStep;
            const active = i === currentStep;
            return (
              <button key={i} onClick={() => { setFinished(false); setCurrentStep(i); }} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 20,
                fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500, transition: 'all 0.15s',
                border: done ? '1px solid #38A169' : '1px solid transparent',
                background: active ? '#E53E3E' : 'transparent',
                color: active ? 'white' : done ? '#38A169' : '#718096',
              }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, background: active ? 'rgba(255,255,255,0.3)' : done ? '#38A169' : 'rgba(0,0,0,0.1)', color: active || done ? 'white' : 'inherit' }}>
                  {done ? '✓' : i + 1}
                </span>
                {s}
              </button>
            );
          })}
        </div>
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <Btn onClick={() => setShowUpload(true)}>📤 Upload</Btn>
          <Btn onClick={() => setShowPaste(true)}>📋 Paste</Btn>
          <Btn onClick={() => setShowOrder(true)}>⚙ Order</Btn>
          <Btn onClick={() => setShowJobMatch(true)}>🎯 Job Match</Btn>
          <Btn primary onClick={onExport}>📥 Export PDF</Btn>
        </div>
      </div>

      {/* Main body */}
      {finished ? (
        <FinishScreen onEdit={() => setFinished(false)} onExport={onExport} />
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            <StepComponent />
          </div>
          {/* Footer nav */}
          <div style={{ background: 'white', borderTop: '1px solid #E2E8F0', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: '#718096' }}>Step {currentStep + 1} of {STEPS.length}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {currentStep > 0 && <Btn onClick={() => setCurrentStep(currentStep - 1)}>← Previous</Btn>}
              <Btn primary onClick={() => {
                if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
                else setFinished(true);
              }}>
                {currentStep === STEPS.length - 1 ? 'Finish ✓' : 'Next →'}
              </Btn>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {showUpload   && <UploadModal   onClose={() => setShowUpload(false)}   />}
      {showPaste    && <PasteModal    onClose={() => setShowPaste(false)}    />}
      {showOrder    && <OrderModal    onClose={() => setShowOrder(false)}    />}
      {showJobMatch && <JobMatchModal onClose={() => setShowJobMatch(false)} />}
    </div>
  );
}

function Btn({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6,
      fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
      transition: 'all 0.15s',
      background: primary ? '#E53E3E' : 'white',
      border: primary ? '1px solid #E53E3E' : '1px solid #E2E8F0',
      color: primary ? 'white' : '#2D3748',
    }}>
      {children}
    </button>
  );
}
