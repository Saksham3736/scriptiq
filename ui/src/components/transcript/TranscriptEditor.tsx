/* TranscriptEditor.tsx — Manual consultation text editor component */

interface TranscriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TranscriptEditor({
  value,
  onChange,
  placeholder = 'Type or paste the consultation notes here...\n\nE.g. Patient complains of fever for 3 days, 102°F. Diagnosed with viral fever. Prescribe Paracetamol 500mg twice daily for 5 days...',
}: TranscriptEditorProps) {
  const wordCount = value.split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: '16px',
          borderRadius: '10px',
          border: '1.5px solid var(--color-border, #E3E8EE)',
          fontFamily: 'Inter,sans-serif',
          fontSize: '14px',
          color: 'var(--color-ink-900, #101A2E)',
          lineHeight: 1.7,
          resize: 'none',
          outline: 'none',
          background: 'var(--color-bg-subtle, #FAFBFC)',
          minHeight: '300px',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent, #6D5DF6)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border, #E3E8EE)')}
      />
      <p style={{ fontFamily: 'IBM Plex Mono,monospace', fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)', margin: 0 }}>
        {wordCount} words
      </p>
    </div>
  );
}
