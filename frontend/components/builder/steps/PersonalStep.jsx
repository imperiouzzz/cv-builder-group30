'use client';

import { useCVStore } from '@/store/cvStore';
import { Field, Input, Grid, StepHeader, Desc } from '../FormPrimitives';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export default function PersonalStep() {
  const {
    cv,
    setCVField
  } = useCVStore();
  const set = k => e => setCVField(k, e.target.value);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(StepHeader, {
      title: "Personal Information",
      step: 1,
      total: 9
    }), /*#__PURE__*/_jsx(Desc, {
      children: "This appears at the top of your resume. Use your professional name and a reliable contact email."
    }), /*#__PURE__*/_jsxs(Grid, {
      children: [/*#__PURE__*/_jsx(Field, {
        label: "Full Name",
        required: true,
        hint: "As it appears on official documents",
        children: /*#__PURE__*/_jsx(Input, {
          placeholder: "e.g. Okang-Mensah Maurus",
          value: cv.fullName,
          onChange: set('fullName')
        })
      }), /*#__PURE__*/_jsx(Field, {
        label: "Job Title / Professional Title",
        hint: "Your current or target role",
        children: /*#__PURE__*/_jsx(Input, {
          placeholder: "e.g. Backend Developer, Software Engineer",
          value: cv.jobTitle,
          onChange: set('jobTitle')
        })
      })]
    }), /*#__PURE__*/_jsxs(Grid, {
      children: [/*#__PURE__*/_jsx(Field, {
        label: "Email",
        required: true,
        children: /*#__PURE__*/_jsx(Input, {
          type: "email",
          placeholder: "you@example.com",
          value: cv.email,
          onChange: set('email')
        })
      }), /*#__PURE__*/_jsx(Field, {
        label: "Phone",
        hint: "Include country code (e.g. +233)",
        children: /*#__PURE__*/_jsx(Input, {
          placeholder: "+233 55 360 3362",
          value: cv.phone,
          onChange: set('phone')
        })
      })]
    }), /*#__PURE__*/_jsxs(Grid, {
      children: [/*#__PURE__*/_jsx(Field, {
        label: "LinkedIn",
        children: /*#__PURE__*/_jsx(Input, {
          placeholder: "https://linkedin.com/in/yourname",
          value: cv.linkedin,
          onChange: set('linkedin')
        })
      }), /*#__PURE__*/_jsx(Field, {
        label: "Portfolio / GitHub",
        children: /*#__PURE__*/_jsx(Input, {
          placeholder: "https://github.com/yourname",
          value: cv.github,
          onChange: set('github')
        })
      })]
    })]
  });
}