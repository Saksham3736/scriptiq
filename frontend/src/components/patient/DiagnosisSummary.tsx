/* DiagnosisSummary.tsx — Clinical diagnosis block component */

import { Heart, Activity } from 'lucide-react';

interface DiagnosisSummaryProps {
  diagnosis?: string;
  symptoms?: string[];
  chiefComplaint?: string;
}

export default function DiagnosisSummary({
  diagnosis = 'General Medical Consultation',
  symptoms = [],
  chiefComplaint,
}: DiagnosisSummaryProps) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '14px',
        background: '#101A2E',
        color: '#fff',
        marginBottom: '20px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(18,137,127,0.2)', color: '#12897F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={18} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'rgba(232,236,243,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Primary Diagnosis
            </span>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 700, margin: '2px 0 0 0', color: '#fff' }}>
              {diagnosis}
            </h3>
          </div>
        </div>

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '99px', background: 'rgba(109,93,246,0.2)', color: '#C5BCF8', fontSize: '11px', fontFamily: 'IBM Plex Mono', fontWeight: 600 }}>
          <Activity size={12} /> Active Case
        </span>
      </div>

      {chiefComplaint && (
        <p style={{ fontSize: '13px', color: 'rgba(232,236,243,0.8)', margin: '0 0 12px 0', fontStyle: 'italic', lineHeight: 1.4 }}>
          "{chiefComplaint}"
        </p>
      )}

      {symptoms.length > 0 && (
        <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'rgba(232,236,243,0.6)', fontWeight: 600, marginRight: '4px' }}>
            Symptoms:
          </span>
          {symptoms.map((sym, idx) => (
            <span key={idx} style={{ padding: '3px 10px', borderRadius: '99px', background: 'rgba(255,255,255,0.1)', fontSize: '11px', color: '#fff' }}>
              {sym}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
