import React, { useEffect, useState, useRef } from 'react';
import { useUIStore } from '@/store/uiStore';
import {
  Activity,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  FileText,
  Database,
  Mail,
  ShoppingBag,
  Zap,
  X,
} from 'lucide-react';

export interface TelemetryEvent {
  step: number;
  total_steps: number;
  agent: string;
  status: 'IN_PROGRESS' | 'DONE' | 'ERROR';
  title: string;
  message: string;
  timestamp: string;
  payload?: Record<string, any>;
}

const AGENT_ICONS: Record<string, any> = {
  SpeechAgent: Activity,
  PrescriptionAgent: Sparkles,
  PDFAgent: FileText,
  DatabaseAgent: Database,
  EmailAgent: Mail,
  PharmacyAgent: ShoppingBag,
};

const DEFAULT_INITIAL_EVENTS: TelemetryEvent[] = [
  {
    step: 1,
    total_steps: 7,
    agent: 'SpeechAgent',
    status: 'DONE',
    title: 'Audio STT & Refinement',
    message: 'Faster-Whisper STT engine online & normalized.',
    timestamp: '00:00:01',
  },
  {
    step: 2,
    total_steps: 7,
    agent: 'PrescriptionAgent',
    status: 'DONE',
    title: 'Gemini 2.5 Structured Output',
    message: 'Structured JSON schema parser ready.',
    timestamp: '00:00:02',
  },
  {
    step: 3,
    total_steps: 7,
    agent: 'PDFAgent',
    status: 'DONE',
    title: 'ReportLab PDF Generator',
    message: 'DOB password encryption (DDMMYYYY) active.',
    timestamp: '00:00:03',
  },
];

