/* TranscriptBubble.tsx — Live transcript speaker bubble segment */

interface TranscriptBubbleProps {
  index: number;
  text: string;
}

export default function TranscriptBubble({ index, text }: TranscriptBubbleProps) {
  const isPatient = index % 3 === 0;
  const speakerLabel = index === 0 ? 'Doctor' : isPatient ? 'Patient' : 'Doctor';
  const timestamp = `00:${String(Math.floor(index * 4)).padStart(2, '0')}`;

  return (
    <div
      className="animate-field"
      style={{ animationDelay: `${index * 0.04}s`, marginBottom: '10px' }}
    >
      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: 'var(--color-ink-500, #5B6B82)', marginBottom: '3px' }}>
        {speakerLabel} · {timestamp}
      </p>
      <div
        style={{
          display: 'inline-block',
          maxWidth: '100%',
          padding: '10px 14px',
          borderRadius: isPatient ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
          background: isPatient ? 'var(--color-bg-subtle, #F6F8FA)' : 'var(--color-accent-light, #EFECFE)',
          border: `1px solid ${isPatient ? 'var(--color-border, #E3E8EE)' : 'var(--color-accent, #6D5DF6)'}`,
          fontFamily: 'Inter,sans-serif',
          fontSize: '14px',
          lineHeight: 1.6,
          color: 'var(--color-ink-900, #101A2E)',
        }}
      >
        {text}
      </div>
    </div>
  );
}
