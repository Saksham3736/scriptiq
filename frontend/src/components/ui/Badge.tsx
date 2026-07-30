/* Badge.tsx — Tokenized Atomic Status Badge Component */

import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'violet';
export type BadgeMode = 'soft' | 'solid';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  mode?: BadgeMode;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  mode = 'soft',
  size = 'md',
  icon,
  dot = false,
  children,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyles = (): { bg: string; color: string; border?: string; dotColor: string } => {
    if (mode === 'solid') {
      switch (variant) {
        case 'success':
          return { bg: 'var(--color-primary, #12897F)', color: '#FFFFFF', dotColor: '#FFFFFF' };
        case 'warning':
          return { bg: 'var(--color-amber, #E8A33D)', color: '#FFFFFF', dotColor: '#FFFFFF' };
        case 'error':
          return { bg: 'var(--color-coral, #E15554)', color: '#FFFFFF', dotColor: '#FFFFFF' };
        case 'violet':
          return { bg: 'var(--color-accent, #6D5DF6)', color: '#FFFFFF', dotColor: '#FFFFFF' };
        case 'neutral':
          return { bg: 'var(--color-ink-700, #334155)', color: '#FFFFFF', dotColor: '#FFFFFF' };
        case 'primary':
        default:
          return { bg: 'var(--color-primary, #12897F)', color: '#FFFFFF', dotColor: '#FFFFFF' };
      }
    } else {
      // Soft mode
      switch (variant) {
        case 'success':
          return {
            bg: 'var(--color-primary-light, #E4F3F1)',
            color: 'var(--color-primary, #12897F)',
            dotColor: 'var(--color-primary, #12897F)',
          };
        case 'warning':
          return {
            bg: 'var(--color-amber-light, #FCF1DE)',
            color: 'var(--color-amber, #E8A33D)',
            dotColor: 'var(--color-amber, #E8A33D)',
          };
        case 'error':
          return {
            bg: 'var(--color-coral-light, #FDF2F2)',
            color: 'var(--color-coral, #E15554)',
            dotColor: 'var(--color-coral, #E15554)',
          };
        case 'violet':
          return {
            bg: 'var(--color-accent-light, #EFECFE)',
            color: 'var(--color-accent, #6D5DF6)',
            dotColor: 'var(--color-accent, #6D5DF6)',
          };
        case 'neutral':
          return {
            bg: 'var(--color-bg-subtle, #F1F5F9)',
            color: 'var(--color-ink-700, #334155)',
            dotColor: 'var(--color-ink-500, #64748B)',
          };
        case 'primary':
        default:
          return {
            bg: 'var(--color-primary-light, #E4F3F1)',
            color: 'var(--color-primary, #12897F)',
            dotColor: 'var(--color-primary, #12897F)',
          };
      }
    }
  };

  const { bg, color, dotColor } = getVariantStyles();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '4px' : '6px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-full, 9999px)',
        backgroundColor: bg,
        color: color,
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: size === 'sm' ? '10px' : '11px',
        fontWeight: 600,
        lineHeight: 1.2,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        ...style,
      }}
      className={className}
      {...props}
    >
      {dot && (
        <span
          style={{
            width: size === 'sm' ? 5 : 6,
            height: size === 'sm' ? 5 : 6,
            borderRadius: '50%',
            backgroundColor: dotColor,
          }}
        />
      )}
      {icon}
      <span>{children}</span>
    </span>
  );
};
