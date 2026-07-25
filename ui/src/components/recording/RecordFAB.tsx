/* RecordFAB.tsx — Floating action button for real mic recording */

import { Mic, Pause, Square, Loader2, AlertCircle } from 'lucide-react';
import { useRecordingStore } from '@/store/recordingStore';
import type { UseAudioRecorderReturn } from '@/hooks/useAudioRecorder';

interface RecordFABProps {
  onProcess: (stoppedBlob?: Blob | null) => void;
  audioRecorder?: UseAudioRecorderReturn;
}

export default function RecordFAB({ onProcess, audioRecorder }: RecordFABProps) {
  const { status, setStatus, resetRecording, micError: storeMicError } = useRecordingStore();

  const isIdle       = status === 'idle';
  const isRecording  = status === 'recording';
  const isPaused     = status === 'paused';
  const isProcessing = status === 'processing';

  const elapsedMs = audioRecorder ? audioRecorder.elapsedMs : useRecordingStore((s) => s.elapsedMs);
  const micError = audioRecorder?.micError || storeMicError;

  // Format mm:ss
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };

  const handleMainClick = async () => {
    if (isIdle) {
      if (audioRecorder) {
        await audioRecorder.startRecording();
        if (!audioRecorder.micError) setStatus('recording');
      } else {
        setStatus('recording');
      }
    } else if (isRecording) {
      if (audioRecorder) audioRecorder.pauseRecording();
      setStatus('paused');
    } else if (isPaused) {
      if (audioRecorder) audioRecorder.resumeRecording();
      setStatus('recording');
    }
  };

  const handleStop = async () => {
    let stoppedBlob: Blob | null = null;
    if (audioRecorder) {
      stoppedBlob = await audioRecorder.stopRecording();
    }
    onProcess(stoppedBlob);
  };

  const handleReset = () => {
    if (audioRecorder) {
      audioRecorder.resetRecording();
    }
    resetRecording();
  };

  if (isProcessing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8A33D22, #E8A33D44)',
            border: '2px solid #E8A33D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader2 size={26} color="#E8A33D" style={{ animation: 'spin 0.9s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
        <span style={{ fontFamily: 'IBM Plex Mono,monospace', fontSize: '11px', color: '#E8A33D' }}>Extracting...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
      {/* Mic error alert banner */}
      {micError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: '#FDF2F2',
            border: '1px solid #F87171',
            color: '#E15554',
            fontSize: '12px',
            maxWidth: '300px',
            textAlign: 'left',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{micError}</span>
        </div>
      )}

      {/* Timer */}
      {!isIdle && (
        <div style={{ fontFamily: 'IBM Plex Mono,monospace', fontSize: '14px', fontWeight: 500, color: isRecording ? '#6D5DF6' : '#5B6B82', letterSpacing: '0.08em' }}>
          {formatTime(elapsedMs)}
          {isRecording && <span style={{ marginLeft: '6px', display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#E15554', animation: 'pulse-ring 1s ease-out infinite' }} />}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={handleMainClick}
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: isRecording
            ? 'linear-gradient(135deg, #6D5DF6, #8B7EF8)'
            : isPaused
            ? 'linear-gradient(135deg, #5B6B82, #7A8BA0)'
            : 'linear-gradient(135deg, #6D5DF6, #5448D4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isRecording
            ? '0 0 0 8px rgba(109,93,246,0.15), 0 8px 24px rgba(109,93,246,0.4)'
            : '0 4px 16px rgba(109,93,246,0.3)',
          transition: 'all 0.2s',
          position: 'relative',
        }}
      >
        {isRecording ? (
          <Pause size={28} color="#fff" fill="#fff" />
        ) : (
          <Mic size={28} color="#fff" />
        )}

        {/* Pulsing ring when recording */}
        {isRecording && (
          <div
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              border: '2px solid rgba(109,93,246,0.4)',
              animation: 'pulse-ring 1.5s ease-out infinite',
            }}
          />
        )}
      </button>

      {/* Stop / Reset buttons */}
      {!isIdle && (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleStop}
            style={{
              padding: '7px 18px',
              borderRadius: '99px',
              border: 'none',
              cursor: 'pointer',
              background: '#101A2E',
              color: '#fff',
              fontFamily: 'Inter,sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(16,26,46,0.2)',
            }}
          >
            <Square size={11} fill="#fff" />
            Extract
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '7px 14px',
              borderRadius: '99px',
              border: '1.5px solid var(--color-border, #E3E8EE)',
              cursor: 'pointer',
              background: 'var(--color-bg-surface, #fff)',
              color: 'var(--color-ink-700, #5B6B82)',
              fontFamily: 'Inter,sans-serif',
              fontSize: '12px',
            }}
          >
            Reset
          </button>
        </div>
      )}

      {/* Idle hint */}
      {isIdle && (
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: 'var(--color-ink-500, #5B6B82)', textAlign: 'center', maxWidth: '140px', lineHeight: 1.5 }}>
          Tap to start recording the consultation
        </p>
      )}
    </div>
  );
}
