'use client';

import { useCVStore } from '@/store/cvStore';
import { Field, Textarea, StepHeader, Desc, WritingTips } from '../FormPrimitives';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export default function ProfileStep() {
  const {
    cv,
    setCVField
  } = useCVStore();
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(StepHeader, {
      title: "Professional Summary",
      step: 2,
      total: 9
    }), /*#__PURE__*/_jsx(Desc, {
      children: "A brief overview of your experience and career goals \u2014 the first thing recruiters read."
    }), /*#__PURE__*/_jsx(WritingTips, {
      tips: ['Start with your title and years of experience', 'Mention 2–3 key skills or technologies', 'Include a measurable achievement if possible', 'Keep it under 4 sentences (100–250 characters ideal)']
    }), /*#__PURE__*/_jsxs(Field, {
      label: "Summary / Profile Statement",
      children: [/*#__PURE__*/_jsx(Textarea, {
        placeholder: "Results-driven Computer Science student at KNUST with hands-on experience in Python, Django REST Framework, TensorFlow, and OpenCV. Strong analytical thinking and collaborative work ethic developed through internships at Bsystems and Fidelity Bank.",
        value: cv.summary,
        onChange: e => setCVField('summary', e.target.value),
        style: {
          minHeight: 140
        }
      }), /*#__PURE__*/_jsxs("span", {
        style: {
          fontSize: 10,
          color: cv.summary.length > 450 ? '#E53E3E' : '#718096',
          marginTop: 4
        },
        children: [cv.summary.length, " / 500 characters"]
      })]
    })]
  });
}