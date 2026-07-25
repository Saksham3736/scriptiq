/* DrugInteractionBanner.tsx — Alert Coral warning for drug interactions & safety flags */

import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { useState } from 'react';
import type { Medicine } from '@/store/draftStore';

interface DrugInteractionBannerProps {
  medicines: Medicine[];
}

export default function DrugInteractionBanner({ medicines }: DrugInteractionBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !medicines || medicines.length === 0) return null;

  const names = medicines.map((m) => (m.name || '').toLowerCase());

  // Rule 1: Multiple NSAIDs / Paracetamol combinations
  const painkillerCount = names.filter((n) =>
    n.includes('paracetamol') ||
    n.includes('dolo') ||
    n.includes('crocin') ||
    n.includes('combiflam') ||
    n.includes('ibuprofen') ||
    n.includes('diclofenac') ||
    n.includes('naproxen')
  ).length;

  const hasMultiplePainkillers = painkillerCount >= 2;

  // Rule 2: Strong NSAID prescribed without PPI (Pan-40 / Pantoprazole / Omez / Omeprazole)
  const hasStrongNSAID = names.some((n) => n.includes('ibuprofen') || n.includes('diclofenac') || n.includes('naproxen') || n.includes('combiflam'));
  const hasPPI = names.some((n) => n.includes('pantoprazole') || n.includes('pan-40') || n.includes('omeprazole') || n.includes('omez') || n.includes('rabeprazole'));
  const missingPPIWarning = hasStrongNSAID && !hasPPI;

  // Rule 3: Multiple Antibiotics
  const antibioticCount = names.filter((n) =>
    n.includes('azithromycin') ||
    n.includes('amoxicillin') ||
    n.includes('ciprofloxacin') ||
    n.includes('ofloxacin') ||
    n.includes('cefixime') ||
    n.includes('augmentin')
  ).length;
  const hasMultipleAntibiotics = antibioticCount >= 2;

  let title = '';
  let description = '';

  if (hasMultiplePainkillers) {
    title = 'Potential Duplicate Analgesic Warning';
    description = 'Multiple Paracetamol / NSAID analgesics detected in the same prescription. Verify cumulative daily limits to avoid toxicity.';
  } else if (hasMultipleAntibiotics) {
    title = 'Dual Antibiotic Therapy Alert';
    description = 'Multiple broad-spectrum antibiotics detected. Ensure dual antimicrobial therapy is clinically indicated.';
  } else if (missingPPIWarning) {
    title = 'Gastric Protection Recommendation';
    description = 'NSAID painkiller prescribed without a proton-pump inhibitor (e.g. Pantoprazole 40mg). Consider adding gastric protection.';
  } else {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '10px',
        background: '#FDF2F2',
        border: '1.5px solid #F87171',
        color: '#E15554',
        marginBottom: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <ShieldAlert size={18} color="#E15554" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13px', margin: 0 }}>
            {title}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5B6B82', margin: '3px 0 0 0', lineHeight: 1.4 }}>
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#5B6B82',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
        }}
        title="Dismiss warning"
      >
        <X size={14} />
      </button>
    </div>
  );
}
