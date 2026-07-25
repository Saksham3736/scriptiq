/* MedicineRow.tsx — Prescribed medicine row with inline editing & autocomplete */

import { useState } from 'react';
import { Trash2, Edit2, Check } from 'lucide-react';
import MedicineAutocomplete from './MedicineAutocomplete';
import type { Medicine } from '@/store/draftStore';

interface MedicineRowProps {
  index: number;
  med: Medicine;
  onRemove: (index: number) => void;
  onUpdate: (index: number, updated: Medicine) => void;
}

export default function MedicineRow({ index, med, onRemove, onUpdate }: MedicineRowProps) {
  // Auto-open edit mode if medicine name is empty (e.g. freshly added medicine)
  const [isEditing, setIsEditing] = useState(!med.name);

  const metaText = [med.dosage, med.frequency, med.duration, med.timing].filter(Boolean).join(' · ');

  const handleNameChange = (name: string, defaultStrength?: string) => {
    onUpdate(index, {
      ...med,
      name,
      strength: defaultStrength || med.strength,
    });
  };

  const handleChange = (field: keyof Medicine, val: string) => {
    onUpdate(index, { ...med, [field]: val });
  };

  if (isEditing) {
    return (
      <div
        style={{
          padding: '14px',
          borderRadius: '10px',
          border: '1.5px solid #6D5DF6',
          background: '#EFECFE22',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', fontWeight: 600, color: '#6D5DF6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Edit Medicine #{index + 1}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: '#12897F',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Check size={13} /> Done
            </button>
            <button
              onClick={() => onRemove(index)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#E15554',
                padding: '4px',
              }}
              title="Delete medicine"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Drug Name with Autocomplete */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: '#5B6B82', marginBottom: '4px', fontWeight: 500 }}>Medicine Name</label>
          <MedicineAutocomplete
            value={med.name || ''}
            onChange={handleNameChange}
            placeholder="Type or select drug (e.g. Paracetamol 650)..."
          />
        </div>

        {/* Strength & Dosage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)', marginBottom: '4px', fontWeight: 500 }}>Strength</label>
            <input
              type="text"
              value={med.strength || ''}
              onChange={(e) => handleChange('strength', e.target.value)}
              placeholder="e.g. 650mg / 40mg"
              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--color-border, #E3E8EE)', background: 'var(--color-bg-surface, #FFFFFF)', fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--color-ink-900, #101A2E)', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)', marginBottom: '4px', fontWeight: 500 }}>Dosage</label>
            <input
              type="text"
              value={med.dosage || ''}
              onChange={(e) => handleChange('dosage', e.target.value)}
              placeholder="e.g. 1 tablet"
              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--color-border, #E3E8EE)', background: 'var(--color-bg-surface, #FFFFFF)', fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--color-ink-900, #101A2E)', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Frequency & Duration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)', marginBottom: '4px', fontWeight: 500 }}>Frequency</label>
            <input
              type="text"
              value={med.frequency || ''}
              onChange={(e) => handleChange('frequency', e.target.value)}
              placeholder="e.g. twice daily / 1-0-1"
              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--color-border, #E3E8EE)', background: 'var(--color-bg-surface, #FFFFFF)', fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--color-ink-900, #101A2E)', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)', marginBottom: '4px', fontWeight: 500 }}>Duration</label>
            <input
              type="text"
              value={med.duration || ''}
              onChange={(e) => handleChange('duration', e.target.value)}
              placeholder="e.g. 5 days / 1 week"
              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--color-border, #E3E8EE)', background: 'var(--color-bg-surface, #FFFFFF)', fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--color-ink-900, #101A2E)', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1.5px solid var(--color-border, #E3E8EE)',
        background: 'var(--color-bg-subtle, #FAFBFC)',
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-start',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
          {med.name || 'Medicine Name'}
          {med.strength && (
            <span style={{ fontFamily: 'IBM Plex Mono,monospace', fontWeight: 400, fontSize: '12px', color: 'var(--color-ink-500, #5B6B82)', marginLeft: '6px', background: 'var(--color-border, #E3E8EE)', padding: '1px 5px', borderRadius: '4px' }}>
              {med.strength}
            </span>
          )}
        </p>

        {metaText ? (
          <p style={{ fontFamily: 'IBM Plex Mono,monospace', fontSize: '11px', color: '#12897F', marginTop: '4px', margin: '4px 0 0 0' }}>
            {metaText}
          </p>
        ) : (
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: '#5B6B82', marginTop: '2px', fontStyle: 'italic', margin: '2px 0 0 0' }}>
            No dosage specified — click edit to add
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
        <button
          onClick={() => setIsEditing(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#5B6B82',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
          title="Edit Medicine"
        >
          <Edit2 size={14} color="#5B6B82" />
        </button>
        <button
          onClick={() => onRemove(index)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#5B6B82',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
          title="Remove Medicine"
        >
          <Trash2 size={14} color="#5B6B82" />
        </button>
      </div>
    </div>
  );
}