export default function AutoPilotTelemetryConsole() {
  const isTelemetryOpen = useUIStore((s) => s.isTelemetryOpen);
  const setTelemetryOpen = useUIStore((s) => s.setTelemetryOpen);

  const [events, setEvents] = useState<TelemetryEvent[]>(DEFAULT_INITIAL_EVENTS);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [currentAgent, setCurrentAgent] = useState<string>('MasterAgent');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wsUrl = `ws://${window.location.hostname}:8000/ws/master_agent`;
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        console.log('[TelemetryConsole] Connected to Master Agent WebSocket');
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === 'telemetry_step' && payload.data) {
            const data: TelemetryEvent = payload.data;
            setEvents((prev) => [...prev.slice(-15), data]);
            setActiveStep(data.step);
            setCurrentAgent(data.agent);
            // Automatically open telemetry drawer when live steps arrive
            setTelemetryOpen(true);
          }
        } catch (err) {
          console.warn('[TelemetryConsole] JSON parse error:', err);
        }
      };

      ws.onclose = () => setIsConnected(false);
      ws.onerror = () => setIsConnected(false);
    } catch (e) {
      console.warn('[TelemetryConsole] WebSocket init error:', e);
    }

    return () => {
      ws?.close();
    };
  }, [setTelemetryOpen]);

  useEffect(() => {
    if (terminalEndRef.current && isTelemetryOpen) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events, isTelemetryOpen]);

  const steps = [
    { num: 1, label: 'Voice STT', agent: 'SpeechAgent' },
    { num: 2, label: 'AI Structuring', agent: 'PrescriptionAgent' },
    { num: 3, label: 'PDF & Encryption', agent: 'PDFAgent' },
    { num: 4, label: 'MongoDB Atlas', agent: 'DatabaseAgent' },
    { num: 5, label: 'Gmail SMTP', agent: 'EmailAgent' },
    { num: 6, label: 'Pharmacy Desk', agent: 'PharmacyAgent' },
    { num: 7, label: 'POS Bridge', agent: 'PharmacyAgent' },
  ];

  if (!isTelemetryOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: isExpanded ? '400px' : '300px',
        borderRadius: '16px',
        background: 'rgba(16, 26, 46, 0.96)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(18, 137, 127, 0.25)',
        color: '#F8FAFC',
        fontFamily: 'Inter, sans-serif',
        zIndex: 9999,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Drawer Header */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.05)',
          borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          userSelect: 'none',
        }}
      >
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #12897F, #6D5DF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cpu size={15} color="#FFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '13px', color: '#FFF' }}>
                Master Agent Telemetry
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '2px 6px',
                  borderRadius: '99px',
                  background: isConnected ? 'rgba(18, 137, 127, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                  color: isConnected ? '#2DD4BF' : '#F87171',
                  fontSize: '9px',
                  fontWeight: 600,
                  fontFamily: 'IBM Plex Mono, monospace',
                }}
              >
                {isConnected ? 'LIVE WS' : 'READY'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '10px', color: '#94A3B8' }}>
              {activeStep > 0 ? `Executing Step ${activeStep}/7 (${currentAgent})` : 'Master Agent Online & Monitoring'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <button
            onClick={() => setTelemetryOpen(false)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Expanded Drawer Content */}
      {isExpanded && (
        <div style={{ padding: '14px 16px' }}>
          {/* 7-Step Visual Progress Stepper */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '3px',
              marginBottom: '12px',
              padding: '8px 4px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {steps.map((st) => {
              const isCompleted = activeStep > st.num || (activeStep === 0 && st.num <= 3);
              const isCurrent = activeStep === st.num;
              const StepIcon = AGENT_ICONS[st.agent] || Activity;

              return (
                <div
                  key={st.num}
                  title={`${st.num}. ${st.label} (${st.agent})`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    opacity: isCompleted || isCurrent ? 1 : 0.4,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: isCompleted
                        ? '#12897F'
                        : isCurrent
                        ? '#6D5DF6'
                        : 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isCurrent ? '0 0 10px rgba(109, 93, 246, 0.6)' : 'none',
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={12} color="#FFF" />
                    ) : (
                      <StepIcon size={11} color="#FFF" />
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '8px',
                      color: isCurrent ? '#A78BFA' : '#94A3B8',
                      fontWeight: isCurrent ? 700 : 500,
                      textAlign: 'center',
                      lineHeight: 1.1,
                    }}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Model Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              padding: '6px 10px',
              borderRadius: '6px',
              background: 'rgba(109, 93, 246, 0.12)',
              border: '1px solid rgba(109, 93, 246, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={12} color="#A78BFA" />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#C4B5FD' }}>
                Engine Status
              </span>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'IBM Plex Mono, monospace',
                color: '#E2E8F0',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              gemini-2.5-flash / gemma-4-26b
            </span>
          </div>

          {/* Telemetry Stream Output Terminal */}
          <div
            style={{
              height: '140px',
              overflowY: 'auto',
              background: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '8px',
              padding: '10px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              lineHeight: '1.5',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {events.map((ev, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  opacity: idx === events.length - 1 ? 1 : 0.8,
                }}
              >
                <span style={{ color: '#64748B', fontSize: '9px', marginTop: '2px' }}>
                  [{ev.timestamp?.split('T')[1]?.substring(0, 8) || ev.timestamp || '00:00'}]
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        color:
                          ev.agent === 'SpeechAgent'
                            ? '#38BDF8'
                            : ev.agent === 'PrescriptionAgent'
                            ? '#F472B6'
                            : ev.agent === 'PDFAgent'
                            ? '#FBBF24'
                            : ev.agent === 'DatabaseAgent'
                            ? '#34D399'
                            : ev.agent === 'EmailAgent'
                            ? '#A78BFA'
                            : '#2DD4BF',
                      }}
                    >
                      [{ev.agent}]
                    </span>
                    <span style={{ fontWeight: 600, color: '#F1F5F9' }}>{ev.title}</span>
                  </div>
                  <p style={{ margin: 0, color: '#94A3B8', fontSize: '10px' }}>{ev.message}</p>
                </div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
