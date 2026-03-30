'use client';

import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { Field, Input, Textarea, Grid, StepHeader, Desc, WritingTips, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function uid() {
  return Math.random().toString(36).slice(2);
}
export default function WorkStep() {
  const {
    cv,
    setCVField
  } = useCVStore();
  const [activeTab, setActiveTab] = useState('work');
  function addEntry() {
    setCVField('workExp', [...cv.workExp, {
      id: uid(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  }
  function removeEntry(id) {
    setCVField('workExp', cv.workExp.filter(e => e.id !== id));
  }
  function updateEntry(id, key, value) {
    setCVField('workExp', cv.workExp.map(e => e.id === id ? {
      ...e,
      [key]: value
    } : e));
  }
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(StepHeader, {
      title: "Work Experience",
      step: 4,
      total: 9
    }), /*#__PURE__*/_jsx("div", {
      style: {
        display: 'flex',
        borderBottom: '1px solid #E2E8F0',
        marginBottom: 14
      },
      children: ['work', 'leadership'].map(tab => /*#__PURE__*/_jsx("button", {
        onClick: () => setActiveTab(tab),
        style: {
          padding: '8px 16px',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          border: 'none',
          background: 'none',
          fontFamily: "'DM Sans', sans-serif",
          borderBottom: activeTab === tab ? '2px solid #E53E3E' : '2px solid transparent',
          color: activeTab === tab ? '#E53E3E' : '#718096',
          marginBottom: -1
        },
        children: tab.charAt(0).toUpperCase() + tab.slice(1)
      }, tab))
    }), /*#__PURE__*/_jsx(WritingTips, {
      tips: ['Accomplished X by implementing Y which led to Z', 'Increased performance by 40% through optimization', 'Led a team of 5 engineers to deliver the project on time', 'Reduced API response time by 60% using caching']
    }), /*#__PURE__*/_jsx(Desc, {
      children: "Start with your most recent position. Use bullet points for achievements."
    }), cv.workExp.length === 0 ? /*#__PURE__*/_jsx(EmptyState, {
      icon: "\uD83D\uDCBC",
      text: "No positions added yet. Click below to add your first role."
    }) : cv.workExp.map((e, i) => /*#__PURE__*/_jsxs(EntryCard, {
      title: `Position #${i + 1}`,
      onDelete: () => removeEntry(e.id),
      children: [/*#__PURE__*/_jsxs(Grid, {
        children: [/*#__PURE__*/_jsx(Field, {
          label: "Job Title",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. Intern, Software Engineer",
            value: e.title,
            onChange: ev => updateEntry(e.id, 'title', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "Company / Organisation",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. Bsystems Limited, Fidelity Bank",
            value: e.company,
            onChange: ev => updateEntry(e.id, 'company', ev.target.value)
          })
        })]
      }), /*#__PURE__*/_jsxs(Grid, {
        cols: 3,
        children: [/*#__PURE__*/_jsx(Field, {
          label: "Location",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "Accra, Ghana or Remote",
            value: e.location,
            onChange: ev => updateEntry(e.id, 'location', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "Start Date",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "September 2024",
            value: e.startDate,
            onChange: ev => updateEntry(e.id, 'startDate', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "End Date",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "October 2024 or Present",
            value: e.endDate,
            onChange: ev => updateEntry(e.id, 'endDate', ev.target.value)
          })
        })]
      }), /*#__PURE__*/_jsx(Field, {
        label: "Key Achievements / Responsibilities",
        span: "full",
        children: /*#__PURE__*/_jsx(Textarea, {
          placeholder: '• Built and maintained REST APIs using Django REST Framework\n• Reduced page load time by 40% through performance optimisation\n• Collaborated with a team of 5 developers across 3 sprints',
          value: e.description,
          onChange: ev => updateEntry(e.id, 'description', ev.target.value),
          style: {
            minHeight: 100
          }
        })
      })]
    }, e.id)), /*#__PURE__*/_jsx(AddButton, {
      label: "+ Add Position",
      onClick: addEntry
    })]
  });
}