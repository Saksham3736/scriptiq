/* Modal.tsx — Tokenized Accessible Modal Dialog Component */

import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  closeOnBackdropClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '520px',
  closeOnBackdropClick = true,
}) => {
  const modalId = useId();
  const titleId = `${modalId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle Escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    // Focus the modal container for accessibility
    setTimeout(() => {
      dialogRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modal-backdrop, 1040)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
          backgroundColor: 'var(--color-bg-surface, #FFFFFF)',
          borderRadius: 'var(--radius-lg, 16px)',
          border: '1px solid var(--color-border, #E2E8F0)',
          boxShadow: 'var(--shadow-xl, 0 20px 32px -8px rgba(15, 23, 42, 0.16))',
          outline: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 48px)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border, #E2E8F0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-bg-surface, #FFFFFF)',
          }}
        >
          {title && (
            <h2
              id={titleId}
              style={{
                fontFamily: 'var(--font-heading, sans-serif)',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-ink-900, #0F172A)',
                margin: 0,
              }}
            >
              {title}
            </h2>
          )}

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm, 6px)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-ink-500, #64748B)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color var(--duration-fast) var(--ease-smooth)',
              marginLeft: 'auto',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            flex: 1,
            color: 'var(--color-ink-900, #0F172A)',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--color-border, #E2E8F0)',
              backgroundColor: 'var(--color-bg-subtle, #F8FAFC)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
