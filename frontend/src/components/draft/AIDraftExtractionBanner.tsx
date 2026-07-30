import React, { useEffect, useState } from 'react';
import { useRecordingStore } from '@/store/recordingStore';
import { useUIStore } from '@/store/uiStore';
import { useDraftStore } from '@/store/draftStore';
import { Sparkles, Brain, Cpu, Activity, ChevronRight } from 'lucide-react';

const EXTRACTION_STEPS = [
  { text: '🎙️ Transcribing Speech Audio...', icon: Activity, color: '#38BDF8' },
  { text: '🧠 Gemini LLM Clinical Extraction...', icon: Brain, color: '#A78BFA' },
  { text: '📝 Structuring Prescription JSON...', icon: Sparkles, color: '#2DD4BF' },
];

export default function AIDraftExtractionBanner() {
  const status = useRecordingStore((s) => s.status);
  const isProcessing = status === 'processing';
  const draft = useDraftStore((s) => s.draft);

  const isTelemetryOpen = useUIStore((s) => s.isTelemetryOpen);
  const toggleTelemetry = useUIStore((s) => s.toggleTelemetry);

  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setStepIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % EXTRACTION_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isProcessing]);

  // State 1: Active AI Extraction in Progress
  if (isProcessing) {
    const currentStep = EXTRACTION_STEPS[stepIdx];
    const StepIcon = currentStep.icon;

    return (
      <div
        style={{
          position: 'relative',
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(18, 137, 127, 0.12) 0%, rgba(109, 93, 246, 0.12) 100%)',
          border: '1px solid rgba(18, 137, 127, 0.3)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        {/* Animated Shimmer Bar Across Top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #12897F, #6D5DF6, transparent)',
            animation: 'shimmer-line 1.8s infinite linear',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: '#12897F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StepIcon size={16} color="#FFF" />
          </div>
          <div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '13px', color: '#101A2E' }}>
              AI Extraction in Progress
            </span>
            <p style={{ margin: 0, fontSize: '11px', color: '#5B6B82', fontFamily: 'IBM Plex Mono, monospace' }}>
              {currentStep.text}
            </p>
          </div>
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '99px',
            background: '#E4F3F1',
            color: '#12897F',
            fontSize: '10px',
            fontFamily: 'IBM Plex Mono, monospace',
            fontWeight: 700,
          }}
        >
          PROCESSING...
        </span>

        <style>{`
          @keyframes shimmer-line {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  // State 2: Extraction Complete / Telemetry Active Confirmation Badge
  if (draft) {
    return (
      <div
        style={{
          padding: '10px 14px',
          borderRadius: '10px',
          background: 'rgba(18, 137, 127, 0.06)',
          border: '1px solid rgba(18, 137, 127, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#12897F',
              boxShadow: '0 0 8px #12897F',
            }}
          />
          <Cpu size={14} color="#12897F" />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#101A2E' }}>
            🤖 AI Telemetry Active & Monitoring
          </span>
        </div>

        <button
          onClick={toggleTelemetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            borderRadius: '6px',
            background: isTelemetryOpen ? '#12897F' : 'transparent',
            color: isTelemetryOpen ? '#FFF' : '#12897F',
            border: '1px solid #12897F',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {isTelemetryOpen ? 'Telemetry Open' : 'View Stream'} <ChevronRight size={12} />
        </button>
      </div>
    );
  }

  return null;
}
