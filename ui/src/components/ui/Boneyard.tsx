/**
 * Boneyard — ScriptIQ Skeleton Loading Components
 * Reusable shimmer-based placeholders for all screens.
 *
 * Usage:
 *   import { Bone, BonePrescriptionCard, BoneHistoryItem } from '@/components/ui/Boneyard'
 *
 *   // Single generic bone
 *   <Bone className="bone-line bone-w-half" />
 *
 *   // Composed skeletons
 *   <BonePrescriptionCard />
 *   <BoneHistoryItem />
 *   <BoneDraftPanel />
 *   <BoneMedicineRow />
 *   <BoneConsole />
 */

import React from 'react';
import '../../styles/boneyard.css';

// ─── Base Bone ────────────────────────────────────────────────────────────────

interface BoneProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Bone: React.FC<BoneProps> = ({ className = '', style }) => (
  <span className={`bone ${className}`} style={style} aria-hidden="true" />
);

// ─── Prescription Card Skeleton ──────────────────────────────────────────────

export const BonePrescriptionCard: React.FC = () => (
  <div className="boneyard-prescription-card" aria-busy="true" aria-label="Loading prescription...">
    {/* Header row: patient name + date */}
    <div className="boneyard-row">
      <Bone className="bone-circle bone-circle-md" />
      <div className="boneyard" style={{ flex: 1, gap: '6px' }}>
        <Bone className="bone-line bone-line-lg bone-w-2-3" />
        <Bone className="bone-line bone-line-sm bone-w-qtr" />
      </div>
      <Bone className="bone-pill" style={{ width: '72px' }} />
    </div>

    {/* Divider */}
    <Bone className="bone-line" style={{ height: '1px', opacity: 0.5 }} />

    {/* Diagnosis line */}
    <div className="boneyard" style={{ gap: '6px' }}>
      <Bone className="bone-line bone-line-sm bone-w-qtr bone-delay-1" />
      <Bone className="bone-line bone-w-half bone-delay-1" />
    </div>

    {/* Medicine rows */}
    {[0, 1, 2].map((i) => (
      <div key={i} className="boneyard-medicine-row">
        <Bone className={`bone-block bone-block-sm bone-delay-${i + 2}`} />
        <div className="boneyard" style={{ flex: 1, gap: '5px' }}>
          <Bone className={`bone-line bone-w-3-4 bone-delay-${i + 2}`} />
          <Bone className={`bone-line bone-line-sm bone-w-half bone-delay-${i + 2}`} />
        </div>
        <Bone className={`bone-pill bone-delay-${i + 2}`} style={{ width: '56px' }} />
      </div>
    ))}

    {/* Footer: action buttons */}
    <div className="boneyard-row" style={{ justifyContent: 'flex-end', gap: '10px' }}>
      <Bone className="bone-btn bone-btn-sm bone-delay-4" style={{ width: '100px' }} />
      <Bone className="bone-btn bone-delay-4" style={{ width: '140px' }} />
    </div>
  </div>
);

// ─── Medicine Row Skeleton ────────────────────────────────────────────────────

export const BoneMedicineRow: React.FC<{ index?: number }> = ({ index = 0 }) => (
  <div className="boneyard-medicine-row" aria-busy="true">
    <Bone className={`bone-block bone-block-sm bone-delay-${index + 1}`} />
    <div className="boneyard" style={{ flex: 1, gap: '5px' }}>
      <Bone className={`bone-line bone-w-3-4 bone-delay-${index + 1}`} />
      <Bone className={`bone-line bone-line-sm bone-w-half bone-delay-${index + 1}`} />
    </div>
    <div className="boneyard" style={{ gap: '4px', alignItems: 'flex-end', minWidth: '80px' }}>
      <Bone className={`bone-line bone-line-sm bone-w-full bone-delay-${index + 2}`} />
      <Bone className={`bone-pill bone-delay-${index + 2}`} style={{ width: '60px' }} />
    </div>
  </div>
);

