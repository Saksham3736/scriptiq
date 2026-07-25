/* Toast.tsx — Individual Toast Notification Card */

import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { type ToastItem, useUIStore } from '@/store/uiStore';

interface ToastProps {
  toast: ToastItem;
}

export default function Toast({ toast }: ToastProps) {
  const removeToast = useUIStore((s) => s.removeToast);

  const config = {
    success: {
      bg: '#E4F3F1',
      border: '#12897F',
      color: '#0D625B',
      iconColor: '#12897F',
      Icon: CheckCircle2,
    },
    warning: {
      bg: '#FCF1DE',
      border: '#E8A33D',
      color: '#8A5913',
      iconColor: '#E8A33D',
      Icon: AlertTriangle,
    },
    error: {
      bg: '#FDF2F2',
      border: '#F87171',
      color: '#B91C1C',
      iconColor: '#E15554',
      Icon: AlertCircle,
    },
    info: {
      bg: '#EEF2FF',
      border: '#6366F1',
      color: '#3730A3',
      iconColor: '#6D5DF6',
      Icon: Info,
    },
  }[toast.type];

  const { Icon, bg, border, color, iconColor } = config;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        background: bg,
        border: `1.5px solid ${border}`,
        boxShadow: '0 8px 20px -4px rgba(16, 26, 46, 0.12)',
        minWidth: '300px',
        maxWidth: '420px',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'auto',
      }}
    >
      <Icon size={18} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        {toast.title && (
          <p
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              color,
              margin: '0 0 2px 0',
            }}
          >
            {toast.title}
          </p>
        )}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color,
            margin: 0,
            lineHeight: 1.4,
            opacity: 0.9,
          }}
        >
          {toast.message}
        </p>
      </div>

      <button
        onClick={() => removeToast(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: iconColor,
          padding: '2px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
        }}
        title="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
