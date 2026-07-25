/* FieldChip.tsx — Labeled editable field chip component */

import React from 'react';

interface FieldChipProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  confidence?: number;
  lowConfidence?: boolean;
}

export default function FieldChip({
  label,
  value,
  onChange,
  placeholder,
  icon,
  confidence,
  lowConfidence,
}: FieldChipProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #5B6B82)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
          {icon}
          {label}
        </p>
        {confidence !== undefined && (
          <span style={{ fontFamily: 'IBM Plex Mono,monospace', fontSize: '10px', color: confidence < 80 ? '#E8A33D' : '#12897F', fontWeight: 500 }}>
            {confidence}% AI
          </span>
        )}
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          display: 'block',
          width: '100%',
          padding: '9px 12px',
          borderRadius: '8px',
          border: lowConfidence || (confidence !== undefined && confidence < 80)
            ? '1.5px solid #E8A33D'
            : '1.5px solid var(--color-border, #E3E8EE)',
          fontFamily: 'Inter,sans-serif',
          fontSize: '13px',
          color: 'var(--color-ink-900, #101A2E)',
          outline: 'none',
          background: lowConfidence ? 'var(--color-amber-light, #FCF1DE22)' : 'var(--color-bg-subtle, #FAFBFC)',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent, #6D5DF6)')}
        onBlur={(e) =>
          (e.target.style.borderColor =
            lowConfidence || (confidence !== undefined && confidence < 80)
              ? '#E8A33D'
              : 'var(--color-border, #E3E8EE)')
        }
      />
    </div>
  );
}
