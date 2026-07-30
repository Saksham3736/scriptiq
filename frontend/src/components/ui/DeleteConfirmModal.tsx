/* DeleteConfirmModal.tsx — GitHub-Style High Security Typed Confirmation Modal for Data Deletion */

import { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  count: number;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  count,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConfirmModalProps) {
  const [typedText, setTypedText] = useState('');

  const requiredPhrase = `delete ${count} ${count === 1 ? 'record' : 'records'}`;
  const isMatch = typedText.trim().toLowerCase() === requiredPhrase.toLowerCase();

  useEffect(() => {
    if (isOpen) {
      setTypedText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(16, 26, 46, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'var(--color-bg-surface, #FFFFFF)',
          color: 'var(--color-ink-900, #101A2E)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border, #E3E8EE)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            background: 'rgba(225, 85, 84, 0.08)',
            borderBottom: '1px solid rgba(225, 85, 84, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E15554' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '16px', margin: 0 }}>
              Confirm Permanent Deletion
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-ink-500, #64748B)',
              padding: '4px',
              display: 'flex',
              borderRadius: '50%',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '13.5px', color: 'var(--color-ink-900, #101A2E)', lineHeight: 1.5, margin: 0 }}>
            This action <strong>CANNOT</strong> be undone. This will permanently delete{' '}
            <span style={{ color: '#E15554', fontWeight: 700 }}>
              {count} {count === 1 ? 'consultation record' : 'consultation records'}
            </span>{' '}
            and remove associated data from MongoDB Atlas.
          </p>

          {/* GitHub-style Typed Confirmation Prompt */}
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'var(--color-bg-subtle, #F8FAFC)',
              border: '1px solid var(--color-border, #E2E8F0)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-ink-700, #475569)' }}>
              To confirm, type <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#E15554', background: 'rgba(225, 85, 84, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{requiredPhrase}</span> below:
            </label>

            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder={requiredPhrase}
              autoFocus
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: isMatch ? '1.5px solid #E15554' : '1px solid var(--color-border, #CBD5E1)',
                background: 'var(--color-bg-surface, #FFFFFF)',
                color: 'var(--color-ink-900, #101A2E)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '13px',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            background: 'var(--color-bg-subtle, #F8FAFC)',
            borderTop: '1px solid var(--color-border, #E2E8F0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid var(--color-border, #E2E8F0)',
              background: 'var(--color-bg-surface, #FFFFFF)',
              color: 'var(--color-ink-900, #101A2E)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={!isMatch || loading}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              background: isMatch ? '#E15554' : 'var(--color-border, #CBD5E1)',
              color: '#FFFFFF',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              cursor: isMatch && !loading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isMatch ? '0 4px 14px rgba(225, 85, 84, 0.35)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Trash2 size={14} />
            {loading ? 'Deleting...' : `Delete ${count} ${count === 1 ? 'Record' : 'Records'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
