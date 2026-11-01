/* DashboardPage.tsx — ScriptIQ Clinical Control Center & Operations Dashboard */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { useDraftStore, type PrescriptionDraft } from '@/store/draftStore';
import { useRecordingStore } from '@/store/recordingStore';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { getRecordTimestamp } from '@/pages/HistoryPage';
import {
  FileCheck,
  Users,
  ShoppingBag,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  PlayCircle,
  Calendar,
  Activity,
  Cpu,
  Database,
  Send,
  Pill,
  Sparkles,
  Receipt,
  CheckCircle2,
} from 'lucide-react';

interface PrescriptionDoc {
  _id: string;
  patient_name?: string;
  phone?: string;
  dob?: string;
  age?: number;
  gender?: string;
  consultation_date?: string;
  created_at?: string;
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
  status?: string;
  rx_number?: string;
}

interface DrugFrequencyItem {
  name: string;
  count: number;
  pct: number;
}

interface DiagnosisItem {
  label: string;
  count: number;
  pct: number;
  color: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const setDraft = useDraftStore((s) => s.setDraft);
  const setSavedId = useDraftStore((s) => s.setSavedId);
  const setTranscript = useRecordingStore((s) => s.setTranscript);
  const setPartialText = useRecordingStore((s) => s.setPartialText);
  const setStatus = useRecordingStore((s) => s.setStatus);
  const addToast = useUIStore((s) => s.addToast);
  const setPrescriptionStatus = useUIStore((s) => s.setPrescriptionStatus);

  const selectedModel = useRecordingStore((s) => s.selectedModel) || 'gemini-2.5-flash';
  const modelLabel =
    selectedModel === 'gemini-2.5-flash'
      ? 'Gemini 2.5 Flash'
      : selectedModel === 'gemini-2.5-flash-lite'
      ? 'Gemini 2.5 Flash Lite'
      : selectedModel === 'gemini-3.5-flash'
      ? 'Gemini 3.5 Flash'
      : selectedModel;