// ─── History List Item Skeleton ───────────────────────────────────────────────

export const BoneHistoryItem: React.FC<{ index?: number }> = ({ index = 0 }) => (
  <div className="boneyard-history-item" aria-busy="true">
    <Bone className={`bone-circle bone-circle-lg bone-delay-${index % 3}`} />
    <div className="boneyard" style={{ flex: 1, gap: '6px' }}>
      <Bone className={`bone-line bone-line-lg bone-w-2-3 bone-delay-${index % 3}`} />
      <Bone className={`bone-line bone-line-sm bone-w-half bone-delay-${(index % 3) + 1}`} />
      <div className="boneyard-row" style={{ marginTop: '4px' }}>
        <Bone className={`bone-pill bone-delay-${(index % 3) + 1}`} style={{ width: '70px' }} />
        <Bone className={`bone-pill bone-delay-${(index % 3) + 2}`} style={{ width: '90px' }} />
      </div>
    </div>
    <div className="boneyard" style={{ alignItems: 'flex-end', gap: '6px' }}>
      <Bone className={`bone-line bone-line-sm bone-delay-${index % 3}`} style={{ width: '60px' }} />
      <Bone className={`bone-btn bone-btn-sm bone-delay-${(index % 3) + 1}`} style={{ width: '80px' }} />
    </div>
  </div>
);

// ─── Draft Panel Skeleton (right pane of doctor console) ─────────────────────

export const BoneDraftPanel: React.FC = () => (
  <div className="boneyard-draft-panel" aria-busy="true" aria-label="Loading prescription draft...">
    {/* Panel title */}
    <Bone className="bone-line bone-line-xl bone-w-half" />

    {/* Field chips × 5 */}
    {['Symptoms', 'Diagnosis', 'Advice', 'Tests', 'Follow-up'].map((_, i) => (
      <div key={i} className="boneyard" style={{ gap: '6px' }}>
        <Bone className={`bone-line bone-line-sm bone-w-qtr bone-delay-${i + 1}`} />
        <Bone
          className={`bone-card bone-card-sm bone-delay-${i + 1}`}
          style={{ height: '44px', borderRadius: '8px' }}
        />
      </div>
    ))}

    {/* Medicine section header */}
    <Bone className="bone-line bone-line-md bone-w-third bone-delay-3" />
    {[0, 1].map((i) => (
      <BoneMedicineRow key={i} index={i + 3} />
    ))}

    {/* Action bar */}
    <div className="boneyard-row" style={{ marginTop: '8px', justifyContent: 'flex-end', gap: '10px' }}>
      <Bone className="bone-btn bone-btn-sm bone-delay-5" style={{ width: '120px' }} />
      <Bone className="bone-btn bone-delay-5" style={{ width: '160px' }} />
    </div>
  </div>
);

// ─── Transcript Panel Skeleton (center pane) ──────────────────────────────────

export const BoneTranscriptPanel: React.FC = () => (
  <div className="boneyard" style={{ padding: '24px', gap: '16px' }} aria-busy="true">
    {/* Mode toggle */}
    <div className="boneyard-row" style={{ gap: '8px' }}>
      <Bone className="bone-pill" style={{ width: '90px', height: '32px' }} />
      <Bone className="bone-pill" style={{ width: '90px', height: '32px' }} />
    </div>

    {/* Transcript bubbles */}
    {[100, 80, 90, 65, 75].map((w, i) => (
      <div key={i} className="boneyard" style={{ gap: '5px' }}>
        <Bone className={`bone-line bone-line-sm bone-w-qtr bone-delay-${i % 3}`} style={{ opacity: 0.5 }} />
        <Bone
          className={`bone-card bone-delay-${i % 3}`}
          style={{ width: `${w}%`, height: '48px', borderRadius: '10px' }}
        />
      </div>
    ))}

    {/* Recording indicator */}
    <div className="boneyard-row" style={{ marginTop: '8px', gap: '10px' }}>
      <Bone className="bone-circle bone-circle-md bone-delay-1" />
      <Bone className="bone-line bone-w-third bone-delay-1" />
    </div>
  </div>
);

