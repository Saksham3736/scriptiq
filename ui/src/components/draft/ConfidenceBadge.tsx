/* ConfidenceBadge.tsx — AI extraction confidence indicator badge */

import { Sparkles } from 'lucide-react';

interface ConfidenceBadgeProps {
  score?: number;
}

export default function ConfidenceBadge({ score = 92 }: ConfidenceBadgeProps) {
  const isHigh = score >= 85;
  const isMedium = score >= 70 && score < 85;

  const color = isHigh ? '#12897F' : isMedium ? '#E8A33D' : '#E15554';
  const bg = isHigh ? '#E4F3F1' : isMedium ? '#FCF1DE' : '#FDF2F2';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '99px',
        background: bg,
        color,
        fontFamily: 'IBM Plex Mono,monospace',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.04em',
      }}
      title={`AI Confidence Score: ${score}%`}
    >
      <Sparkles size={11} color={color} />
      AI · {score}%
    </span>
  );
}
