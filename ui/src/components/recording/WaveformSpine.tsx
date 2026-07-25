/* WaveformSpine.tsx — signature left rail: live waveform → tick checklist morph */

import { useEffect, useRef } from 'react';
import { useRecordingStore } from '@/store/recordingStore';
import { Check } from 'lucide-react';

const BAR_COUNT = 16;

export default function WaveformSpine() {
  const { status } = useRecordingStore();
  const barsRef = useRef<HTMLDivElement[]>([]);

  const isRecording  = status === 'recording';
  const isProcessing = status === 'processing';
  const isDone       = status === 'done';
  const isPaused     = status === 'paused';

  // Randomize bar heights continuously while recording
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      barsRef.current.forEach((bar) => {
        if (!bar) return;
        const h = Math.max(8, Math.random() * 48);
        bar.style.height = `${h}px`;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isRecording]);

  // Reset bars when idle
  useEffect(() => {
    if (status === 'idle') {
      barsRef.current.forEach((bar) => {
        if (!bar) return;
        bar.style.height = '8px';
      });
    }
  }, [status]);

  const spineColor =
    isRecording  ? '#6D5DF6' :
    isProcessing ? '#E8A33D' :
    isDone       ? '#12897F' :
    isPaused     ? '#5B6B82' : 'rgba(90,107,130,0.2)';

  return (
    <div
      style={{
        width: '48px',
        minHeight: '100%',
        background: 'var(--color-bg-surface, #101A2E)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 0',
        gap: '4px',
        borderRight: `1px solid var(--color-border, rgba(255,255,255,0.06))`,
        transition: 'border-color 0.4s',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Status dot at top */}
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: isRecording ? '#6D5DF6' : isProcessing ? '#E8A33D' : isDone ? '#12897F' : '#2A3A5A',
        boxShadow: isRecording ? '0 0 0 4px rgba(109,93,246,0.2)' : 'none',
        marginBottom: '12px',
        transition: 'all 0.3s',
        animation: isRecording ? 'pulse-ring 1.5s ease-out infinite' : 'none',
      }} />

      {/* Waveform bars OR tick marks */}
      {Array.from({ length: BAR_COUNT }).map((_, i) =>
        isDone ? (
          /* Morphed to tick marks */
          <div key={i} style={{
            width: '4px', height: '4px', borderRadius: '50%',
            background: '#12897F', opacity: 0.5 + (i % 3) * 0.16,
            animation: `fadeSlideIn 0.3s ${i * 0.025}s both`,
          }} />
        ) : (
          /* Live waveform bars */
          <div
            key={i}
            ref={(el) => { if (el) barsRef.current[i] = el; }}
            style={{
              width: '4px',
              height: isRecording ? `${8 + Math.random() * 32}px` : '8px',
              borderRadius: '2px',
              background: spineColor,
              transition: isRecording ? 'none' : 'height 0.4s var(--ease-out), background 0.3s',
              animationDelay: `${i * 0.04}s`,
            }}
          />
        )
      )}

      {/* Processing spinner overlay */}
      {isProcessing && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(16,26,46,0.7)', backdropFilter: 'blur(2px)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8A33D" strokeWidth="2.5"
            style={{ animation: 'spin 0.9s linear infinite' }}>
            <path d="M12 2a10 10 0 0 1 10 10" />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </svg>
        </div>
      )}

      {/* Done checkmark */}
      {isDone && (
        <div style={{
          position: 'absolute', bottom: '20px',
          animation: 'fadeSlideIn 0.3s var(--ease-out) both',
        }}>
          <Check size={14} color="#12897F" strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}
