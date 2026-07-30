/* MedicineAutocomplete.tsx — Autocomplete input for hospital catalog drugs */

import { useState } from 'react';

const COMMON_DRUGS = [
  { name: 'Dolo 650', strength: '650mg' },
  { name: 'Pan 40', strength: '40mg' },
  { name: 'Azithromycin 500', strength: '500mg' },
  { name: 'Amoxicillin 500', strength: '500mg' },
  { name: 'Paracetamol 650', strength: '650mg' },
  { name: 'Cetzine 10', strength: '10mg' },
  { name: 'Metformin 500', strength: '500mg' },
  { name: 'Pantocid D SR', strength: '40mg/30mg' },
  { name: 'Augmentin 625 Duo', strength: '625mg' },
  { name: 'Combiflam', strength: '400mg/325mg' },
];

interface MedicineAutocompleteProps {
  value: string;
  onChange: (value: string, defaultStrength?: string) => void;
  placeholder?: string;
}

export default function MedicineAutocomplete({
  value,
  onChange,
  placeholder = 'Medicine name...',
}: MedicineAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = COMMON_DRUGS.filter((d) =>
    d.name.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: '6px',
          border: '1.5px solid #E3E8EE',
          fontFamily: 'Space Grotesk,sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          color: '#101A2E',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {showSuggestions && value && filtered.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            marginTop: '4px',
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid #E3E8EE',
            boxShadow: '0 8px 24px rgba(16,26,46,0.12)',
            zIndex: 100,
            maxHeight: '180px',
            overflowY: 'auto',
          }}
        >
          {filtered.map((item, i) => (
            <div
              key={i}
              onMouseDown={() => {
                onChange(item.name, item.strength);
                setShowSuggestions(false);
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid #F6F8FA' : 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#EFECFE')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 600, color: '#101A2E' }}>
                {item.name}
              </span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '11px', color: '#5B6B82' }}>
                {item.strength}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
