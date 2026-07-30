/* Input.tsx — Tokenized Atomic Form Input Component */

import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, id, className = '', style, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontFamily: 'var(--font-heading, sans-serif)',
              fontSize: '12px',
              fontWeight: 600,
              color: error ? 'var(--color-coral, #E15554)' : 'var(--color-ink-900, #0F172A)',
            }}
          >
            {label}
            {props.required && <span style={{ color: 'var(--color-coral, #E15554)', marginLeft: '3px' }}>*</span>}
          </label>
        )}

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          {leftIcon && (
            <div
              style={{
                position: 'absolute',
                left: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-ink-500, #64748B)',
                pointerEvents: 'none',
              }}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            style={{
              width: '100%',
              paddingTop: '8px',
              paddingBottom: '8px',
              paddingLeft: leftIcon ? '38px' : '12px',
              paddingRight: rightIcon ? '38px' : '12px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans, sans-serif)',
              backgroundColor: disabled ? 'var(--color-bg-subtle, #F1F5F9)' : 'var(--color-bg-surface, #FFFFFF)',
              color: 'var(--color-ink-900, #0F172A)',
              border: `1px solid ${error ? 'var(--color-coral, #E15554)' : 'var(--color-border, #E2E8F0)'}`,
              borderRadius: 'var(--radius-md, 8px)',
              outline: 'none',
              transition: 'border-color var(--duration-fast) var(--ease-smooth), box-shadow var(--duration-fast) var(--ease-smooth)',
              cursor: disabled ? 'not-allowed' : 'text',
              boxSizing: 'border-box',
              ...style,
            }}
            className={className}
            {...props}
          />

          {rightIcon && (
            <div
              style={{
                position: 'absolute',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-ink-500, #64748B)',
              }}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <span
            id={errorId}
            role="alert"
            style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '11px',
              color: 'var(--color-coral, #E15554)',
              fontWeight: 500,
            }}
          >
            {error}
          </span>
        )}

        {!error && helperText && (
          <span
            id={helperId}
            style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '11px',
              color: 'var(--color-ink-500, #64748B)',
            }}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
