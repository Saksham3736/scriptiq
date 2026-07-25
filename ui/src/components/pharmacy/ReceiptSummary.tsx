/* ReceiptSummary.tsx — Order header summary component */

import { ShoppingBag, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

interface ReceiptSummaryProps {
  orderId: string;
  patientName: string;
  phone?: string;
  orderDate?: string;
  pickupLocation?: string;
  status?: string;
}

export default function ReceiptSummary({
  orderId,
  patientName,
  phone,
  orderDate,
  pickupLocation = 'Hospital Pharmacy Counter #1',
  status = 'Priority Dispense Ready',
}: ReceiptSummaryProps) {
  return (
    <div style={{ background: '#101A2E', borderRadius: '16px', padding: '24px', color: '#fff', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '99px', background: 'rgba(18,137,127,0.2)', color: '#12897F', fontSize: '11px', fontFamily: 'IBM Plex Mono', fontWeight: 600, marginBottom: '8px' }}>
            <ShoppingBag size={12} /> Official Pharmacy Receipt
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '20px', fontWeight: 700, margin: 0 }}>
            {patientName}
          </h2>
          {phone && (
            <p style={{ fontSize: '12px', color: 'rgba(232,236,243,0.7)', margin: '4px 0 0 0', fontFamily: 'IBM Plex Mono' }}>
              Phone: {phone}
            </p>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: '#6D5DF6', background: 'rgba(109,93,246,0.15)', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
            {orderId}
          </span>
          <p style={{ fontSize: '11px', color: 'rgba(232,236,243,0.6)', margin: '6px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
            <Calendar size={11} /> {orderDate || 'Today'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(232,236,243,0.8)' }}>
          <MapPin size={14} color="#12897F" /> {pickupLocation}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#12897F', fontWeight: 600 }}>
          <CheckCircle2 size={13} /> {status}
        </span>
      </div>
    </div>
  );
}
