/* DraftActionsBar.tsx — Draft action buttons (Regenerate, Confirm & Send) */

import { RefreshCw, Send, CheckCircle } from 'lucide-react';
import { BoneSpinner } from '../ui/Boneyard';

interface DraftActionsBarProps {
  onRegenerate: () => void;
  onApprove: () => void;
  saving: boolean;
  saved: boolean;
}

export default function DraftActionsBar({
  onRegenerate,
  onApprove,
  saving,
  saved,
}: DraftActionsBarProps) {
  return (
    <div
      style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--color-border, #E3E8EE)',
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
        flexShrink: 0,
        background: 'var(--color-bg-subtle, #FAFBFC)',
      }}
    >
      <button
        onClick={onRegenerate}
        style={{
          padding: '9px 16px',
          borderRadius: '8px',
          border: '1.5px solid var(--color-border, #E3E8EE)',
          background: 'var(--color-bg-surface, #fff)',
          cursor: 'pointer',
          fontFamily: 'Inter,sans-serif',
          fontSize: '13px',
          color: 'var(--color-ink-700, #5B6B82)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <RefreshCw size={13} />
        Regenerate
      </button>

      <button
        onClick={onApprove}
        disabled={saving || saved}
        style={{
          padding: '9px 20px',
          borderRadius: '8px',
          border: 'none',
          cursor: saved ? 'default' : 'pointer',
          background: saved
            ? '#E4F3F1'
            : 'linear-gradient(135deg, #12897F, #0F7268)',
          color: saved ? '#12897F' : '#fff',
          fontFamily: 'Space Grotesk,sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: saved ? 'none' : '0 4px 12px rgba(18,137,127,0.3)',
          transition: 'all 0.2s',
        }}
      >
        {saving ? (
          <BoneSpinner size={14} color="#fff" />
        ) : saved ? (
          <CheckCircle size={14} />
        ) : (
          <Send size={14} />
        )}
        {saving ? 'Saving...' : saved ? 'Sent to Patient' : 'Confirm & Send'}
      </button>
    </div>
  );
}
