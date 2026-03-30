'use client';

import { useCVStore } from '@/store/cvStore';
import { Field, Input, Grid, StepHeader, Desc, TipBox, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function uid() {
  return Math.random().toString(36).slice(2);
}
export default function EducationStep() {
  const {
    cv,
    setCVField
  } = useCVStore();
  function addEntry() {
    setCVField('education', [...cv.education, {
      id: uid(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: ''
    }]);
  }
  function removeEntry(id) {
    setCVField('education', cv.education.filter(e => e.id !== id));
  }
  function updateEntry(id, key, value) {
    setCVField('education', cv.education.map(e => e.id === id ? {
      ...e,
      [key]: value
    } : e));
  }
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(StepHeader, {
      title: "Education",
      step: 3,
      total: 9
    }), /*#__PURE__*/_jsx(Desc, {
      children: "Add your qualifications starting with the most recent."
    }), /*#__PURE__*/_jsx(TipBox, {
      children: "\uD83D\uDCA1 Include GPA only if it's 3.0+ or First/Second Class. Add relevant coursework for entry-level roles."
    }), cv.education.length === 0 ? /*#__PURE__*/_jsx(EmptyState, {
      icon: "\uD83D\uDCDA",
      text: "No education added yet. Click below to add your first qualification."
    }) : cv.education.map((e, i) => /*#__PURE__*/_jsxs(EntryCard, {
      title: `Education #${i + 1}`,
      onDelete: () => removeEntry(e.id),
      children: [/*#__PURE__*/_jsxs(Grid, {
        children: [/*#__PURE__*/_jsx(Field, {
          label: "Degree & Major",
          required: true,
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. BSc. Computer Science",
            value: e.degree,
            onChange: ev => updateEntry(e.id, 'degree', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "Institution",
          required: true,
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. KNUST, University of Ghana",
            value: e.institution,
            onChange: ev => updateEntry(e.id, 'institution', ev.target.value)
          })
        })]
      }), /*#__PURE__*/_jsxs(Grid, {
        cols: 3,
        children: [/*#__PURE__*/_jsx(Field, {
          label: "Location",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "Kumasi, Ghana",
            value: e.location,
            onChange: ev => updateEntry(e.id, 'location', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "Start Date",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "Sep 2021",
            value: e.startDate,
            onChange: ev => updateEntry(e.id, 'startDate', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "End Date",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "Sep 2027 or Expected",
            value: e.endDate,
            onChange: ev => updateEntry(e.id, 'endDate', ev.target.value)
          })
        })]
      }), /*#__PURE__*/_jsxs(Grid, {
        children: [/*#__PURE__*/_jsx(Field, {
          label: "GPA (Optional)",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. 3.8/4.0 or First Class",
            value: e.gpa,
            onChange: ev => updateEntry(e.id, 'gpa', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "Achievements / Coursework",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "Dean's List, Data Structures, Algorithms...",
            value: e.achievements,
            onChange: ev => updateEntry(e.id, 'achievements', ev.target.value)
          })
        })]
      })]
    }, e.id)), /*#__PURE__*/_jsx(AddButton, {
      label: "+ Add Education",
      onClick: addEntry
    })]
  });
}