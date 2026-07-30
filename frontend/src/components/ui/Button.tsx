/* Button.tsx — Tokenized Atomic Button Component */

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const getVariantStyles = (): React.CSSProperties => {
      switch (variant) {
        case 'secondary':
          return {
            backgroundColor: 'var(--color-bg-subtle, #F1F5F9)',
            color: 'var(--color-ink-900, #0F172A)',
            border: '1px solid var(--color-border, #E2E8F0)',
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            color: 'var(--color-primary, #12897F)',
            border: '1px solid var(--color-primary, #12897F)',
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: 'var(--color-ink-700, #334155)',
            border: '1px solid transparent',
          };
        case 'danger':
          return {
            backgroundColor: 'var(--color-coral, #E15554)',
            color: '#FFFFFF',
            border: '1px solid transparent',
          };
        case 'primary':
        default:
          return {
            backgroundColor: 'var(--color-primary, #12897F)',
            color: '#FFFFFF',
            border: '1px solid transparent',
          };
      }
    };

    const getSizeStyles = (): React.CSSProperties => {
      switch (size) {
        case 'sm':
          return {
            padding: '6px 12px',
            fontSize: '12px',
            borderRadius: 'var(--radius-sm, 6px)',
            gap: '6px',
          };
        case 'lg':
          return {
            padding: '12px 24px',
            fontSize: '15px',
            borderRadius: 'var(--radius-md, 10px)',
            gap: '10px',
          };
        case 'md':
        default:
          return {
            padding: '8px 16px',
            fontSize: '13px',
            borderRadius: 'var(--radius-md, 8px)',
            gap: '8px',
          };
      }
    };

    const isInteractionDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isInteractionDisabled}
        style={{
          display: fullWidth ? 'flex' : 'inline-flex',
          width: fullWidth ? '100%' : 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-heading, sans-serif)',
          fontWeight: 600,
          cursor: isInteractionDisabled ? 'not-allowed' : 'pointer',
          opacity: isInteractionDisabled ? 0.6 : 1,
          transition: 'all var(--duration-fast, 100ms) var(--ease-smooth, ease)',
          outline: 'none',
          boxSizing: 'border-box',
          ...getVariantStyles(),
          ...getSizeStyles(),
          ...style,
        }}
        className={className}
        {...props}
      >
        {isLoading ? (
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
