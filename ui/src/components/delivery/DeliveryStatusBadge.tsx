/* DeliveryStatusBadge.tsx — Real-time delivery status pill component */

import { CheckCircle2, Clock, Send, Eye, MessageSquare } from 'lucide-react';

export type DeliveryState = 'draft' | 'pending' | 'sent' | 'delivered' | 'viewed';

interface DeliveryStatusBadgeProps {
  status?: DeliveryState;
  channel?: string;
}

export default function DeliveryStatusBadge({
  status = 'draft',
  channel = 'System',
}: DeliveryStatusBadgeProps) {
  const configs: Record<DeliveryState, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
    draft: { label: 'Draft', bg: '#FAFBFC', color: '#5B6B82', icon: <Clock size={11} /> },
    pending: { label: 'Sending...', bg: '#FCF1DE', color: '#E8A33D', icon: <Send size={11} /> },
    sent: { label: `Sent via ${channel}`, bg: '#EFECFE', color: '#6D5DF6', icon: <MessageSquare size={11} /> },
    delivered: { label: 'Delivered', bg: '#E4F3F1', color: '#12897F', icon: <CheckCircle2 size={11} /> },
    viewed: { label: 'Viewed by Patient', bg: '#E4F3F1', color: '#0F7268', icon: <Eye size={11} /> },
  };

  const config = configs[status] || configs.draft;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 9px',
        borderRadius: '99px',
        background: config.bg,
        color: config.color,
        fontFamily: 'IBM Plex Mono,monospace',
        fontSize: '11px',
        fontWeight: 600,
      }}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
