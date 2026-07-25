/* ModeToggle.tsx — voice ↔ text mode switcher */
import { Mic2, Edit3 } from 'lucide-react';
import { useRecordingStore } from '@/store/recordingStore';

export default function ModeToggle() {
  const { mode, setMode } = useRecordingStore();
  return (
    <div style={{ display:'flex', background:'var(--color-bg-subtle, #F6F8FA)', borderRadius:'8px', padding:'3px', border:'1px solid var(--color-border, #E3E8EE)' }}>
      {(['voice','text'] as const).map((m) => {
        const active = mode === m;
        const Icon = m === 'voice' ? Mic2 : Edit3;
        return (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              display:'flex', alignItems:'center', gap:'5px', padding:'5px 10px', borderRadius:'6px',
              border:'none', cursor:'pointer', transition:'all 0.15s',
              background: active ? 'var(--color-bg-surface, #fff)' : 'transparent',
              color: active ? 'var(--color-ink-900, #101A2E)' : 'var(--color-ink-500, #5B6B82)',
              boxShadow: active ? 'var(--shadow-xs)' : 'none',
              fontFamily:'Inter,sans-serif', fontSize:'12px', fontWeight: active ? 600 : 400,
            }}
          >
            <Icon size={12} />
            {m === 'voice' ? 'Voice' : 'Text'}
          </button>
        );
      })}
    </div>
  );
}
