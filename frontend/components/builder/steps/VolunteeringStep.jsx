'use client';

import { useCVStore } from '@/store/cvStore';
import { Field, Input, Grid, StepHeader, Desc, EntryCard, AddButton, EmptyState } from '../FormPrimitives';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function uid() {
  return Math.random().toString(36).slice(2);
}
export default function VolunteeringStep() {
  const {
    cv,
    setCVField
  } = useCVStore();
  function addEntry() {
    setCVField('volunteering', [...cv.volunteering, {
      id: uid(),
      role: '',
      org: '',
      period: '',
      desc: ''
    }]);
  }
  function removeEntry(id) {
    setCVField('volunteering', cv.volunteering.filter(e => e.id !== id));
  }
  function update(id, key, value) {
    setCVField('volunteering', cv.volunteering.map(e => e.id === id ? {
      ...e,
      [key]: value
    } : e));
  }
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(StepHeader, {
      title: "Volunteering",
      step: 5,
      total: 9
    }), /*#__PURE__*/_jsx(Desc, {
      children: "Include community service, NGO work, club leadership, or any unpaid roles that demonstrate values and skills."
    }), cv.volunteering.length === 0 ? /*#__PURE__*/_jsx(EmptyState, {
      icon: "\uD83E\uDD1D",
      text: "No volunteering entries added yet."
    }) : cv.volunteering.map((e, i) => /*#__PURE__*/_jsxs(EntryCard, {
      title: `Activity #${i + 1}`,
      onDelete: () => removeEntry(e.id),
      children: [/*#__PURE__*/_jsxs(Grid, {
        children: [/*#__PURE__*/_jsx(Field, {
          label: "Role / Position",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. Group Leader, Logistics Head",
            value: e.role,
            onChange: ev => update(e.id, 'role', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "Organisation",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "e.g. HOSA Camp, MCRC, Red Cross",
            value: e.org,
            onChange: ev => update(e.id, 'org', ev.target.value)
          })
        })]
      }), /*#__PURE__*/_jsxs(Grid, {
        children: [/*#__PURE__*/_jsx(Field, {
          label: "Period",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "2022 \u2013 2023 or Sep 2023",
            value: e.period,
            onChange: ev => update(e.id, 'period', ev.target.value)
          })
        }), /*#__PURE__*/_jsx(Field, {
          label: "Brief Description",
          children: /*#__PURE__*/_jsx(Input, {
            placeholder: "Led team coordination, managed logistics...",
            value: e.desc,
            onChange: ev => update(e.id, 'desc', ev.target.value)
          })
        })]
      })]
    }, e.id)), /*#__PURE__*/_jsx(AddButton, {
      label: "+ Add Volunteering / Activity",
      onClick: addEntry
    })]
  });
}