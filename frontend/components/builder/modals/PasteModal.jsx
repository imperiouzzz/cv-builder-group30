'use client';

import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { parseCV } from '@/lib/cvParser';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export default function PasteModal({
  onClose
}) {
  const {
    cv,
    setCV
  } = useCVStore();
  const [text, setText] = useState('');
  const [filled, setFilled] = useState([]);
  const [done, setDone] = useState(false);
  function handleImport() {
    if (!text.trim()) return;
    const {
      data,
      filled: f
    } = parseCV(text);

    // Merge: only fill fields that are currently empty
    const merged = {
      ...cv
    };
    Object.keys(data).forEach(key => {
      const val = data[key];
      if (Array.isArray(val)) {
        if (merged[key].length === 0 && val.length > 0) {
          merged[key] = val;
        }
      } else if (typeof val === 'string' && val) {
        if (!merged[key]) merged[key] = val;
      }
    });
    setCV(merged);
    setFilled(f);
    setDone(true);
  }
  return /*#__PURE__*/_jsx("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(26,26,46,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200
    },
    children: /*#__PURE__*/_jsxs("div", {
      style: {
        background: 'white',
        borderRadius: 16,
        padding: 28,
        width: 520,
        maxWidth: '95vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      },
      children: [/*#__PURE__*/_jsx("h3", {
        style: {
          fontFamily: 'Fraunces, serif',
          fontSize: 18,
          fontWeight: 600,
          color: '#1A1A2E',
          marginBottom: 6
        },
        children: "\uD83D\uDCCB Paste CV Text"
      }), /*#__PURE__*/_jsx("p", {
        style: {
          fontSize: 12,
          color: '#718096',
          marginBottom: 16,
          lineHeight: 1.5
        },
        children: "Open your existing CV, select all (Ctrl+A), copy (Ctrl+C), then paste below. The parser will detect and fill your name, contact info, education, work history, and skills."
      }), !done ? /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx("textarea", {
          value: text,
          onChange: e => setText(e.target.value),
          placeholder: 'JOHN KWAME DOE\njohn@example.com | +233 24 123 4567\nlinkedin.com/in/johndoe\n\nEDUCATION\nBSc. Computer Science\nKNUST, Kumasi — 2021–2025\n\nWORK EXPERIENCE\nIntern | Bsystems Limited\nSeptember 2024 – October 2024\n• Built REST APIs using Django REST Framework\n\nSKILLS\n• Python, Django, Git, PostgreSQL, TensorFlow',
          style: {
            width: '100%',
            minHeight: 220,
            padding: '10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            fontSize: 12,
            fontFamily: 'monospace',
            color: '#2D3748',
            resize: 'vertical',
            outline: 'none',
            marginBottom: 16
          },
          onFocus: e => e.target.style.borderColor = '#E53E3E',
          onBlur: e => e.target.style.borderColor = '#E2E8F0'
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8
          },
          children: [/*#__PURE__*/_jsx("button", {
            onClick: onClose,
            style: {
              padding: '8px 18px',
              background: 'none',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              color: '#718096'
            },
            children: "Cancel"
          }), /*#__PURE__*/_jsx("button", {
            onClick: handleImport,
            disabled: !text.trim(),
            style: {
              padding: '8px 20px',
              background: text.trim() ? '#E53E3E' : '#E2E8F0',
              color: text.trim() ? 'white' : '#718096',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              fontFamily: "'DM Sans', sans-serif"
            },
            children: "Auto-Fill from Text"
          })]
        })]
      }) : /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsxs("div", {
          style: {
            background: '#F0FFF4',
            border: '1px solid #9AE6B4',
            borderRadius: 10,
            padding: 16,
            marginBottom: 16
          },
          children: [/*#__PURE__*/_jsx("p", {
            style: {
              fontWeight: 600,
              fontSize: 13,
              color: '#276749',
              marginBottom: 10
            },
            children: "\u2705 Import complete!"
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6
            },
            children: filled.length > 0 ? filled.map(f => /*#__PURE__*/_jsxs("span", {
              style: {
                padding: '3px 10px',
                background: 'white',
                border: '1px solid #9AE6B4',
                borderRadius: 20,
                fontSize: 11,
                color: '#276749',
                fontWeight: 500
              },
              children: ["\u2713 ", f]
            }, f)) : /*#__PURE__*/_jsx("p", {
              style: {
                fontSize: 12,
                color: '#718096'
              },
              children: "Nothing was auto-detected. Check that the text includes section headings like EDUCATION, WORK EXPERIENCE, SKILLS."
            })
          }), /*#__PURE__*/_jsx("p", {
            style: {
              fontSize: 11,
              color: '#718096',
              marginTop: 10
            },
            children: "Review each section and edit any fields the parser may have missed."
          })]
        }), /*#__PURE__*/_jsx("div", {
          style: {
            display: 'flex',
            justifyContent: 'flex-end'
          },
          children: /*#__PURE__*/_jsx("button", {
            onClick: onClose,
            style: {
              padding: '8px 24px',
              background: '#E53E3E',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif"
            },
            children: "Done, review my CV \u2192"
          })
        })]
      })]
    })
  });
}