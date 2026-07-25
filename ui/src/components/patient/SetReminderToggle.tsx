/* SetReminderToggle.tsx — Interactive medicine reminder notification toggle component */

import { useState } from 'react';
import { BellRing, Check } from 'lucide-react';

export default function SetReminderToggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div style={{ padding: '14px 18px', borderRadius: '12px', background: enabled ? '#E4F3F1' : '#FAFBFC', border: `1.5px solid ${enabled ? '#12897F' : '#E3E8EE'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <BellRing size={18} color={enabled ? '#12897F' : '#5B6B82'} />
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: enabled ? '#12897F' : '#101A2E', margin: 0 }}>
            Medicine Dose Reminders
          </p>
          <p style={{ fontSize: '11px', color: '#5B6B82', margin: '2px 0 0 0' }}>
            Receive WhatsApp alerts for scheduled medicine timings
          </p>
        </div>
      </div>

      <button
        onClick={() => setEnabled(!enabled)}
        style={{
          padding: '6px 14px',
          borderRadius: '99px',
          border: 'none',
          cursor: 'pointer',
          background: enabled ? '#12897F' : '#E3E8EE',
          color: enabled ? '#fff' : '#5B6B82',
          fontFamily: 'Inter',
          fontSize: '12px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {enabled && <Check size={12} />} {enabled ? 'Reminders Active' : 'Set Reminders'}
      </button>
    </div>
  );
}