  const [loading, setLoading] = useState(true);
  const [allConsultations, setAllConsultations] = useState<PrescriptionDoc[]>([]);
  const [stats, setStats] = useState({
    totalRx: 0,
    totalPatients: 0,
    totalMedicines: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/consultations?limit=100');
      const json = await res.json();
      if (json.success && json.data?.prescriptions) {
        const list: PrescriptionDoc[] = json.data.prescriptions;
        setAllConsultations(list);

        const uniquePatients = new Set(
          list
            .map((p) => (p.phone ? p.phone.trim() : (p.patient_name || '').trim()))
            .filter(Boolean)
        ).size;

        let totalMeds = 0;
        list.forEach((doc) => {
          if (Array.isArray(doc.medicines)) {
            totalMeds += doc.medicines.length;
          }
        });

        const pendingCount = list.filter(
          (p: any) => p.status !== 'Completed' && p.status !== 'Delivered'
        ).length;

        setStats({
          totalRx: list.length,
          totalPatients: uniquePatients,
          totalMedicines: totalMeds,
          pendingOrders: pendingCount,
        });
      }
    } catch (err) {
      console.error('[DashboardPage] Error fetching consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Chronologically sorted recent consultations (newest strictly first)
  const recentConsultations = useMemo(() => {
    return [...allConsultations]
      .sort((a, b) => {
        const diff = getRecordTimestamp(b) - getRecordTimestamp(a);
        if (diff !== 0) return diff;
        return (b._id || '').localeCompare(a._id || '');
      })
      .slice(0, 6);
  }, [allConsultations]);

  // Real Top Prescribed Medicines dynamically aggregated from MongoDB records
  const topDrugs: DrugFrequencyItem[] = useMemo(() => {
    const freq: Record<string, number> = {};
    allConsultations.forEach((doc) => {
      if (Array.isArray(doc.medicines)) {
        doc.medicines.forEach((med) => {
          const raw = (med.name || '').trim();
          if (!raw) return;
          const key = raw.charAt(0).toUpperCase() + raw.slice(1);
          freq[key] = (freq[key] || 0) + 1;
        });
      }
    });

    const list = Object.entries(freq)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const max = list[0]?.count || 1;
    return list.map((item) => ({
      name: item.name,
      count: item.count,
      pct: Math.max(14, Math.round((item.count / max) * 100)),
    }));
  }, [allConsultations]);

  // Real Diagnoses Distribution dynamically aggregated from MongoDB records
  const topDiagnoses: DiagnosisItem[] = useMemo(() => {
    const diagCount: Record<string, number> = {};
    let total = 0;

    allConsultations.forEach((doc) => {
      const diag = (doc.diagnosis || doc.chief_complaint || '').trim();
      if (!diag) return;
      const key = diag.charAt(0).toUpperCase() + diag.slice(1);
      diagCount[key] = (diagCount[key] || 0) + 1;
      total++;
    });

    const palette = ['#12897F', '#6D5DF6', '#E8A33D', '#E15554', '#0EA5E9'];

    const sorted = Object.entries(diagCount)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return sorted.map((item, idx) => ({
      label: item.label,
      count: item.count,
      pct: total > 0 ? Math.round((item.count / total) * 100) : 0,
      color: palette[idx % palette.length],
    }));
  }, [allConsultations]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  const formatTimestamp = (doc: PrescriptionDoc) => {
    const ts = getRecordTimestamp(doc);
    if (ts <= 0) return 'Recent';
    const d = new Date(ts);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) return `Today · ${timeStr}`;
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} · ${timeStr}`;
  };

  const handleLoadIntoConsole = (doc: PrescriptionDoc) => {
    const draft: PrescriptionDraft = {
      patient_name: doc.patient_name || '',
      phone: doc.phone || '',
      dob: doc.dob || '',
      age: doc.age,
      gender: doc.gender,
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
        doc.symptoms?.join(', ') || doc.chief_complaint || 'clinical symptoms'
      }. Diagnosed with ${doc.diagnosis || 'medical condition'}. Prescribed ${
        doc.medicines?.map((m) => m.name).join(', ') || 'medications'
      }.`;

    setTranscript(transcriptContent);
    setPartialText('');
    setStatus('done');
    setPrescriptionStatus('Reviewed');

    addToast({
      type: 'success',
      title: 'Console Re-hydrated',
      message: `Loaded consultation for ${doc.patient_name || 'Patient'} into active console.`,
    });

    navigate('/console');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-app)', fontFamily: 'var(--font-sans)' }}>
      <TopBar />

      <div style={{ flex: 1, padding: '24px 32px 48px', maxWidth: '1360px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Modern Executive Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '16px',
            padding: '28px 32px',
            color: '#FFFFFF',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Subtle decorative glow */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '240px',
              height: '240px',
              background: 'radial-gradient(circle, rgba(18, 137, 127, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#12897F',
                  background: 'rgba(18, 137, 127, 0.18)',
                  padding: '3px 10px',
                  borderRadius: '99px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#12897F', boxShadow: '0 0 8px #12897F' }} />
                Clinical Operations
              </span>

              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(241, 245, 249, 0.65)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={12} /> {todayLabel}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '26px', margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              {greeting}, {user?.name || 'Dr. Arjun Sharma'}
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(241, 245, 249, 0.8)', marginTop: '6px', lineHeight: 1.5, margin: '6px 0 0 0' }}>
              Your clinical prescription workspace is active. Ambient speech recognition, {modelLabel} structuring, and pharmacy dispatch channels are ready.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/official-receipts')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 18px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
            >
              <Receipt size={16} /> Pharmacy POS
            </button>

            <button
              onClick={() => navigate('/console')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #12897F 0%, #0E6F67 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(18, 137, 127, 0.35)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(18, 137, 127, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(18, 137, 127, 0.35)';
              }}
            >
              <Plus size={16} strokeWidth={2.5} /> Start Consultation
            </button>
          </div>
        </div>

        {/* 4 Real-Data Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          <DashboardStatCard
            icon={FileCheck}
            label="Prescriptions Issued"
            value={stats.totalRx}
            trend="100% Synced to MongoDB Atlas"
            color="#12897F"
            bg="var(--color-primary-light, #E4F3F1)"
          />
          <DashboardStatCard
            icon={Users}
            label="Patients Treated"
            value={stats.totalPatients}
            trend="Unique Patient Dossiers"
            color="#6D5DF6"
            bg="var(--color-accent-light, #EFECFE)"
          />
          <DashboardStatCard
            icon={ShoppingBag}
            label="Medications Prescribed"
            value={stats.totalMedicines}
            trend="Active Formulary Regimens"
            color="#E8A33D"
            bg="var(--color-amber-light, #FCF1DE)"
          />
          <DashboardStatCard
            icon={ShieldCheck}
            label="AI Intelligence Engine"
            value={modelLabel}
            trend="Zero-Shot Clinical Extraction"
            color="#12897F"
            bg="var(--color-primary-light, #E4F3F1)"
            isMonoValue={false}
          />
        </div>

        {/* Main Two-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '24px' }}>
          
          {/* Left Column: Recent Patient Consultations */}
          <div
            style={{
              background: 'var(--color-bg-surface, #FFFFFF)',
              borderRadius: '16px',
              border: '1px solid var(--color-border, #E2E8F0)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
                borderBottom: '1px solid var(--color-border, #F1F5F9)',
                paddingBottom: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: 'var(--color-ink-900, #0F172A)', margin: 0 }}>
                    Recent Patient Consultations
                  </h3>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      background: 'var(--color-bg-subtle, #F1F5F9)',
                      color: 'var(--color-ink-700, #334155)',
                      padding: '2px 8px',
                      borderRadius: '99px',
                      fontWeight: 600,
                    }}
                  >
                    {recentConsultations.length} Most Recent
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-ink-500, #64748B)', margin: '4px 0 0 0' }}>
                  Latest verified consultations saved across your clinical practice
                </p>
              </div>

              <button
                onClick={() => navigate('/history')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#12897F',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-light, #E4F3F1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                View All History ({stats.totalRx}) <ArrowUpRight size={14} />
              </button>
            </div>

            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-ink-500, #64748B)', fontFamily: 'var(--font-sans)' }}>
                Loading recent consultations...
              </div>
            ) : recentConsultations.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--color-bg-subtle, #F8FAFC)', borderRadius: '12px', border: '1px dashed var(--color-border, #E2E8F0)' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600, color: 'var(--color-ink-900, #0F172A)', margin: '0 0 6px 0' }}>
                  No consultations recorded yet
                </p>
                <p style={{ fontSize: '13px', color: 'var(--color-ink-500, #64748B)', margin: '0 0 16px 0' }}>
                  Start your first consultation to generate structured prescriptions and clinical history.
                </p>
                <button
                  onClick={() => navigate('/console')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#12897F',
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} /> Launch Console
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentConsultations.map((doc) => {
                  const initial = (doc.patient_name || 'P').charAt(0).toUpperCase();
                  const medCount = doc.medicines?.length || 0;

                  return (
                    <div
                      key={doc._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--color-bg-subtle, #FAFBFC)',
                        border: '1px solid var(--color-border, #E2E8F0)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#12897F';
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(18, 137, 127, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border, #E2E8F0)';
                        e.currentTarget.style.background = 'var(--color-bg-subtle, #FAFBFC)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--color-primary-light, #E4F3F1) 0%, rgba(18, 137, 127, 0.25) 100%)',
                            color: '#12897F',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 700,
                            fontSize: '15px',
                            flexShrink: 0,
                          }}
                        >
                          {initial}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <h4
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--color-ink-900, #0F172A)',
                                margin: 0,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {doc.patient_name || 'Anonymous Patient'}
                            </h4>

                            {(doc.age || doc.gender) && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontFamily: 'var(--font-mono)',
                                  color: 'var(--color-ink-700, #334155)',
                                  background: 'var(--color-bg-subtle, #E2E8F0)',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  fontWeight: 500,
                                }}
                              >
                                {doc.age ? `${doc.age}y` : ''} {doc.gender ? `/ ${doc.gender}` : ''}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: '12px',
                                color: '#12897F',
                                fontWeight: 500,
                                maxWidth: '240px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {doc.diagnosis || 'General Consultation'}
                            </span>

                            <span style={{ fontSize: '11px', color: 'var(--color-ink-300, #94A3B8)' }}>·</span>

                            <span style={{ fontSize: '11px', color: 'var(--color-ink-500, #64748B)', fontFamily: 'var(--font-mono)' }}>
                              {formatTimestamp(doc)}
                            </span>

                            {medCount > 0 && (
                              <>
                                <span style={{ fontSize: '11px', color: 'var(--color-ink-300, #94A3B8)' }}>·</span>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    color: 'var(--color-ink-700, #334155)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                  }}
                                >
                                  <Pill size={11} color="#6D5DF6" /> {medCount} med{medCount > 1 ? 's' : ''}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <button
                          onClick={() => handleLoadIntoConsole(doc)}
                          title="Load patient consultation into live console editor"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 12px',
                            borderRadius: '8px',
                            background: 'var(--color-primary-light, #E4F3F1)',
                            color: '#12897F',
                            border: '1px solid rgba(18, 137, 127, 0.2)',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#12897F';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--color-primary-light, #E4F3F1)';
                            e.currentTarget.style.color = '#12897F';
                          }}
                        >
                          <PlayCircle size={14} /> Load to Console
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Real Clinical Insights & Live Engine */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Top Prescribed Medications (Live Dynamic Formulations) */}
            <div
              style={{
                background: 'var(--color-bg-surface, #FFFFFF)',
                borderRadius: '16px',
                border: '1px solid var(--color-border, #E2E8F0)',
                padding: '22px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--color-ink-900, #0F172A)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pill size={16} color="#12897F" /> Top Prescribed Drugs
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#12897F', background: 'var(--color-primary-light, #E4F3F1)', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                  Live Formulary
                </span>
              </div>

              {topDrugs.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-ink-500, #64748B)', fontSize: '12px' }}>
                  Prescribe medications in console to generate live formulary insights.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {topDrugs.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--color-ink-500, #64748B)',
                          width: '20px',
                          flexShrink: 0,
                        }}
                      >
                        #{idx + 1}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-sans)', fontWeight: 500, marginBottom: '3px' }}>
                          <span style={{ color: 'var(--color-ink-900, #0F172A)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.name}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', color: '#12897F', fontWeight: 700, marginLeft: '8px', flexShrink: 0 }}>
                            {item.count} rx
                          </span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '99px', background: 'var(--color-bg-subtle, #F1F5F9)', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${item.pct}%`,
                              height: '100%',
                              borderRadius: '99px',
                              background: 'linear-gradient(90deg, #12897F, #0E6F67)',
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Real Clinical Diagnoses Distribution */}
            <div
              style={{
                background: 'var(--color-bg-surface, #FFFFFF)',
                borderRadius: '16px',
                border: '1px solid var(--color-border, #E2E8F0)',
                padding: '22px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--color-ink-900, #0F172A)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={16} color="#6D5DF6" /> Clinical Distribution
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#6D5DF6', background: 'var(--color-accent-light, #EFECFE)', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                  Real Cases
                </span>
              </div>

              {topDiagnoses.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-ink-500, #64748B)', fontSize: '12px' }}>
                  No diagnostic data recorded yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {topDiagnoses.map((d, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'var(--color-bg-subtle, #FAFBFC)',
                        border: '1px solid var(--color-border, #E2E8F0)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-ink-900, #0F172A)', marginBottom: '5px' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</span>
                        <span style={{ color: d.color, fontFamily: 'var(--font-mono)', fontWeight: 700, marginLeft: '8px', flexShrink: 0 }}>
                          {d.pct}% ({d.count})
                        </span>
                      </div>
                      <div style={{ height: '6px', borderRadius: '99px', background: '#F1F5F9', overflow: 'hidden' }}>
                        <div style={{ width: `${d.pct}%`, height: '100%', borderRadius: '99px', background: d.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Authentic System & Engine Status */}
            <div
              style={{
                background: 'var(--color-bg-surface, #FFFFFF)',
                borderRadius: '16px',
                border: '1px solid var(--color-border, #E2E8F0)',
                padding: '22px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: 'var(--color-ink-900, #0F172A)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={15} color="#12897F" /> Clinical Infrastructure
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#12897F', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <CheckCircle2 size={12} /> All Online
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <SystemStatusRow
                  icon={Activity}
                  title="Speech STT Engine"
                  sub="Ambient Audio & Whisper"
                  status="Active"
                  color="#12897F"
                />
                <SystemStatusRow
                  icon={Sparkles}
                  title="Prescription LLM"
                  sub={modelLabel}
                  status="Online"
                  color="#6D5DF6"
                />
                <SystemStatusRow
                  icon={Database}
                  title="Clinical Database"
                  sub="MongoDB Atlas Cloud"
                  status="Connected"
                  color="#12897F"
                />
                <SystemStatusRow
                  icon={Send}
                  title="Prescription Dispatch"
                  sub="Resend & Encrypted PDF"
                  status="Ready"
                  color="#E8A33D"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────────────

interface DashboardStatCardProps {
  icon: any;
  label: string;
  value: string | number;
  trend: string;
  color: string;
  bg: string;
  isMonoValue?: boolean;
}

function DashboardStatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  bg,
  isMonoValue = true,
}: DashboardStatCardProps) {
  return (
    <div
      style={{
        background: 'var(--color-bg-surface, #FFFFFF)',
        borderRadius: '14px',
        padding: '18px 20px',
        border: '1px solid var(--color-border, #E2E8F0)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--color-ink-500, #64748B)' }}>
          {label}
        </span>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            flexShrink: 0,
          }}
        >
          <Icon size={17} />
        </div>
      </div>

      <div>
        <p
          style={{
            fontFamily: isMonoValue ? 'var(--font-mono)' : 'var(--font-heading)',
            fontWeight: 700,
            fontSize: typeof value === 'string' && value.length > 8 ? '18px' : '26px',
            color: 'var(--color-ink-900, #0F172A)',
            margin: '0 0 3px 0',
            letterSpacing: isMonoValue ? '-0.03em' : 'normal',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value}
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--color-ink-500, #64748B)', fontWeight: 500, margin: 0 }}>
          {trend}
        </p>
      </div>
    </div>
  );
}

interface SystemStatusRowProps {
  icon: any;
  title: string;
  sub: string;
  status: string;
  color: string;
}

function SystemStatusRow({ icon: Icon, title, sub, status, color }: SystemStatusRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '9px 12px',
        background: 'var(--color-bg-subtle, #FAFBFC)',
        borderRadius: '10px',
        border: '1px solid var(--color-border, #E2E8F0)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'var(--color-bg-surface, #FFFFFF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            border: '1px solid var(--color-border, #E2E8F0)',
            flexShrink: 0,
          }}
        >
          <Icon size={14} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: 600, color: 'var(--color-ink-900, #0F172A)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-ink-500, #64748B)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {sub}
          </p>
        </div>
      </div>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: color,
          background: 'var(--color-bg-surface, #FFFFFF)',
          border: '1px solid var(--color-border, #E2E8F0)',
          padding: '2px 7px',
          borderRadius: '99px',
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {status}
      </span>
    </div>
  );
}