// ─── Full Doctor Console Skeleton ─────────────────────────────────────────────

export const BoneConsole: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#F6F8FA',
    }}
    aria-busy="true"
    aria-label="Loading doctor console..."
  >
    {/* Top Bar */}
    <div className="boneyard-topbar">
      <div className="boneyard-row" style={{ gap: '10px' }}>
        <Bone className="bone-circle bone-circle-md" />
        <Bone className="bone-line bone-w-full" style={{ width: '140px' }} />
      </div>
      <div className="boneyard-row" style={{ gap: '10px' }}>
        <Bone className="bone-pill" style={{ width: '120px', height: '32px' }} />
        <Bone className="bone-pill" style={{ width: '80px', height: '32px' }} />
      </div>
    </div>

    {/* 3-pane console */}
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Waveform Spine rail */}
      <div style={{ width: '48px', background: '#fff', borderRight: '1px solid #E3E8EE', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '24px', gap: '6px' }}>
        {[60, 35, 80, 45, 90, 55, 70, 40].map((h, i) => (
          <Bone
            key={i}
            className="bone waveform-bar"
            style={{ width: '4px', height: `${h * 0.3}px`, borderRadius: '2px', background: '#6D5DF6', opacity: 0.3 }}
          />
        ))}
      </div>

      {/* Center: Transcript */}
      <div style={{ flex: 1, borderRight: '1px solid #E3E8EE' }}>
        <BoneTranscriptPanel />
      </div>

      {/* Right: Draft */}
      <div style={{ flex: 1 }}>
        <BoneDraftPanel />
      </div>
    </div>
  </div>
);

// ─── Patient History Page Skeleton ────────────────────────────────────────────

export const BoneHistoryPage: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div aria-busy="true" aria-label="Loading history...">
    {/* Page header */}
    <div className="boneyard" style={{ padding: '24px 24px 16px', gap: '8px' }}>
      <Bone className="bone-line bone-line-xl bone-w-third" />
      <Bone className="bone-line bone-line-sm bone-w-half" />
    </div>
    {/* Search bar */}
    <div style={{ padding: '0 24px 20px' }}>
      <Bone className="bone-btn" style={{ width: '100%', height: '44px', borderRadius: '8px' }} />
    </div>
    {/* Items */}
    {Array.from({ length: count }).map((_, i) => (
      <BoneHistoryItem key={i} index={i} />
    ))}
  </div>
);

// ─── Inline Spinner (for buttons / small states) ──────────────────────────────

export const BoneSpinner: React.FC<{ size?: number; color?: string }> = ({
  size = 18,
  color = 'var(--color-pulse-violet)',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    style={{ animation: 'spin 0.9s linear infinite', flexShrink: 0 }}
    aria-hidden="true"
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

// ─── Full-Screen App Loading ──────────────────────────────────────────────────

export const BoneAppLoading: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-ink-navy)',
      gap: '24px',
      zIndex: 9999,
    }}
  >
    {/* Logo wordmark skeleton */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Waveform icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '32px' }}>
        {[40, 70, 100, 55, 80, 45, 65].map((h, i) => (
          <div
            key={i}
            className="waveform-bar"
            style={{
              width: '4px',
              height: `${h * 0.28}px`,
              borderRadius: '2px',
              background: '#6D5DF6',
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>
      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '26px', color: '#F6F8FA', letterSpacing: '-0.5px' }}>
        ScriptIQ
      </span>
    </div>

    {/* Loading bar */}
    <div
      style={{
        width: '200px',
        height: '3px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '99px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #6D5DF6, #12897F)',
          borderRadius: '99px',
          animation: 'loadbar 1.8s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes loadbar {
          0%   { width: 0%; margin-left: 0%; }
          50%  { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>

    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(232,236,243,0.5)', letterSpacing: '0.04em' }}>
      Initializing agents...
    </p>
  </div>
);
