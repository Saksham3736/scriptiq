/* MedicineCard.tsx — Formatted patient medicine item card */

import { Pill, Clock, Utensils } from 'lucide-react';
import type { Medicine } from '@/store/draftStore';

interface MedicineCardProps {
  medicine: Medicine;
  index: number;
}

export default function MedicineCard({ medicine, index }: MedicineCardProps) {
  const metaText = [medicine.dosage, medicine.frequency, medicine.duration].filter(Boolean).join(' · ');

  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '12px',
        border: '1.5px solid #E3E8EE',
        background: '#FAFBFC',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        transition: 'all 0.15s',
        boxShadow: '0 2px 8px rgba(16,26,46,0.03)',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: '#EFECFE',
          color: '#6D5DF6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Pill size={20} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', color: '#101A2E' }}>
            {medicine.name || `Medicine #${index + 1}`}
          </span>
          {medicine.strength && (
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '11px', color: '#6D5DF6', background: '#EFECFE', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              {medicine.strength}
            </span>
          )}
        </div>

        {metaText && (
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: '#12897F', margin: '4px 0 0 0', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {metaText}
          </p>
        )}

        {medicine.timing && (
          <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', background: '#E4F3F1', color: '#12897F', fontSize: '11px', fontFamily: 'Inter', fontWeight: 600 }}>
            <Utensils size={11} /> {medicine.timing}
          </div>
        )}
      </div>
    </div>
  );
}
