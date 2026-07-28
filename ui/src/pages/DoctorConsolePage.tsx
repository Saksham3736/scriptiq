import TopBar from '@/components/layout/TopBar';
import WaveformSpine from '@/components/recording/WaveformSpine';
import LiveTranscriptPanel from '@/components/transcript/LiveTranscriptPanel';
import DraftPanel from '@/components/draft/DraftPanel';
import AutoPilotTelemetryConsole from '@/components/telemetry/AutoPilotTelemetryConsole';

export default function DoctorConsolePage() {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', position: 'relative' }}>
      <TopBar />

      {/* 3-pane console with dynamic flex-split boundaries */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 56px)' }}>

        {/* Waveform Spine (left rail) */}
        <WaveformSpine />

        {/* Center — Live Transcript Panel */}
        <div style={{
          minWidth: '320px',
          flex: 1.2,
          borderRight: '1px solid var(--color-border, #E2E8F0)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-bg-surface, #FFFFFF)',
        }}>
          <LiveTranscriptPanel />
        </div>

        {/* Right — Prescription Draft Panel */}
        <div style={{
          minWidth: '420px',
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-bg-app, #F8FAFC)',
        }}>
          <DraftPanel />
        </div>
      </div>

      {/* Live Master Agent Telemetry Overlay */}
      <AutoPilotTelemetryConsole />
    </div>
  );
}
