/* AdviceList.tsx — Lifestyle instructions & doctor advice list component */

import { CheckCircle2, ShieldAlert } from 'lucide-react';

interface AdviceListProps {
  advice?: string[];
}

export default function AdviceList({ advice = [] }: AdviceListProps) {
  if (!advice || advice.length === 0) return null;

  return (
    <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border, #E3E8EE)', background: 'var(--color-bg-subtle, #FAFBFC)', marginBottom: '20px' }}>
      <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ShieldAlert size={16} color="#12897F" /> General Advice & Precautions
      </h4>

      <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {advice.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--color-ink-900, #101A2E)', lineHeight: 1.4 }}>
            <CheckCircle2 size={15} color="#12897F" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
