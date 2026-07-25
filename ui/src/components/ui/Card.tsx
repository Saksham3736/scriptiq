/* Card.tsx — Tokenized Atomic Card Component Suite */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padding = 'md',
  bordered = true,
  children,
  style,
  className = '',
  ...props
}) => {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return '12px 16px';
      case 'lg':
        return '24px 32px';
      case 'md':
      default:
        return '20px';
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface, #FFFFFF)',
        borderRadius: 'var(--radius-lg, 16px)',
        border: bordered ? '1px solid var(--color-border, #E2E8F0)' : 'none',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(15, 23, 42, 0.08))',
        padding: getPaddingStyle(),
        transition: 'background-color var(--duration-normal) var(--ease-smooth), border-color var(--duration-normal) var(--ease-smooth)',
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, ...props }) => (
  <div style={{ marginBottom: '16px', ...style }} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, style, ...props }) => (
  <h3
    style={{
      fontFamily: 'var(--font-heading, sans-serif)',
      fontSize: '16px',
      fontWeight: 700,
      color: 'var(--color-ink-900, #0F172A)',
      margin: 0,
      lineHeight: 1.3,
      ...style,
    }}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, style, ...props }) => (
  <p
    style={{
      fontFamily: 'var(--font-sans, sans-serif)',
      fontSize: '12px',
      color: 'var(--color-ink-500, #64748B)',
      marginTop: '4px',
      marginBottom: 0,
      lineHeight: 1.4,
      ...style,
    }}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, ...props }) => (
  <div style={{ ...style }} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, ...props }) => (
  <div
    style={{
      marginTop: '20px',
      paddingTop: '16px',
      borderTop: '1px solid var(--color-border, #E2E8F0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '12px',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);
