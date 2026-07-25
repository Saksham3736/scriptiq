/* FollowUpBanner.tsx — Follow-up appointment banner component */

import { Calendar, ArrowRight } from 'lucide-react';

interface FollowUpBannerProps {
  followUpDate?: string;
}

export default function FollowUpBanner({ followUpDate = 'After 5 Days' }: FollowUpBannerProps) {
  return (
    <div style={{ padding: '16px 20px', borderRadius: '12px', background: '#EFECFE', border: '1.5px solid #C5BCF8', color: '#6D5DF6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Calendar size={20} />
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, color: '#5448D4' }}>
            Recommended Follow-Up
          </span>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: 700, margin: '2px 0 0 0', color: '#101A2E' }}>
            {followUpDate}
          </p>
        </div>
      </div>

      <div style={{ fontSize: '12px', fontWeight: 600, color: '#6D5DF6', display: 'flex', alignItems: 'center', gap: '4px' }}>
        Book Appointment <ArrowRight size={14} />
      </div>
    </div>
  );
}
