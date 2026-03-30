'use client';

import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { StepHeader, Desc, TipBox } from '../FormPrimitives';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function uid() {
  return Math.random().toString(36).slice(2);
}
const SUGGESTED = ['Python', 'Django REST Framework', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'MySQL', 'Git', 'Docker', 'Linux', 'REST APIs', 'TensorFlow', 'Postman', 'Figma', 'Microsoft Office', 'Communication', 'Teamwork', 'Problem Solving', 'Leadership'].map(name => ({
  id: uid(),
  name,
  category: 'technical'
}));
export default function SkillsStep() {
  const {
    cv,
    setCVField
  } = useCVStore();
  const [input, setInput] = useState('');
  function addSkill(name) {
    const trimmed = name.trim();
    if (!trimmed || cv.skills.find(s => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    setCVField('skills', [...cv.skills, {
      id: uid(),
      name: trimmed,
      category: 'technical'
    }]);
    setInput('');
  }
  function removeSkill(id) {
    setCVField('skills', cv.skills.filter(s => s.id !== id));
  }
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(input);
    }
    // Comma also triggers add
    if (e.key === ',') {
      e.preventDefault();
      addSkill(input);
    }
  }
  const alreadyAdded = name => cv.skills.some(s => s.name.toLowerCase() === name.toLowerCase());
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(StepHeader, {
      title: "Skills",
      step: 7,
      total: 9
    }), /*#__PURE__*/_jsx(Desc, {
      children: "Add technical skills, tools, soft skills, and languages. These are critical for ATS keyword matching."
    }), /*#__PURE__*/_jsx(TipBox, {
      children: "\uD83D\uDCA1 ATS Tip: Copy skill names directly from job descriptions for the highest match score. Press Enter or comma to add each skill."
    }), /*#__PURE__*/_jsxs("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 16
      },
      children: [/*#__PURE__*/_jsx("input", {
        value: input,
        onChange: e => setInput(e.target.value),
        onKeyDown: handleKeyDown,
        placeholder: "Type a skill and press Enter (e.g. Python, React, Cisco Packet Tracer)\u2026",
        style: {
          flex: 1,
          padding: '8px 12px',
          border: '1px solid #E2E8F0',
          borderRadius: 6,
          fontSize: 13,
          fontFamily: "'DM Sans', sans-serif",
          color: '#2D3748',
          outline: 'none'
        },
        onFocus: e => {
          e.target.style.borderColor = '#E53E3E';
          e.target.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.08)';
        },
        onBlur: e => {
          e.target.style.borderColor = '#E2E8F0';
          e.target.style.boxShadow = 'none';
        }
      }), /*#__PURE__*/_jsx("button", {
        onClick: () => addSkill(input),
        style: {
          padding: '8px 16px',
          background: '#E53E3E',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 12,
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: 'nowrap'
        },
        children: "+ Add"
      })]
    }), cv.skills.length > 0 ? /*#__PURE__*/_jsx("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20
      },
      children: cv.skills.map(s => /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 12px',
          background: 'rgba(229,62,62,0.08)',
          border: '1px solid rgba(229,62,62,0.2)',
          borderRadius: 20,
          fontSize: 12,
          color: '#C53030',
          fontWeight: 500
        },
        children: [s.name, /*#__PURE__*/_jsx("button", {
          onClick: () => removeSkill(s.id),
          style: {
            background: 'none',
            border: 'none',
            color: '#E53E3E',
            cursor: 'pointer',
            fontSize: 14,
            lineHeight: 1,
            padding: 0
          },
          children: "\xD7"
        })]
      }, s.id))
    }) : /*#__PURE__*/_jsx("p", {
      style: {
        fontSize: 12,
        color: '#718096',
        marginBottom: 20
      },
      children: "No skills added yet. Type above or pick from suggestions below."
    }), /*#__PURE__*/_jsxs("div", {
      style: {
        borderTop: '1px solid #E2E8F0',
        paddingTop: 14
      },
      children: [/*#__PURE__*/_jsx("p", {
        style: {
          fontSize: 11,
          fontWeight: 600,
          color: '#718096',
          marginBottom: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        },
        children: "Suggested Skills"
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6
        },
        children: SUGGESTED.map(s => /*#__PURE__*/_jsxs("button", {
          onClick: () => addSkill(s.name),
          disabled: alreadyAdded(s.name),
          style: {
            padding: '4px 12px',
            fontSize: 11,
            borderRadius: 20,
            cursor: alreadyAdded(s.name) ? 'default' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.15s',
            background: alreadyAdded(s.name) ? 'rgba(56,161,105,0.1)' : 'white',
            border: alreadyAdded(s.name) ? '1px solid #38A169' : '1px solid #E2E8F0',
            color: alreadyAdded(s.name) ? '#38A169' : '#718096'
          },
          children: [alreadyAdded(s.name) ? '✓ ' : '+ ', s.name]
        }, s.name))
      })]
    })]
  });
}