/* LiveTranscriptPanel.tsx — Live transcript + combined voice & text consultation engine */

import { useEffect, useRef, useState } from 'react';
import { useRecordingStore } from '@/store/recordingStore';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useRecordingSocket } from '@/hooks/useRecordingSocket';
import { useExtraction } from '@/hooks/useExtraction';
import RecordFAB from '../recording/RecordFAB';
import ModeToggle from '../recording/ModeToggle';
import TranscriptBubble from './TranscriptBubble';
import TranscriptEditor from './TranscriptEditor';
import { Mic2, Edit3, Wifi, WifiOff, Sparkles } from 'lucide-react';
import { BoneSpinner } from '../ui/Boneyard';

interface TranscriptPanelProps {
  onExtractionComplete?: (draft: Record<string, unknown>) => void;
}

export default function LiveTranscriptPanel({ onExtractionComplete }: TranscriptPanelProps) {
  const { status, transcript, partialText, setTranscript } = useRecordingStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [textInput, setTextInput] = useState('');

  // WebSocket for streaming transcript updates
  const { isConnected, sendAudioChunk } = useRecordingSocket();

  // MediaRecorder API integration
  const audioRecorder = useAudioRecorder((chunk) => {
    sendAudioChunk(chunk);
  });

  // Extraction custom hook
  const { loading: extracting, extractConsultation } = useExtraction();

  // Auto-scroll to bottom as transcript grows
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, partialText]);

  // Combine typed text notes and recorded voice transcript into unified clinical text
  const getCombinedText = () => {
    const parts = [];
    if (textInput.trim()) parts.push(textInput.trim());
    if (transcript.trim() && transcript.trim() !== textInput.trim()) {
      parts.push(transcript.trim());
    }
    return parts.join('\n\n');
  };

  const handleProcess = async (stoppedBlob?: Blob | null) => {
    const targetBlob = stoppedBlob || audioRecorder.audioBlob;
    const combined = getCombinedText();
    const success = await extractConsultation(combined, targetBlob);
    if (success) {
      const draftState = useRecordingStore.getState();
      if (draftState.transcript) {
        onExtractionComplete?.(draftState as any);
      }
    }
  };

  // Split transcript into bubble segments (by sentence)
  const segments = transcript
    ? transcript.split(/(?<=[.!?])\s+/).filter(Boolean)
    : [];

  const mode = useRecordingStore((s) => s.mode);
  const isIdle = status === 'idle';
  const isDone = status === 'done';
  const isRecording = status === 'recording';
  const hasTextOrVoice = !!textInput.trim() || !!transcript.trim() || !!audioRecorder.audioBlob;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-surface, #FFFFFF)', color: 'var(--color-ink-900)' }}>
      {/* Panel header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border, #E3E8EE)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {mode === 'voice' ? <Mic2 size={15} color="#6D5DF6" /> : <Edit3 size={15} color="#5B6B82" />}
          <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--color-ink-900, #101A2E)' }}>
            {mode === 'voice' ? 'Live Transcript' : 'Type Consultation'}
          </span>
          {isRecording && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '99px', background: '#EFECFE', fontFamily: 'IBM Plex Mono,monospace', fontSize: '10px', color: '#6D5DF6', fontWeight: 500 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E15554', animation: 'pulse-ring 1s ease-out infinite' }} />
              LIVE
            </span>
          )}
          {isDone && (
            <span style={{ padding: '2px 8px', borderRadius: '99px', background: '#E4F3F1', fontFamily: 'IBM Plex Mono,monospace', fontSize: '10px', color: '#12897F', fontWeight: 500 }}>
              EXTRACTED
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={useRecordingStore((s) => s.language)}
            onChange={(e) => useRecordingStore.getState().setLanguage(e.target.value as any)}
            title="Audio STT Language Mode"
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid var(--color-border, #E3E8EE)',
              background: 'var(--color-bg-subtle, #F6F8FA)',
              color: 'var(--color-ink-900, #101A2E)',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'Space Grotesk, sans-serif',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="en">🇬🇧 EN</option>
            <option value="hinglish">🇮🇳 Hinglish</option>
            <option value="hi">🇮🇳 Hindi</option>
          </select>
          <span style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px', color: isConnected ? '#12897F' : '#5B6B82' }}>
            {isConnected ? <Wifi size={13} color="#12897F" /> : <WifiOff size={13} color="#5B6B82" />}
            {isConnected ? 'Live WS' : 'Offline WS'}
          </span>
          <ModeToggle />
        </div>
      </div>

      {/* Transcript scroll area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {mode === 'voice' ? (
          <>
            {/* Voice mode: bubble stream */}
            {isIdle && !transcript && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px', color: '#5B6B82', textAlign: 'center', paddingTop: '40px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EFECFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mic2 size={28} color="#6D5DF6" />
                </div>
                <div>
                  <p style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: '16px', color: '#101A2E', marginBottom: '6px' }}>Ready to listen</p>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: '#5B6B82', maxWidth: '240px' }}>
                    Press the mic button to record, type notes, or combine both naturally during consultation.
                  </p>
                </div>
              </div>
            )}

            {segments.map((seg, i) => (
              <TranscriptBubble key={i} index={i} text={seg} />
            ))}

            {/* Partial text (streaming) */}
            {partialText && (
              <div style={{ marginBottom: '10px', opacity: 0.6 }}>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#5B6B82', marginBottom: '3px' }}>Doctor · live</p>
                <div style={{ display: 'inline-block', padding: '10px 14px', borderRadius: '12px 12px 2px 12px', background: '#EFECFE', border: '1px dashed #6D5DF6', fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#101A2E' }}>
                  {partialText}<span style={{ animation: 'blink 1s step-end infinite' }}>|</span>
                  <style>{`@keyframes blink{50%{opacity:0}}`}</style>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Text mode: TranscriptEditor */
          <TranscriptEditor
            value={textInput}
            onChange={(val) => {
              setTextInput(val);
              setTranscript(val);
            }}
          />
        )}
      </div>

      {/* Bottom control bar */}
      <div style={{ padding: '20px', borderTop: '1px solid var(--color-border, #E3E8EE)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flexShrink: 0, background: 'var(--color-bg-subtle, #FAFBFC)' }}>
        {/* Direct 'Extract Prescription' button when in Text mode or when text exists */}
        {mode === 'text' ? (
          <button
            onClick={() => handleProcess()}
            disabled={extracting || !hasTextOrVoice}
            style={{
              width: '100%',
              maxWidth: '360px',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: hasTextOrVoice && !extracting ? 'pointer' : 'not-allowed',
              background: hasTextOrVoice ? 'linear-gradient(135deg, #6D5DF6, #5448D4)' : '#E3E8EE',
              color: hasTextOrVoice ? '#fff' : '#5B6B82',
              fontFamily: 'Space Grotesk,sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: hasTextOrVoice ? '0 4px 16px rgba(109,93,246,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {extracting ? <BoneSpinner size={16} color="#fff" /> : <Sparkles size={16} color={hasTextOrVoice ? '#fff' : '#5B6B82'} />}
            {extracting ? 'Extracting Prescription...' : 'Extract Prescription Draft'}
          </button>
        ) : (
          <RecordFAB onProcess={(stoppedBlob) => handleProcess(stoppedBlob)} audioRecorder={audioRecorder} />
        )}
      </div>
    </div>
  );
}
