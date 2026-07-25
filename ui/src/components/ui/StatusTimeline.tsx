/* StatusTimeline.tsx — Stepper component tracking prescription lifecycle status */

import { Check, Clock, FileEdit, Database, Send, Eye } from 'lucide-react';
import { useUIStore, type PrescriptionLifecycleStatus } from '@/store/uiStore';
import { useDraftStore } from '@/store/draftStore';

const STEPS: { status: PrescriptionLifecycleStatus; label: string; icon: any }[] = [
  { status: 'Draft', label: 'Draft', icon: Clock },
  { status: 'Reviewed', label: 'Reviewed', icon: FileEdit },
  { status: 'Saved', label: 'Saved', icon: Database },
  { status: 'Sent', label: 'Dispatched', icon: Send },
  { status: 'Viewed', label: 'Viewed', icon: Eye },
];

export default function StatusTimeline() {
  const currentStatus = useUIStore((s) => s.prescriptionStatus);
  const deliveryStatus = useDraftStore((s) => s.deliveryStatus);
  const savedId = useDraftStore((s) => s.savedId);

  // Compute active step index based on state
  let activeIndex = STEPS.findIndex((s) => s.status === currentStatus);
  if (deliveryStatus === 'viewed') activeIndex = 4;
  else if (deliveryStatus === 'sent' || deliveryStatus === 'delivered') activeIndex = Math.max(activeIndex, 3);
  else if (savedId) activeIndex = Math.max(activeIndex, 2);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        margin: '0 0 14px 0',
      }}
    >
      {STEPS.map((step, idx) => {
        const isCompleted = idx < activeIndex;
        const isCurrent = idx === activeIndex;
        const StepIcon = step.icon;

        const circleBg = isCompleted ? '#12897F' : isCurrent ? '#E4F3F1' : '#E2E8F0';
        const circleBorder = isCompleted ? '#12897F' : isCurrent ? '#12897F' : '#CBD5E1';
        const iconColor = isCompleted ? '#FFFFFF' : isCurrent ? '#12897F' : '#94A3B8';
        const labelColor = isCompleted || isCurrent ? '#101A2E' : '#94A3B8';

        return (
          <div key={step.status} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: circleBg,
                  border: `1.5px solid ${circleBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}
              >
                {isCompleted ? (
                  <Check size={13} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <StepIcon size={12} color={iconColor} />
                )}
              </div>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: isCurrent || isCompleted ? 600 : 500,
                  color: labelColor,
                  whiteSpace: 'nowrap',
                }}
              >
                {step.label}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div
                style={{
                  height: '2px',
                  flex: 1,
                  background: idx < activeIndex ? '#12897F' : '#E2E8F0',
                  margin: '0 8px',
                  transition: 'background 0.25s ease',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
