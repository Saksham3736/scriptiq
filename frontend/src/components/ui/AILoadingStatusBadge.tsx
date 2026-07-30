/* AILoadingStatusBadge.tsx — Dynamic 2-3 word textual loading animation badge */

import { useEffect, useState } from 'react';
import { Sparkles, Brain, FileText, Zap } from 'lucide-react';

const STEPS = [
  { text: 'Script Sent...', icon: <Zap size={11} color="#E8A33D" />, durationMs: 1500 },
  { text: 'Agent Reading...', icon: <Brain size={11} color="#6D5DF6" />, durationMs: 2000 },
  { text: 'Structuring Rx...', icon: <FileText size={11} color="#12897F" />, durationMs: 2000 },
  { text: 'Finalizing...', icon: <Sparkles size={11} color="#12897F" />, durationMs: 3000 },
];

interface AILoadingStatusBadgeProps {
  isProcessing: boolean;
}

export default function AILoadingStatusBadge({ isProcessing }: AILoadingStatusBadgeProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setStepIndex(0);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % STEPS.length;
      setStepIndex(current);
    }, 1800);

    return () => clearInterval(interval);
  }, [isProcessing]);

  if (!isProcessing) return null;

  const currentStep = STEPS[stepIndex];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '99px',
        background: '#EFECFE',
        border: '1px solid #C5BCF8',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '11px',
        fontWeight: 600,
        color: '#6D5DF6',
        animation: 'pulse-badge 1.2s ease-in-out infinite alternate',
      }}
    >
      <style>{`
        @keyframes pulse-badge {
          from { opacity: 0.8; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
      {currentStep.icon}
      {currentStep.text}
    </span>
  );
}
