'use client';

import { useState, useRef } from 'react';
import { useCVStore } from '@/store/cvStore';
import { parseCV } from '@/lib/cvParser';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export default function UploadModal({
  onClose
}) {
  const setCV = useCVStore(s => s.setCV);
  const cv = useCVStore(s => s.cv);
  const [status, setStatus] = useState('idle');
  const [filled, setFilled] = useState([]);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  function processFile(file) {
    if (!file) return;
    setStatus('reading');
    setError('');
    const reader = new FileReader();
    reader.onload = e => {
      try {
        let raw = e.target?.result || '';
        // Strip PDF/binary noise, keep printable chars
        raw = raw.replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, ' ').replace(/\(([^)]{1,200})\)/g, '$1 ').replace(/\s{2,}/g, ' ').replace(/ ?\n ?/g, '\n');
        const {
          data,
          filled: f
        } = parseCV(raw);
        // Merge parsed data into current CV (don't overwrite existing non-empty fields)
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
        setStatus('done');
      } catch (err) {
        setStatus('error');
        setError('Could not parse this file. Try copying and pasting the text instead.');
      }
    };
    reader.onerror = () => {
      setStatus('error');
      setError('Failed to read file.');
    };
    reader.readAsText(file, 'utf-8');
  }
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }
  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
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
        width: 460,
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
        children: "\uD83D\uDCE4 Upload Your CV"
      }), /*#__PURE__*/_jsxs("p", {
        style: {
          fontSize: 12,
          color: '#718096',
          marginBottom: 18,
          lineHeight: 1.5
        },
        children: ["Upload a ", /*#__PURE__*/_jsx("strong", {
          children: ".txt"
        }), " file for best results. PDF and DOCX text extraction is also supported \u2014 if results are incomplete, use the Paste option instead."]
      }), status !== 'done' ? /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsxs("div", {
          onDragOver: e => {
            e.preventDefault();
            setDragging(true);
          },
          onDragLeave: () => setDragging(false),
          onDrop: handleDrop,
          onClick: () => inputRef.current?.click(),
          style: {
            border: `2px dashed ${dragging ? '#E53E3E' : '#E2E8F0'}`,
            borderRadius: 10,
            padding: 32,
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? '#FFF5F5' : 'white',
            marginBottom: 14,
            transition: 'all 0.15s'
          },
          children: [/*#__PURE__*/_jsx("input", {
            ref: inputRef,
            type: "file",
            accept: ".txt,.pdf,.doc,.docx",
            style: {
              display: 'none'
            },
            onChange: handleFileChange
          }), /*#__PURE__*/_jsx("div", {
            style: {
              fontSize: 32,
              marginBottom: 10
            },
            children: "\uD83D\uDCCE"
          }), status === 'reading' ? /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx("p", {
              style: {
                fontWeight: 600,
                color: '#1A1A2E',
                marginBottom: 4
              },
              children: "Reading file\u2026"
            }), /*#__PURE__*/_jsx("p", {
              style: {
                fontSize: 12,
                color: '#718096'
              },
              children: "Please wait"
            })]
          }) : /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx("p", {
              style: {
                fontWeight: 600,
                color: '#1A1A2E',
                marginBottom: 4
              },
              children: "Click to browse or drag & drop"
            }), /*#__PURE__*/_jsx("p", {
              style: {
                fontSize: 12,
                color: '#718096'
              },
              children: "Supports TXT, PDF, DOCX \u2014 max 10MB"
            })]
          })]
        }), error && /*#__PURE__*/_jsx("div", {
          style: {
            background: '#FFF5F5',
            border: '1px solid #FEB2B2',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
            color: '#C53030',
            marginBottom: 12
          },
          children: error
        })]
      }) :
      /*#__PURE__*/
      /* Success state */
      _jsxs("div", {
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
          children: filled.map(f => /*#__PURE__*/_jsxs("span", {
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
          }, f))
        }), filled.length === 0 && /*#__PURE__*/_jsx("p", {
          style: {
            fontSize: 12,
            color: '#718096'
          },
          children: "No sections could be auto-detected \u2014 please fill the form manually."
        }), /*#__PURE__*/_jsx("p", {
          style: {
            fontSize: 11,
            color: '#718096',
            marginTop: 10
          },
          children: "Review each section carefully \u2014 automated parsing may miss details. You can edit any field directly."
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8
        },
        children: /*#__PURE__*/_jsx("button", {
          onClick: onClose,
          style: {
            padding: '8px 20px',
            background: 'none',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            color: '#718096'
          },
          children: status === 'done' ? 'Done' : 'Cancel'
        })
      })]
    })
  });
}