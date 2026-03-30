'use client';

import { useCVStore } from '@/store/cvStore';
import { Field, Input, Grid, StepHeader, Desc, TipBox, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function uid() {
  return Math.random().toString(36).slice(2);
}
export default function ReferencesStep() {
  const {
    cv,
    setCVField
  } = useCVStore();
  function addEntry() {
    setCVField('references', [...cv.references, {
      id: uid(),
      name: '',
      title: '',
      org: '',
      email: '',
      phone: ''
    }]);
  }
  function removeEntry(id) {
    setCVField('references', cv.references.filter(e => e.id !== id));
  }
  function update(id, key, value) {
    setCVField('references', cv.references.map(e => e.id === id ? {
      ...e,
      [key]: value
    } : e));
  }
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(StepHeader, {
      title: "References",
      step: 8,
      total: 9
    }), /*#__PURE__*/_jsx(Desc, {
      children: "Add professional references who can vouch for your skills and work ethic."
    }), /*#__PURE__*/_jsx(TipBox, {
      children: "\uD83D\uDCA1 Always ask permission before listing someone as a reference. Provide at least 2 references \u2014 one academic and one professional."
    }), cv.references.length === 0 ? /*#__PURE__*/_jsx(EmptyState, {
      icon: "\uD83D\uDC64",
      text: "No references added yet. Click below to add your first referee."
    }) : cv.references.map((e, i) => /*#__PURE__*/_jsxs(EntryCard, {
      title: `Referee #${i + 1}`,
      onDelete: () => removeEntry(e.id),
      children: [/*#__PURE__*/_jsxs(Grid, {
        children: [/*#__PURE__*/_jsx(Field, {
          label: "Full Name",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. Abiola Olabiyi",
            value: e.name,
            onChange: ev => update(e.id, 'name', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "Job Title",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. System Administrator, Software Developer",
            value: e.title,
            onChange: ev => update(e.id, 'title', ev.target.value)
          })
        })]
      }), /*#__PURE__*/_jsxs(Grid, {
        children: [/*#__PURE__*/_jsx(Field, {
          label: "Organisation",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. Fidelity Bank Ghana, Bsystems Limited",
            value: e.org,
            onChange: ev => update(e.id, 'org', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "Email",
          children: /*#__PURE__*/_jsx(Input, {
            type: "email",
            placeholder: "referee@company.com",
            value: e.email,
            onChange: ev => update(e.id, 'email', ev.target.value)
          })
        })]
      }), /*#__PURE__*/_jsx(Grid, {
        children: /*#__PURE__*/_jsx(Field, {
          label: "Phone",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "+233 50 160 3188",
            value: e.phone,
            onChange: ev => update(e.id, 'phone', ev.target.value)
          })
        })
      })]
    }, e.id)), /*#__PURE__*/_jsx(AddButton, {
      label: "+ Add Reference",
      onClick: addEntry
    })]
  });
}