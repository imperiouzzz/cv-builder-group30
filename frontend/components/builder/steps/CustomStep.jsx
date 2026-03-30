'use client';

import { useCVStore } from '@/store/cvStore';
import { Field, Input, Textarea, StepHeader, Desc, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function uid() {
  return Math.random().toString(36).slice(2);
}
export default function CustomStep() {
  const {
    cv,
    setCVField
  } = useCVStore();
  function addEntry() {
    setCVField('customSections', [...cv.customSections, {
      id: uid(),
      sectionTitle: '',
      entries: ''
    }]);
  }
  function removeEntry(id) {
    setCVField('customSections', cv.customSections.filter(e => e.id !== id));
  }
  function update(id, key, value) {
    setCVField('customSections', cv.customSections.map(e => e.id === id ? {
      ...e,
      [key]: value
    } : e));
  }
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(StepHeader, {
      title: "Custom Sections",
      step: 9,
      total: 9
    }), /*#__PURE__*/_jsx(Desc, {
      children: "Add any additional sections \u2014 Certifications, Awards, Publications, Languages, Hobbies, etc."
    }), cv.customSections.length === 0 ? /*#__PURE__*/_jsx(EmptyState, {
      icon: "\u2728",
      text: "No custom sections yet. Add certifications, awards, languages, or anything else."
    }) : cv.customSections.map((e, i) => /*#__PURE__*/_jsxs(EntryCard, {
      title: `Section #${i + 1}`,
      onDelete: () => removeEntry(e.id),
      children: [/*#__PURE__*/_jsx(Field, {
        label: "Section Title",
        span: "full",
        children: /*#__PURE__*/_jsx(Input, {
          placeholder: "e.g. Certifications, Awards, Languages, Hobbies",
          value: e.sectionTitle,
          onChange: ev => update(e.id, 'sectionTitle', ev.target.value)
        })
      }), /*#__PURE__*/_jsx(Field, {
        label: "Content",
        span: "full",
        children: /*#__PURE__*/_jsx(Textarea, {
          placeholder: 'List your items here, one per line:\n• AWS Cloud Practitioner — Amazon (2024)\n• Google IT Support Certificate — Coursera (2024)',
          value: e.entries,
          onChange: ev => update(e.id, 'entries', ev.target.value),
          style: {
            minHeight: 100
          }
        })
      })]
    }, e.id)), /*#__PURE__*/_jsx(AddButton, {
      label: "+ Add Custom Section",
      onClick: addEntry
    }), /*#__PURE__*/_jsxs("div", {
      style: {
        marginTop: 24,
        padding: 16,
        background: 'white',
        borderRadius: 10,
        border: '1px solid #E2E8F0'
      },
      children: [/*#__PURE__*/_jsx("div", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: '#1A1A2E',
          marginBottom: 6
        },
        children: "\uD83C\uDF93 Almost done!"
      }), /*#__PURE__*/_jsxs("p", {
        style: {
          fontSize: 11,
          color: '#718096',
          lineHeight: 1.6,
          marginBottom: 10
        },
        children: ["Review your CV in the live preview panel on the right. Click ", /*#__PURE__*/_jsx("strong", {
          children: "Finish \u2713"
        }), " below to complete, or ", /*#__PURE__*/_jsx("strong", {
          children: "Export PDF"
        }), " in the toolbar to download now."]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: '#FFF5F5',
          border: '1px solid rgba(229,62,62,0.2)',
          borderRadius: 6,
          padding: '5px 12px',
          fontSize: 12,
          fontWeight: 700,
          color: '#E53E3E'
        },
        children: ["ATS Score: ", cv.atsScore, "/100"]
      })]
    })]
  });
}