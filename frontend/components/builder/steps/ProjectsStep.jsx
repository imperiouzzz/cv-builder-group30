'use client';

import { useCVStore } from '@/store/cvStore';
import { Field, Input, Textarea, Grid, StepHeader, Desc, TipBox, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function uid() {
  return Math.random().toString(36).slice(2);
}
export default function ProjectsStep() {
  const {
    cv,
    setCVField
  } = useCVStore();
  function addEntry() {
    setCVField('projects', [...cv.projects, {
      id: uid(),
      name: '',
      tech: '',
      period: '',
      description: '',
      link: ''
    }]);
  }
  function removeEntry(id) {
    setCVField('projects', cv.projects.filter(e => e.id !== id));
  }
  function update(id, key, value) {
    setCVField('projects', cv.projects.map(e => e.id === id ? {
      ...e,
      [key]: value
    } : e));
  }
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(StepHeader, {
      title: "Projects & Research",
      step: 6,
      total: 9
    }), /*#__PURE__*/_jsx(Desc, {
      children: "Showcase academic projects, personal builds, or research that demonstrates your technical skills."
    }), /*#__PURE__*/_jsx(TipBox, {
      children: "\uD83D\uDCA1 ATS Tip: Include the exact technology names used (e.g. \"TensorFlow\", \"Django REST Framework\") \u2014 these are keywords recruiters search for."
    }), cv.projects.length === 0 ? /*#__PURE__*/_jsx(EmptyState, {
      icon: "\uD83D\uDEE0",
      text: "No projects added yet. Click below to showcase your work."
    }) : cv.projects.map((e, i) => /*#__PURE__*/_jsxs(EntryCard, {
      title: `Project #${i + 1}`,
      onDelete: () => removeEntry(e.id),
      children: [/*#__PURE__*/_jsxs(Grid, {
        children: [/*#__PURE__*/_jsx(Field, {
          label: "Project Name",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. Facial Recognition System, CV Builder App",
            value: e.name,
            onChange: ev => update(e.id, 'name', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "Technologies Used",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. Python, TensorFlow, OpenCV, Django",
            value: e.tech,
            onChange: ev => update(e.id, 'tech', ev.target.value)
          })
        })]
      }), /*#__PURE__*/_jsxs(Grid, {
        children: [/*#__PURE__*/_jsx(Field, {
          label: "Period",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "Mar 2025 or 2024 \u2013 Present",
            value: e.period,
            onChange: ev => update(e.id, 'period', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "Project Link (optional)",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "https://github.com/username/project",
            value: e.link,
            onChange: ev => update(e.id, 'link', ev.target.value)
          })
        })]
      }), /*#__PURE__*/_jsx(Field, {
        label: "Description",
        span: "full",
        children: /*#__PURE__*/_jsx(Textarea, {
          placeholder: "Describe what the project does, your specific contributions, and any results or metrics achieved.",
          value: e.description,
          onChange: ev => update(e.id, 'description', ev.target.value)
        })
      })]
    }, e.id)), /*#__PURE__*/_jsx(AddButton, {
      label: "+ Add Project",
      onClick: addEntry
    })]
  });
}