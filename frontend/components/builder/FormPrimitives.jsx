import React from 'react';

// ── Field wrapper ────────────────────────────────────────────
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Field({
  label,
  required,
  hint,
  children,
  span
}) {
  return /*#__PURE__*/_jsxs("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      gridColumn: span === 'full' ? '1 / -1' : undefined
    },
    children: [/*#__PURE__*/_jsxs("label", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: '#2D3748',
        display: 'flex',
        gap: 4
      },
      children: [label, required && /*#__PURE__*/_jsx("span", {
        style: {
          color: '#E53E3E'
        },
        children: "*"
      })]
    }), children, hint && /*#__PURE__*/_jsx("span", {
      style: {
        fontSize: 10,
        color: '#718096'
      },
      children: hint
    })]
  });
}

// ── Text input ───────────────────────────────────────────────

export function Input(props) {
  return /*#__PURE__*/_jsx("input", {
    ...props,
    style: {
      padding: '8px 10px',
      border: '1px solid #E2E8F0',
      borderRadius: 6,
      fontSize: 13,
      fontFamily: "'DM Sans', sans-serif",
      color: '#2D3748',
      background: 'white',
      outline: 'none',
      width: '100%',
      transition: 'border 0.15s, box-shadow 0.15s',
      ...(props.style || {})
    },
    onFocus: e => {
      e.target.style.borderColor = '#E53E3E';
      e.target.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.08)';
    },
    onBlur: e => {
      e.target.style.borderColor = '#E2E8F0';
      e.target.style.boxShadow = 'none';
    }
  });
}

// ── Textarea ─────────────────────────────────────────────────

export function Textarea(props) {
  return /*#__PURE__*/_jsx("textarea", {
    ...props,
    style: {
      padding: '8px 10px',
      border: '1px solid #E2E8F0',
      borderRadius: 6,
      fontSize: 13,
      fontFamily: "'DM Sans', sans-serif",
      color: '#2D3748',
      background: 'white',
      outline: 'none',
      width: '100%',
      resize: 'vertical',
      minHeight: 80,
      transition: 'border 0.15s, box-shadow 0.15s',
      ...(props.style || {})
    },
    onFocus: e => {
      e.target.style.borderColor = '#E53E3E';
      e.target.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.08)';
    },
    onBlur: e => {
      e.target.style.borderColor = '#E2E8F0';
      e.target.style.boxShadow = 'none';
    }
  });
}

// ── Two-column grid ──────────────────────────────────────────
export function Grid({
  children,
  cols = 2
}) {
  return /*#__PURE__*/_jsx("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 12,
      marginBottom: 12
    },
    children: children
  });
}

// ── Section header ───────────────────────────────────────────
export function StepHeader({
  title,
  step,
  total
}) {
  return /*#__PURE__*/_jsxs("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 16
    },
    children: [/*#__PURE__*/_jsx("h2", {
      style: {
        fontFamily: 'Fraunces, serif',
        fontSize: 20,
        fontWeight: 600,
        color: '#1A1A2E'
      },
      children: title
    }), total && /*#__PURE__*/_jsxs("span", {
      style: {
        fontSize: 11,
        color: '#718096'
      },
      children: ["Step ", step, " of ", total]
    })]
  });
}

// ── Muted description text ───────────────────────────────────
export function Desc({
  children
}) {
  return /*#__PURE__*/_jsx("p", {
    style: {
      fontSize: 12,
      color: '#718096',
      marginBottom: 16,
      lineHeight: 1.5
    },
    children: children
  });
}

// ── Tip box (blue) ───────────────────────────────────────────
export function TipBox({
  children
}) {
  return /*#__PURE__*/_jsx("div", {
    style: {
      background: '#EBF8FF',
      border: '1px solid #BEE3F8',
      borderRadius: 6,
      padding: '8px 10px',
      fontSize: 11,
      color: '#2A69AC',
      marginBottom: 12
    },
    children: children
  });
}

// ── Writing tips box (yellow) ────────────────────────────────
export function WritingTips({
  tips
}) {
  return /*#__PURE__*/_jsxs("div", {
    style: {
      background: '#FFFBF0',
      border: '1px solid #FAD56A',
      borderRadius: 8,
      padding: '10px 12px',
      marginBottom: 14
    },
    children: [/*#__PURE__*/_jsx("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: '#744210',
        marginBottom: 6
      },
      children: "\uD83D\uDCA1 Writing Tips"
    }), /*#__PURE__*/_jsx("ul", {
      style: {
        listStyle: 'none',
        fontSize: 11,
        color: '#7B5E17'
      },
      children: tips.map((t, i) => /*#__PURE__*/_jsxs("li", {
        style: {
          padding: '1px 0'
        },
        children: ["\u2022 ", t]
      }, i))
    })]
  });
}

// ── Entry card ───────────────────────────────────────────────

export function EntryCard({
  title,
  onDelete,
  children
}) {
  return /*#__PURE__*/_jsxs("div", {
    style: {
      border: '1px solid #E2E8F0',
      borderRadius: 10,
      padding: 14,
      background: 'white',
      marginBottom: 10
    },
    children: [/*#__PURE__*/_jsxs("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
      },
      children: [/*#__PURE__*/_jsxs("div", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: '#1A1A2E',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        },
        children: [/*#__PURE__*/_jsx("span", {
          style: {
            color: '#718096',
            fontSize: 14,
            cursor: 'grab'
          },
          children: "\u283F"
        }), title]
      }), /*#__PURE__*/_jsx("button", {
        onClick: onDelete,
        style: {
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: '1px solid #FEB2B2',
          borderRadius: 4,
          color: '#E53E3E',
          cursor: 'pointer',
          fontSize: 12
        },
        children: "\u2715"
      })]
    }), children]
  });
}

// ── Add entry button ─────────────────────────────────────────
export function AddButton({
  label,
  onClick
}) {
  return /*#__PURE__*/_jsx("button", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      width: '100%',
      padding: 10,
      border: '1.5px dashed #E2E8F0',
      borderRadius: 8,
      background: 'none',
      color: '#E53E3E',
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif",
      marginTop: 8,
      transition: 'all 0.15s'
    },
    onMouseOver: e => {
      e.currentTarget.style.background = '#FFF5F5';
      e.currentTarget.style.borderColor = '#E53E3E';
    },
    onMouseOut: e => {
      e.currentTarget.style.background = 'none';
      e.currentTarget.style.borderColor = '#E2E8F0';
    },
    children: label
  });
}

// ── Empty state ──────────────────────────────────────────────
export function EmptyState({
  icon,
  text
}) {
  return /*#__PURE__*/_jsxs("div", {
    style: {
      textAlign: 'center',
      padding: 24,
      color: '#718096',
      fontSize: 12
    },
    children: [/*#__PURE__*/_jsx("div", {
      style: {
        fontSize: 28,
        marginBottom: 8
      },
      children: icon
    }), text]
  });
}