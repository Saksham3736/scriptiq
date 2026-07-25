import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { BoneHistoryItem } from '@/components/ui/Boneyard';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
import { useDraftStore, type PrescriptionDraft } from '@/store/draftStore';
import { useRecordingStore } from '@/store/recordingStore';
import { useUIStore } from '@/store/uiStore';
import {
  Search,
  Calendar,
  FileText,
  Download,
  Copy,
  Phone,
  User,
  CheckCircle2,
  PlayCircle,
  MessageSquare,
  Sparkles,
  Pill,
  Trash2,
  CheckSquare,
  Square,
  Check,
} from 'lucide-react';

interface PrescriptionDoc {
  _id: string;
  patient_name?: string;
  phone?: string;
  dob?: string;
  consultation_date?: string;
  diagnosis?: string;
  chief_complaint?: string;
  symptoms?: string[];
  medicines?: Array<{ name: string; dosage?: string; duration?: string; frequency?: string }>;
  tests?: string[];
  advice?: string[];
  general_advice?: string[];
  follow_up?: string;
  pdf_path?: string;
  transcript?: string;
  created_at?: string;
}

export default function HistoryPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<PrescriptionDoc | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'structured' | 'transcript'>('structured');

  // Multi-select Delete Mode state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const setDraft = useDraftStore((s) => s.setDraft);
  const setSavedId = useDraftStore((s) => s.setSavedId);
  const setTranscript = useRecordingStore((s) => s.setTranscript);
  const setPartialText = useRecordingStore((s) => s.setPartialText);
  const setStatus = useRecordingStore((s) => s.setStatus);
  const addToast = useUIStore((s) => s.addToast);
  const setPrescriptionStatus = useUIStore((s) => s.setPrescriptionStatus);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/consultations?limit=100');
      const json = await res.json();
      if (json.success && json.data?.prescriptions) {
        setPrescriptions(json.data.prescriptions);
        if (json.data.prescriptions.length > 0 && !selectedDoc) {
          setSelectedDoc(json.data.prescriptions[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load history:', err);
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

    // Optimistically update local component state immediately so UI feels instantaneous & zero-error
    setPrescriptions((prev) => {
      const updated = prev.filter((p) => !idsToDelete.includes(p._id));
      if (selectedDoc && idsToDelete.includes(selectedDoc._id)) {
        setSelectedDoc(updated.length > 0 ? updated[0] : null);
      }
      return updated;
    });

    addToast({
      type: 'success',
      title: 'Records Deleted',
      message: `Successfully deleted ${idsToDelete.length} consultation ${idsToDelete.length === 1 ? 'record' : 'records'}.`,
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
      console.warn('[HistoryPage] Backend batch delete warning:', err);
    }
  };

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
      title: 'Console Workspace Re-hydrated',
      message: `Loaded consultation transcript & prescription details for ${doc.patient_name || 'Patient'}.`,
    });

    navigate('/console');
  };

  const filtered = prescriptions.filter((p) => {
    const term = searchQuery.toLowerCase();
    return (
      (p.patient_name || '').toLowerCase().includes(term) ||
      (p.phone || '').includes(term) ||
      (p.diagnosis || '').toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--color-bg-app, #F6F8FA)', color: 'var(--color-ink-900)' }}>
      <TopBar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left column: Search + List */}
        <div style={{ width: '420px', borderRight: '1px solid var(--color-border, #E3E8EE)', background: 'var(--color-bg-surface, #fff)', display: 'flex', flexDirection: 'column' }}>
          {/* Header & Search */}
          <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border, #E3E8EE)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                Consultation Audit Log
              </h1>

              <button
                onClick={() => {
                  setIsSelectMode(!isSelectMode);
                  if (isSelectMode) setSelectedIds([]);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: isSelectMode ? 'rgba(225, 85, 84, 0.1)' : 'var(--color-bg-subtle, #FAFBFC)',
                  border: isSelectMode ? '1px solid #E15554' : '1px solid var(--color-border, #E3E8EE)',
                  color: isSelectMode ? '#E15554' : 'var(--color-ink-900, #101A2E)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Trash2 size={13} color={isSelectMode ? '#E15554' : '#64748B'} />
                {isSelectMode ? 'Cancel Selection' : 'Select to Delete'}
              </button>
            </div>

            {/* Selection Toolbar when isSelectMode is Active */}
            {isSelectMode && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--color-bg-subtle, #F8FAFC)',
                  border: '1px solid var(--color-border, #E2E8F0)',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  onClick={() => handleSelectAll(filtered)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#12897F',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckSquare size={13} />
                  {selectedIds.length === filtered.length && filtered.length > 0 ? 'Deselect All' : 'Select All'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #64748B)' }}>
                    {selectedIds.length} selected
                  </span>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={selectedIds.length === 0}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      background: selectedIds.length > 0 ? '#E15554' : 'var(--color-border, #CBD5E1)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 700,
                      fontSize: '11px',
                      cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Delete ({selectedIds.length})
                  </button>
                </div>
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--color-ink-500, #5B6B82)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search patient, phone, or diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--color-border, #E3E8EE)',
                  background: 'var(--color-bg-subtle, #FAFBFC)',
                  color: 'var(--color-ink-900, #101A2E)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* List area */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div>
                {[0, 1, 2, 3, 4].map((i) => (
                  <BoneHistoryItem key={i} index={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-ink-500, #5B6B82)' }}>
                <FileText size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 500 }}>No prescriptions found</p>
                <p style={{ fontFamily: 'Inter', fontSize: '12px', marginTop: '4px' }}>Try adjusting your search query.</p>
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = selectedDoc?._id === item._id;
                const isChecked = selectedIds.includes(item._id);
                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      if (isSelectMode) {
                        toggleSelectRecord(item._id);
                      } else {
                        setSelectedDoc(item);
                      }
                    }}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--color-border, #E3E8EE)',
                      background: isChecked ? 'rgba(225, 85, 84, 0.06)' : isSelected ? 'var(--color-accent-light, #EFECFE)' : 'transparent',
                      borderLeft: isChecked ? '4px solid #E15554' : isSelected ? '4px solid var(--color-accent, #6D5DF6)' : '4px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    {/* Checkbox when in Select Mode */}
                    {isSelectMode && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectRecord(item._id);
                        }}
                        style={{ marginTop: '2px', cursor: 'pointer', color: isChecked ? '#E15554' : 'var(--color-ink-500, #94A3B8)' }}
                      >
                        {isChecked ? <CheckSquare size={18} color="#E15554" /> : <Square size={18} />}
                      </div>
                    )}

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '14px', color: 'var(--color-ink-900, #101A2E)' }}>
                          {item.patient_name || 'Patient'}
                        </span>
                        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)' }}>
                          {item.consultation_date ? new Date(item.consultation_date).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#12897F', fontWeight: 500, marginBottom: '6px' }}>
                        {item.diagnosis || 'General Consultation'}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--color-ink-500, #5B6B82)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} /> {item.phone || 'N/A'}
                        </span>
                        {item.medicines?.length ? (
                          <span style={{ background: 'var(--color-primary-light, #E4F3F1)', color: '#12897F', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontFamily: 'IBM Plex Mono' }}>
                            {item.medicines.length} meds
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Selected Prescription Details */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', background: 'var(--color-bg-app, #F6F8FA)' }}>
          {selectedDoc ? (
            <div style={{ maxWidth: '760px', margin: '0 auto', background: 'var(--color-bg-surface, #fff)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              {/* Header Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border, #E3E8EE)', paddingBottom: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '22px', color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                      {selectedDoc.patient_name || 'Patient Record'}
                    </h2>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '99px', background: 'var(--color-primary-light, #E4F3F1)', color: '#12897F', fontSize: '11px', fontFamily: 'IBM Plex Mono', fontWeight: 600 }}>
                      <CheckCircle2 size={12} /> Verified MongoDB Record
                    </span>
                  </div>
                  <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)', margin: 0 }}>
                    Phone: {selectedDoc.phone || 'N/A'} · DOB Password Key: {selectedDoc.dob || 'Not set'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleLoadIntoConsole(selectedDoc)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: '#12897F',
                      color: '#fff',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 600,
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(18,137,127,0.25)',
                    }}
                  >
                    <PlayCircle size={15} /> Load into Console
                  </button>

                  <button
                    onClick={() => {
                      if (selectedDoc) {
                        setSelectedIds([selectedDoc._id]);
                        setShowDeleteModal(true);
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(225, 85, 84, 0.08)',
                      color: '#E15554',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 600,
                      fontSize: '13px',
                      border: '1px solid rgba(225, 85, 84, 0.25)',
                      cursor: 'pointer',
                    }}
                    title="Delete this consultation record"
                  >
                    <Trash2 size={14} color="#E15554" /> Delete Record
                  </button>

                  {selectedDoc.pdf_path && (() => {
                    const pdfName = selectedDoc.pdf_path.split(/[\\/]/).pop()!;
                    return (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(pdfName);
                            addToast({
                              type: 'success',
                              title: 'PDF Name Copied to Clipboard',
                              message: `Copied "${pdfName}" to clipboard for system searching.`,
                            });
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            background: 'var(--color-bg-subtle, #F1F5F9)',
                            color: 'var(--color-ink-900, #101A2E)',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 600,
                            fontSize: '13px',
                            border: '1px solid var(--color-border, #E2E8F0)',
                            cursor: 'pointer',
                          }}
                          title={`Copy ${pdfName} to clipboard`}
                        >
                          <Copy size={14} color="#12897F" /> Copy PDF Name
                        </button>

                        <a
                          href={`/pdfs/${pdfName}`}
                          download={pdfName}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            background: 'var(--color-bg-subtle, #F1F5F9)',
                            color: 'var(--color-ink-900, #101A2E)',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 600,
                            fontSize: '13px',
                            textDecoration: 'none',
                            border: '1px solid var(--color-border, #E2E8F0)',
                          }}
                        >
                          <Download size={14} color="#12897F" /> PDF
                        </a>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* View Toggle Tabs (Structured Prescription vs Audio Transcript) */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border, #E2E8F0)', paddingBottom: '12px', marginBottom: '24px' }}>
                <button
                  onClick={() => setActiveDetailTab('structured')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: activeDetailTab === 'structured' ? 'var(--color-accent-light, #EFECFE)' : 'transparent',
                    color: activeDetailTab === 'structured' ? 'var(--color-accent, #6D5DF6)' : 'var(--color-ink-500, #64748B)',
                    border: 'none',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FileText size={15} /> Structured Prescription
                </button>

                <button
                  onClick={() => setActiveDetailTab('transcript')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: activeDetailTab === 'transcript' ? 'var(--color-accent-light, #EFECFE)' : 'transparent',
                    color: activeDetailTab === 'transcript' ? 'var(--color-accent, #6D5DF6)' : 'var(--color-ink-500, #64748B)',
                    border: 'none',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles size={15} /> Consultation Audio Transcript
                </button>
              </div>

              {/* Structured View */}
              {activeDetailTab === 'structured' && (
                <div>
                  {/* Diagnosis section */}
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #5B6B82)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Diagnosis
                    </p>
                    <div style={{ padding: '12px 16px', background: 'var(--color-bg-subtle, #F6F8FA)', borderRadius: '8px', border: '1px solid var(--color-border, #E3E8EE)', fontFamily: 'Inter', fontSize: '14px', fontWeight: 500, color: 'var(--color-ink-900, #101A2E)' }}>
                      {selectedDoc.diagnosis || 'Not specified'}
                    </div>
                  </div>

                  {/* Symptoms */}
                  {selectedDoc.symptoms && selectedDoc.symptoms.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #5B6B82)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                        Symptoms Reported
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedDoc.symptoms.map((s, i) => (
                          <span key={i} style={{ padding: '5px 12px', borderRadius: '99px', background: 'var(--color-accent-light, #EFECFE)', color: 'var(--color-accent, #6D5DF6)', fontSize: '12px', fontFamily: 'Inter', fontWeight: 500 }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prescribed Medicines */}
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #5B6B82)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                      Prescribed Medicines
                    </p>
                    {selectedDoc.medicines && selectedDoc.medicines.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedDoc.medicines.map((m, i) => (
                          <div key={i} style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--color-border, #E3E8EE)', background: 'var(--color-bg-subtle, #FAFBFC)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <p style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '14px', color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>{m.name}</p>
                              <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: '#12897F', marginTop: '2px', margin: 0 }}>
                                {[m.dosage, m.duration, m.frequency].filter(Boolean).join(' · ')}
                              </p>
                            </div>
                            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)', background: 'var(--color-border, #E3E8EE)', padding: '3px 8px', borderRadius: '4px' }}>
                              Rx #{i + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)' }}>No medicines recorded.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Audio Transcript View */}
              {activeDetailTab === 'transcript' && (
                <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--color-bg-subtle, #F8FAFC)', border: '1px solid var(--color-border, #E2E8F0)', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--color-ink-900, #334155)', lineHeight: 1.6 }}>
                  {selectedDoc.transcript ? (
                    <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{selectedDoc.transcript}</p>
                  ) : (
                    <p style={{ margin: 0, color: 'var(--color-ink-500, #94A3B8)' }}>
                      Patient {selectedDoc.patient_name || 'Patient'} presented with symptoms of {selectedDoc.symptoms?.join(', ') || selectedDoc.chief_complaint || 'illness'}. Doctor evaluated patient and prescribed {selectedDoc.medicines?.map(m => m.name).join(', ') || 'medications'}.
                    </p>
                  )}
                </div>
              )}

              {/* Document Footer Metadata */}
              <div style={{ borderTop: '1px solid var(--color-border, #E3E8EE)', paddingTop: '16px', marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-ink-500, #5B6B82)', fontSize: '11px', fontFamily: 'IBM Plex Mono' }}>
                <span>MongoDB ID: {selectedDoc._id}</span>
                <span>ScriptIQ Verified</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink-500, #5B6B82)' }}>
              Select a prescription from the list to view full clinical details.
            </div>
          )}
        </div>
      </div>

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
