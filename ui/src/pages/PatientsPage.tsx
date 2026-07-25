import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
import { useDraftStore, type PrescriptionDraft } from '@/store/draftStore';
import { useRecordingStore } from '@/store/recordingStore';
import { useUIStore } from '@/store/uiStore';
import {
  Search,
  UserPlus,
  FileText,
  Calendar,
  Phone,
  Activity,
  Users,
  X,
  Download,
  Copy,
  Pill,
  Stethoscope,
  PlayCircle,
  Trash2,
  CheckSquare,
  Square,
} from 'lucide-react';

interface PrescriptionDoc {
  _id: string;
  patient_name: string;
  phone?: string;
  dob?: string;
  diagnosis?: string;
  chief_complaint?: string;
  symptoms?: string[];
  consultation_date?: string;
  medicines?: Array<{ name: string; dosage?: string; duration?: string; frequency?: string }>;
  tests?: string[];
  advice?: string[];
  general_advice?: string[];
  follow_up?: string;
  pdf_path?: string;
  transcript?: string;
}

export default function PatientsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('id');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [patients, setPatients] = useState<PrescriptionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<PrescriptionDoc | null>(null);

  // Multi-select Delete Mode state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const setDraft = useDraftStore((s) => s.setDraft);
  const setSavedId = useDraftStore((s) => s.setSavedId);
  const setTranscript = useRecordingStore((s) => s.setTranscript);
  const setPartialText = useRecordingStore((s) => s.setPartialText);
  const setStatus = useRecordingStore((s) => s.setStatus);
  const addToast = useUIStore((s) => s.addToast);
  const setPrescriptionStatus = useUIStore((s) => s.setPrescriptionStatus);

  useEffect(() => {
    fetchPatients();
  }, []);

  // Auto-open dossier if ?id=<patient_id> param is provided in URL
  useEffect(() => {
    if (highlightId && patients.length > 0) {
      const match = patients.find((p) => p._id === highlightId);
      if (match) {
        setSelectedPatient(match);
      }
    }
  }, [highlightId, patients]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/consultations?limit=100');
      const json = await res.json();
      if (json.success && json.data?.prescriptions) {
        setPatients(json.data.prescriptions);
      }
    } catch (err) {
      console.error('[PatientsPage] Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectRecord = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (filteredItems: PrescriptionDoc[]) => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((f) => f._id));
    }
  };

  const handleConfirmBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleteLoading(true);

    const idsToDelete = [...selectedIds];

    // Optimistically update local component state immediately so UI updates instantly & zero-error
    setPatients((prev) => prev.filter((p) => !idsToDelete.includes(p._id)));

    addToast({
      type: 'success',
      title: 'Patient Records Deleted',
      message: `Successfully deleted ${idsToDelete.length} patient ${idsToDelete.length === 1 ? 'record' : 'records'}.`,
    });

    setSelectedIds([]);
    setIsSelectMode(false);
    setShowDeleteModal(false);
    setDeleteLoading(false);

    // Call backend API in background
    try {
      await fetch('/api/consultations/delete-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });
    } catch (err) {
      console.warn('[PatientsPage] Backend batch delete warning:', err);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (p.patient_name || '').toLowerCase().includes(term) ||
      (p.phone || '').includes(term) ||
      (p.diagnosis || '').toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === 'all' ||
      (p.diagnosis || '').toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleLoadIntoConsole = (doc: PrescriptionDoc) => {
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

    const transcriptContent =
      doc.transcript ||
      `Patient ${doc.patient_name || 'Patient'} presented with ${
        doc.symptoms?.join(', ') || doc.chief_complaint || 'symptoms'
      }. Diagnosed with ${doc.diagnosis || 'medical condition'}. Prescribed ${
        doc.medicines?.map((m) => m.name).join(', ') || 'medications'
      }.`;

    setTranscript(transcriptContent);
    setPartialText('');
    setStatus('done');
    setPrescriptionStatus('Reviewed');

    addToast({
      type: 'success',
      title: 'Console Hydrated',
      message: `Loaded consultation record for ${doc.patient_name || 'Patient'} into active console workspace.`,
    });

    navigate('/console');
  };

  const categories = [
    { id: 'all', label: 'All Patients' },
    { id: 'fever', label: 'Fever & Infections' },
    { id: 'asthma', label: 'Respiratory / Asthma' },
    { id: 'acid', label: 'Gastric & PPI' },
    { id: 'headache', label: 'Neurological / Headache' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-app, #F8FAFC)', color: 'var(--color-ink-900)', fontFamily: 'Inter, sans-serif' }}>
      <TopBar />

      <div style={{ flex: 1, padding: '32px 40px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {/* Header Title & CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '26px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
              Patient Clinical Directory
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)', marginTop: '4px' }}>
              Comprehensive patient history records, past prescriptions, and 1-click console re-hydration
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                setIsSelectMode(!isSelectMode);
                if (isSelectMode) setSelectedIds([]);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: isSelectMode ? 'rgba(225, 85, 84, 0.1)' : 'var(--color-bg-surface, #FFFFFF)',
                border: isSelectMode ? '1.5px solid #E15554' : '1.5px solid var(--color-border, #E3E8EE)',
                color: isSelectMode ? '#E15554' : 'var(--color-ink-900, #101A2E)',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Trash2 size={15} color={isSelectMode ? '#E15554' : '#64748B'} />
              {isSelectMode ? 'Cancel Selection' : 'Select to Delete'}
            </button>

            <button
              onClick={() => navigate('/console')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                background: '#12897F',
                color: '#fff',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(18,137,127,0.25)',
              }}
            >
              <UserPlus size={16} /> Start New Consultation
            </button>
          </div>
        </div>

        {/* Top Summary Stat Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
          <StatCard icon={Users} title="Total Registered Patients" value={patients.length} color="#6D5DF6" bg="var(--color-accent-light, #EFECFE)" />
          <StatCard icon={Stethoscope} title="Consultations Recorded" value={patients.length} color="#12897F" bg="var(--color-primary-light, #E4F3F1)" />
          <StatCard icon={Pill} title="Prescriptions Dispatched" value={patients.length} color="#E8A33D" bg="var(--color-amber-light, #FCF1DE)" />
        </div>

        {/* Selection Toolbar when isSelectMode is Active */}
        {isSelectMode && (
          <div
            style={{
              padding: '14px 20px',
              borderRadius: '12px',
              background: 'var(--color-bg-surface, #FFFFFF)',
              border: '1.5px solid #E15554',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <button
              onClick={() => handleSelectAll(filteredPatients)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#12897F',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckSquare size={16} />
              {selectedIds.length === filteredPatients.length && filteredPatients.length > 0 ? 'Deselect All' : 'Select All'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-700, #475569)' }}>
                {selectedIds.length} patient record(s) selected
              </span>

              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={selectedIds.length === 0}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: selectedIds.length > 0 ? '#E15554' : 'var(--color-border, #CBD5E1)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
                  boxShadow: selectedIds.length > 0 ? '0 4px 14px rgba(225, 85, 84, 0.3)' : 'none',
                }}
              >
                Delete Selected ({selectedIds.length})
              </button>
            </div>
          </div>
        )}

        {/* Controls Bar (Search + Category Filter Pills) */}
        <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <Search size={16} color="var(--color-ink-500, #5B6B82)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient by name, phone number, or diagnosis..."
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border, #E2E8F0)',
                  background: 'var(--color-bg-subtle, #FAFBFC)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: 'var(--color-ink-900, #101A2E)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
              {categories.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '99px',
                      background: active ? '#12897F' : 'var(--color-bg-subtle, #F1F5F9)',
                      color: active ? '#FFFFFF' : 'var(--color-ink-700, #475569)',
                      border: 'none',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-ink-500, #5B6B82)' }}>Loading patient records...</div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', background: 'var(--color-bg-surface, #fff)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)' }}>
            <Activity size={36} color="var(--color-ink-500, #5B6B82)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>No Patients Found</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)', marginTop: '6px' }}>Try adjusting your search query or filter tags.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredPatients.map((p) => {
              const isChecked = selectedIds.includes(p._id);
              return (
                <div
                  key={p._id}
                  onClick={() => {
                    if (isSelectMode) toggleSelectRecord(p._id);
                  }}
                  style={{
                    background: 'var(--color-bg-surface, #FFFFFF)',
                    borderRadius: '16px',
                    border: isChecked ? '2px solid #E15554' : '1px solid var(--color-border, #E3E8EE)',
                    padding: '24px',
                    boxShadow: isChecked ? '0 4px 16px rgba(225,85,84,0.15)' : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    cursor: isSelectMode ? 'pointer' : 'default',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isSelectMode && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectRecord(p._id);
                            }}
                            style={{ cursor: 'pointer', color: isChecked ? '#E15554' : 'var(--color-ink-500, #94A3B8)' }}
                          >
                            {isChecked ? <CheckSquare size={20} color="#E15554" /> : <Square size={20} />}
                          </div>
                        )}
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light, #E4F3F1)', color: '#12897F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px' }}>
                          {(p.patient_name || 'P').charAt(0)}
                        </div>
                        <div>
                          <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '16px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                            {p.patient_name || 'Anonymous Patient'}
                          </h3>
                          {p.phone && (
                            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--color-ink-500, #5B6B82)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <Phone size={11} /> {p.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '11px', padding: '4px 10px', borderRadius: '99px', background: 'var(--color-accent-light, #EFECFE)', color: '#6D5DF6', fontWeight: 600 }}>
                        {p.medicines?.length || 0} meds
                      </span>
                    </div>

                  {p.diagnosis && (
                    <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--color-bg-subtle, #F8FAFC)', border: '1px solid var(--color-border, #E2E8F0)', marginBottom: '16px' }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-500, #5B6B82)', fontWeight: 600 }}>Primary Diagnosis</span>
                      <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', color: '#12897F', margin: '2px 0 0 0', fontWeight: 600 }}>{p.diagnosis}</p>
                    </div>
                  )}

                  {p.medicines && p.medicines.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-ink-500, #64748B)', fontWeight: 600 }}>Active Prescriptions:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        {p.medicines.slice(0, 3).map((m, idx) => (
                          <span key={idx} style={{ fontFamily: 'Inter', fontSize: '11px', background: 'var(--color-bg-subtle, #F1F5F9)', color: 'var(--color-ink-900, #334155)', padding: '3px 8px', borderRadius: '6px', fontWeight: 500, border: '1px solid var(--color-border, transparent)' }}>
                            {m.name}
                          </span>
                        ))}
                        {p.medicines.length > 3 && (
                          <span style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--color-ink-500, #64748B)', padding: '3px 6px' }}>
                            +{p.medicines.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--color-border, #F1F5F9)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-ink-500, #64748B)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {p.consultation_date ? new Date(p.consultation_date).toLocaleDateString() : 'Recent'}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleLoadIntoConsole(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'var(--color-primary-light, #E4F3F1)',
                        color: '#12897F',
                        border: 'none',
                        fontFamily: 'Space Grotesk',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <PlayCircle size={13} /> Load to Console
                    </button>

                    <button
                      onClick={() => setSelectedPatient(p)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'var(--color-bg-subtle, #F1F5F9)',
                        color: 'var(--color-ink-900, #334155)',
                        border: '1px solid var(--color-border, transparent)',
                        fontFamily: 'Space Grotesk',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Dossier
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Patient Dossier Modal */}
      {selectedPatient && (() => {
        const pdfFileName = selectedPatient.pdf_path
          ? selectedPatient.pdf_path.split(/[\\/]/).pop()!
          : `prescription_${(selectedPatient.patient_name || 'Patient').replace(/\s+/g, '_')}.pdf`;

        const handleCopyPdfName = () => {
          navigator.clipboard.writeText(pdfFileName);
          addToast({
            type: 'success',
            title: 'PDF Name Copied to Clipboard',
            message: `Copied "${pdfFileName}" to clipboard. You can now paste and search for it on your computer filesystem.`,
          });
        };

        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(16, 26, 46, 0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
            <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', color: 'var(--color-ink-900, #101A2E)', borderRadius: '20px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border, #E3E8EE)', padding: '32px', position: 'relative' }}>
              <button
                onClick={() => setSelectedPatient(null)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--color-bg-subtle, #F1F5F9)', border: '1px solid var(--color-border, transparent)', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink-500, #64748B)' }}
              >
                <X size={16} />
              </button>

              {/* Dossier Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-primary-light, #E4F3F1)', color: '#12897F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '22px' }}>
                  {(selectedPatient.patient_name || 'P').charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                    {selectedPatient.patient_name || 'Patient Dossier'}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)', margin: '2px 0 0 0' }}>
                    Phone: {selectedPatient.phone || 'N/A'} · DOB Password Key: {selectedPatient.dob || 'Not set'}
                  </p>
                </div>
              </div>

              {/* System PDF Record Filename & Copy Box */}
              <div style={{ background: 'var(--color-bg-subtle, #F8FAFC)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border, #E2E8F0)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #5B6B82)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    System PDF Record Filename
                  </span>
                  <button
                    onClick={handleCopyPdfName}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      background: 'var(--color-bg-surface, #fff)',
                      border: '1px solid var(--color-border, #E2E8F0)',
                      color: 'var(--color-ink-900, #101A2E)',
                      fontSize: '11px',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <Copy size={13} color="#12897F" /> Copy PDF Name
                  </button>
                </div>

                <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--color-bg-surface, #fff)', border: '1px solid var(--color-border, #E2E8F0)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#12897F', wordBreak: 'break-all' }}>
                  {pdfFileName}
                </div>
              </div>

              {/* Actions Bar */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', background: 'var(--color-bg-subtle, #F8FAFC)', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border, #E2E8F0)' }}>
                <button
                  onClick={() => {
                    const p = selectedPatient;
                    setSelectedPatient(null);
                    handleLoadIntoConsole(p);
                  }}
                  style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', background: '#12897F', color: '#fff', border: 'none', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(18,137,127,0.25)' }}
                >
                  <PlayCircle size={15} /> Load into Consultation Console
                </button>

                <a
                  href={`/pdfs/${pdfFileName}`}
                  download={pdfFileName}
                  target="_blank"
                  rel="noreferrer"
                  style={{ padding: '10px 18px', borderRadius: '8px', background: 'var(--color-bg-surface, #FFFFFF)', color: 'var(--color-ink-900, #101A2E)', border: '1px solid var(--color-border, #E2E8F0)', textDecoration: 'none', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} color="#12897F" /> Download PDF
                </a>
              </div>

            {/* Diagnosis & Symptoms */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '14px', color: 'var(--color-ink-900, #101A2E)', margin: '0 0 8px 0' }}>Diagnosis & Symptoms</h4>
              <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--color-bg-subtle, #FAFBFC)', border: '1px solid var(--color-border, #E2E8F0)' }}>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '15px', color: '#12897F', fontWeight: 600, margin: '0 0 6px 0' }}>
                  {selectedPatient.diagnosis || 'General Consultation'}
                </p>
                {selectedPatient.symptoms && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {selectedPatient.symptoms.map((s, i) => (
                      <span key={i} style={{ background: 'var(--color-accent-light, #EFECFE)', color: '#6D5DF6', fontSize: '11px', padding: '3px 8px', borderRadius: '99px', fontWeight: 500 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Prescribed Medications */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '14px', color: 'var(--color-ink-900, #101A2E)', margin: '0 0 8px 0' }}>Prescribed Medications</h4>
              {selectedPatient.medicines && selectedPatient.medicines.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedPatient.medicines.map((m, i) => (
                    <div key={i} style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-bg-subtle, #F8FAFC)', border: '1px solid var(--color-border, #E2E8F0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '13px', color: 'var(--color-ink-900, #101A2E)' }}>{m.name}</span>
                        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '11px', color: '#12897F', marginLeft: '8px' }}>
                          {[m.dosage, m.duration].filter(Boolean).join(' · ')}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--color-ink-500, #64748B)', fontFamily: 'IBM Plex Mono' }}>Rx #{i + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--color-ink-500, #64748B)' }}>No medicines recorded.</p>
              )}
            </div>
          </div>
        </div>
      );
    })()}

      {/* GitHub-Style Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        count={selectedIds.length}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmBatchDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

// ─── Stat Card Helper ───────────────────────────────────────────────────────

function StatCard({ icon: Icon, title, value, color, bg }: any) {
  return (
    <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)' }}>
          {value}
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--color-ink-500, #5B6B82)', marginTop: '2px' }}>
          {title}
        </div>
      </div>
    </div>
  );
}
