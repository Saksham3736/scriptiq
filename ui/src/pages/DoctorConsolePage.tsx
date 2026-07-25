/* DoctorConsolePage.tsx — 3-pane doctor console */

import TopBar from '@/components/layout/TopBar';
import WaveformSpine from '@/components/recording/WaveformSpine';
import LiveTranscriptPanel from '@/components/transcript/LiveTranscriptPanel';
import DraftPanel from '@/components/draft/DraftPanel';

export default function DoctorConsolePage() {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
      <TopBar />

      {/* 3-pane console */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* Waveform Spine (left rail) */}
        <WaveformSpine />

        {/* Center — Live Transcript */}
        <div style={{ width:'42%', borderRight:'1px solid var(--color-border, #E3E8EE)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <LiveTranscriptPanel />
        </div>

        {/* Right — Prescription Draft */}
        <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <DraftPanel />
        </div>
      </div>
    </div>
  );
}
