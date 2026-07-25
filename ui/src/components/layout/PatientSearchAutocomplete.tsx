/* PatientSearchAutocomplete.tsx — Live Patient Search Navbar Autocomplete Popup for Doctor Console */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, X, ChevronRight } from 'lucide-react';
import { useDraftStore, type PrescriptionDraft } from '@/store/draftStore';
import { useRecordingStore } from '@/store/recordingStore';
import { useUIStore } from '@/store/uiStore';

interface ConsultationDoc {
  _id?: string;
  patient_name?: string;
  phone?: string;
  dob?: string;
  consultation_date?: string;
  chief_complaint?: string;
  symptoms?: string[];
  diagnosis?: string;
  medicines?: any[];
  tests?: string[];
  general_advice?: string[];
  advice?: string[];
  follow_up?: string;
  pdf_path?: string;
  transcript?: string;
}

export default function PatientSearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState<ConsultationDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const setDraft = useDraftStore((s) => s.setDraft);
  const setSavedId = useDraftStore((s) => s.setSavedId);
  const setTranscript = useRecordingStore((s) => s.setTranscript);
  const setPartialText = useRecordingStore((s) => s.setPartialText);
  const setStatus = useRecordingStore((s) => s.setStatus);
  const addToast = useUIStore((s) => s.addToast);
  const setPrescriptionStatus = useUIStore((s) => s.setPrescriptionStatus);

  useEffect(() => {
    fetchConsultations();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/consultations?limit=100');
      const json = await res.json();
      if (json.success && json.data?.prescriptions) {
        setRecords(json.data.prescriptions);
      }
    } catch (err) {
      console.error('[PatientSearchAutocomplete] Failed to load consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  const results = records.filter((r) => {
    if (!query.trim()) return false;
    const term = query.toLowerCase().trim();
    return (
      (r.patient_name || '').toLowerCase().includes(term) ||
      (r.phone || '').includes(term) ||
      (r.diagnosis || '').toLowerCase().includes(term) ||
      (r.chief_complaint || '').toLowerCase().includes(term)
    );
  });

  const handleSelectPatient = (doc: ConsultationDoc) => {
    const draft: PrescriptionDraft = {
      patient_name: doc.patient_name || '',
      phone: doc.phone || '',
      dob: doc.dob || '',
      symptoms: doc.symptoms || (doc.chief_complaint ? [doc.chief_complaint] : []),
      diagnosis: doc.diagnosis || '',
      medicines: doc.medicines || [],
      tests: doc.tests || [],
      advice: doc.advice || doc.general_advice || [],
      follow_up: doc.follow_up || '',
      doctor_name: 'Dr. Arjun Sharma',
      clinic_name: 'Apollo Clinic, Delhi',
      consultation_date: doc.consultation_date || new Date().toISOString(),
    };

    setDraft(draft);
    if (doc._id) setSavedId(doc._id);

    const transcriptContent = doc.transcript ||
      `Patient ${doc.patient_name || 'Patient'} presented with ${doc.symptoms?.join(', ') || doc.chief_complaint || 'symptoms'}. Diagnosed with ${doc.diagnosis || 'medical condition'}. Prescribed ${doc.medicines?.map(m => m.name).join(', ') || 'medications'}.`;

    setTranscript(transcriptContent);
    setPartialText('');
    setStatus('done');
    setPrescriptionStatus('Reviewed');

    setQuery('');
    setIsOpen(false);

    // Navigate to patient dossier / details page
    if (doc._id) {
      navigate(`/patients?id=${doc._id}`);
      addToast({
        type: 'info',
        title: 'Opening Patient Dossier',
        message: `Viewing clinical record and PDF options for ${doc.patient_name || 'Patient'}.`,
      });
    } else {
      navigate('/patients');
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '280px' }}>
      {/* Search Input Box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 14px',
          borderRadius: '10px',
          border: isOpen ? '1.5px solid #12897F' : '1.5px solid var(--color-border, #E3E8EE)',
          background: 'var(--color-bg-subtle, #F6F8FA)',
          transition: 'all 0.2s ease',
          boxShadow: isOpen ? 'var(--shadow-xs)' : 'none',
        }}
      >
        <Search size={14} color={isOpen ? '#12897F' : 'var(--color-ink-500, #5B6B82)'} style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onFocus={() => {
            fetchConsultations();
            setIsOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search patient name, phone, diagnosis..."
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: 'var(--color-ink-900, #101A2E)',
            width: '100%',
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink-500, #5B6B82)', padding: 0, display: 'flex' }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown Popup Navbar */}
      {isOpen && query.trim() && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '380px',
            background: 'var(--color-bg-surface, #FFFFFF)',
            border: '1px solid var(--color-border, #E3E8EE)',
            borderRadius: '14px',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 1000,
            overflow: 'hidden',
            maxHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: '10px 16px',
              background: 'var(--color-bg-subtle, #F8FAFC)',
              borderBottom: '1px solid var(--color-border, #E2E8F0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #5B6B82)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Patient Matches ({results.length})
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--color-ink-500, #94A3B8)' }}>
              Click to view details & PDF
            </span>
          </div>

          {/* Results List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
            {results.length > 0 ? (
              results.map((doc) => (
                <div
                  key={doc._id || Math.random().toString()}
                  onClick={() => handleSelectPatient(doc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    borderBottom: '1px solid var(--color-border, #F1F5F9)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-subtle, #F0FDF4)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'var(--color-primary-light, #E4F3F1)',
                        color: '#12897F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Space Grotesk',
                        fontWeight: 700,
                        fontSize: '13px',
                        flexShrink: 0,
                      }}
                    >
                      {(doc.patient_name || 'P').charAt(0)}
                    </div>

                    <div>
                      <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13.5px', color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                        {doc.patient_name || 'Anonymous Patient'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                        {doc.phone && (
                          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10.5px', color: 'var(--color-ink-500, #5B6B82)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Phone size={10} /> {doc.phone}
                          </span>
                        )}
                        {doc.diagnosis && (
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#12897F', background: 'var(--color-primary-light, #E4F3F1)', padding: '1px 6px', borderRadius: '4px', fontWeight: 500 }}>
                            {doc.diagnosis}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={15} color="var(--color-ink-500, #94A3B8)" />
                </div>
              ))
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-ink-500, #5B6B82)', fontSize: '12px' }}>
                No patient records match "{query}".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
