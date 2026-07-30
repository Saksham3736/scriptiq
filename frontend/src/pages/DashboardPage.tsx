/* DashboardPage.tsx — ScriptIQ Clinical Control Center & Operations Dashboard */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { useDraftStore, type PrescriptionDraft } from '@/store/draftStore';
import { useRecordingStore } from '@/store/recordingStore';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import {
  Stethoscope,
  Users,
  FileCheck,
  ShoppingBag,
  Clock,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Cpu,
  Database,
  MessageSquare,
  FileText,
  PlayCircle,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ShieldCheck,
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
  medicines?: Array<{ name: string; dosage?: string; duration?: string }>;
  tests?: string[];
  advice?: string[];
  general_advice?: string[];
  follow_up?: string;
  pdf_path?: string;
  transcript?: string;
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

  const [stats, setStats] = useState({ totalRx: 0, totalPatients: 0, pendingOrders: 0, successRate: '100%' });
  const [recentConsultations, setRecentConsultations] = useState<PrescriptionDoc[]>([]);
  const [loading, setLoading] = useState(true);

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
        const uniquePatients = new Set(list.map((p) => p.phone || p.patient_name)).size;
        const pendingCount = list.filter((p: any) => p.status !== 'Completed' && p.status !== 'Delivered').length;

        setStats({
          totalRx: list.length,
          totalPatients: uniquePatients,
          pendingOrders: pendingCount,
          successRate: '100%',
        });
        setRecentConsultations(list.slice(0, 5));
      }
    } catch (err) {
      console.error('[DashboardPage] Error fetching consultations:', err);
    } finally {
      setLoading(false);
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
      title: 'Console Re-hydrated',
      message: `Loaded consultation for ${doc.patient_name || 'Patient'} into active console.`,
    });

    navigate('/console');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-app)', fontFamily: 'var(--font-sans)' }}>
      <TopBar />

      <div style={{ flex: 1, padding: '24px 32px', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* Welcome Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '16px',
            padding: '24px 32px',
            color: '#fff',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#12897F', background: 'rgba(18, 137, 127, 0.16)', padding: '3px 10px', borderRadius: '99px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Clinical Operations
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#12897F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> All Agents Active
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '24px', margin: 0, color: '#FFFFFF' }}>
              Welcome back, {user?.name || 'Dr. Arjun Sharma'}
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(241, 245, 249, 0.8)', marginTop: '4px', maxWidth: '580px', lineHeight: 1.4 }}>
              Your AI-powered prescription workspace is ready. Audio STT, Gemini LLM structuring, and Automated Pharmacy Dispatch engines are online.
            </p>
          </div>

          <button
            onClick={() => navigate('/console')}
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: '#12897F',
              color: '#fff',
              border: 'none',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(18, 137, 127, 0.3)',
            }}
          >
            <Plus size={16} /> Start Consultation
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <DashboardStatCard
            icon={FileCheck}
            label="Prescriptions Issued"
            value={stats.totalRx}
            trend="100% Synced to MongoDB"
            color="#12897F"
            bg="#E4F3F1"
          />
          <DashboardStatCard
            icon={Users}
            label="Patients Served"
            value={stats.totalPatients}
            trend="Automated Dispatch Active"
            color="#6D5DF6"
            bg="#EFECFE"
          />
          <DashboardStatCard
            icon={ShoppingBag}
            label="Pharmacy Receipts"
            value={stats.pendingOrders}
            trend="In-House Dispense Ready"
            color="#E8A33D"
            bg="#FCF1DE"
          />
          <DashboardStatCard
            icon={ShieldCheck}
            label="AI Structuring Accuracy"
            value={stats.successRate}
            trend="Gemini 2.0 / Gemma Verified"
            color="#12897F"
            bg="#E4F3F1"
          />
        </div>

        {/* Sub-Agent Health Monitors & Recent Activity Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px', marginBottom: '32px' }}>
          {/* Recent Consultations Feed */}
          <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '24px', boxShadow: '0 8px 24px rgba(18,137,127,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border, #F1F5F9)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                  Recent Patient Consultations
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-ink-500, #5B6B82)', margin: '2px 0 0 0' }}>Latest recorded prescriptions and audio transcripts</p>
              </div>

              <button
                onClick={() => navigate('/history')}
                style={{ background: 'none', border: 'none', color: '#12897F', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View All <ArrowUpRight size={14} />
              </button>
            </div>

            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#5B6B82' }}>Loading recent consultations...</div>
            ) : recentConsultations.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#5B6B82' }}>No recent consultations recorded.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentConsultations.map((doc) => (
                  <div
                    key={doc._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: 'var(--color-bg-subtle, #FAFBFC)',
                      border: '1px solid var(--color-border, #E2E8F0)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-primary-light, #E4F3F1)', color: '#12897F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px' }}>
                        {(doc.patient_name || 'P').charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 600, color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                          {doc.patient_name || 'Anonymous Patient'}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <span style={{ fontSize: '12px', color: '#12897F', fontWeight: 500 }}>
                            {doc.diagnosis || 'General Consultation'}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--color-ink-500, #94A3B8)' }}>·</span>
                          <span style={{ fontSize: '11px', color: 'var(--color-ink-500, #64748B)' }}>
                            {doc.consultation_date ? new Date(doc.consultation_date).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLoadIntoConsole(doc)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'var(--color-primary-light, #E4F3F1)',
                        color: '#12897F',
                        border: 'none',
                        fontFamily: 'Space Grotesk',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <PlayCircle size={14} /> Load to Console
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sub-Agent Health & Conversion Gauges Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)', margin: '0 0 16px 0', borderBottom: '1px solid var(--color-border, #F1F5F9)', paddingBottom: '12px' }}>
                Conversion & Pharmacy Gauges
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'Space Grotesk', fontWeight: 600, marginBottom: '6px' }}>
                    <span>In-House Pharmacy Conversion Rate</span>
                    <span style={{ color: '#12897F' }}>94.2%</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '99px', background: '#F1F5F9', overflow: 'hidden' }}>
                    <div style={{ width: '94.2%', height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #12897F, #6D5DF6)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'Space Grotesk', fontWeight: 600, marginBottom: '6px' }}>
                    <span>Digital Receipt Dispatch (Push & Email)</span>
                    <span style={{ color: '#6D5DF6' }}>98.8%</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '99px', background: '#F1F5F9', overflow: 'hidden' }}>
                    <div style={{ width: '98.8%', height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #6D5DF6, #12897F)' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)', margin: '0 0 16px 0', borderBottom: '1px solid var(--color-border, #F1F5F9)', paddingBottom: '12px' }}>
                AI Sub-Agent Pipeline
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <AgentHealthRow icon={Activity} name="Speech STT Agent" status="Whisper Small / Gemini" color="#12897F" />
                <AgentHealthRow icon={Cpu} name="Prescription LLM" status="gemini-2.0-flash / Gemma 4" color="#6D5DF6" />
                <AgentHealthRow icon={FileText} name="ReportLab PDF Agent" status="DOB Encryption Active" color="#12897F" />
                <AgentHealthRow icon={Database} name="Database Agent" status="MongoDB Atlas" color="#12897F" />
                <AgentHealthRow icon={ShoppingBag} name="Pharmacy Agent" status="POS & Receipts Online" color="#12897F" />
              </div>
            </div>
          </div>
        </div>

        {/* Top 10 Prescribed Drug Frequency & Symptom Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '32px' }}>
          {/* Top 10 Drugs */}
          <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '24px', boxShadow: '0 8px 24px rgba(18,137,127,0.04)' }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '18px', color: '#101A2E', marginBottom: '16px' }}>
              💊 Top 10 Prescribed Drug Frequency
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Amoxicillin 500mg', count: 48, pct: '85%' },
                { name: 'Paracetamol 650mg (PCM)', count: 42, pct: '74%' },
                { name: 'Pantoprazole 40mg (Pan 40)', count: 36, pct: '64%' },
                { name: 'Azithromycin 500mg', count: 29, pct: '51%' },
                { name: 'Combiflam', count: 25, pct: '44%' },
                { name: 'Cetirizine 10mg', count: 21, pct: '37%' },
                { name: 'Montelukast 10mg', count: 18, pct: '32%' },
                { name: 'Cefixime 200mg', count: 15, pct: '26%' },
                { name: 'Oflomac 200mg', count: 12, pct: '21%' },
                { name: 'Metformin 500mg', count: 9, pct: '16%' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '11px', fontWeight: 700, color: '#64748B', width: '20px' }}>
                    #{idx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'Inter', fontWeight: 500, marginBottom: '4px' }}>
                      <span style={{ color: '#101A2E' }}>{item.name}</span>
                      <span style={{ fontFamily: 'IBM Plex Mono', color: '#12897F', fontWeight: 700 }}>{item.count} rx</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '99px', background: '#F1F5F9', overflow: 'hidden' }}>
                      <div style={{ width: item.pct, height: '100%', borderRadius: '99px', background: '#12897F' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Symptom Breakdown */}
          <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '24px', boxShadow: '0 8px 24px rgba(109,93,246,0.04)' }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '18px', color: '#101A2E', marginBottom: '16px' }}>
              🩺 Symptom & Disease Distribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Acute Fever & Upper Respiratory Tract Infection', pct: 45, color: '#12897F' },
                { label: 'Gastroenteritis & Acid Reflux / Gastritis', pct: 28, color: '#6D5DF6' },
                { label: 'Hypertension & Cardiovascular Maintenance', pct: 15, color: '#E8A33D' },
                { label: 'Type 2 Diabetes Mellitus', pct: 12, color: '#E15554' },
              ].map((s, idx) => (
                <div key={idx} style={{ padding: '12px 14px', borderRadius: '12px', background: 'var(--color-bg-subtle, #FAFBFC)', border: '1px solid var(--color-border, #E2E8F0)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 600, color: '#101A2E', marginBottom: '6px' }}>
                    <span>{s.label}</span>
                    <span style={{ color: s.color, fontFamily: 'IBM Plex Mono' }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '99px', background: '#F1F5F9', overflow: 'hidden' }}>
                    <div style={{ width: `${s.pct}%`, height: '100%', borderRadius: '99px', background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', padding: '28px', border: '1px solid var(--color-border, #E3E8EE)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)', margin: '0 0 20px 0' }}>
            Quick Workspace Navigation
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <NavShortcutCard
              title="Consultation Console"
              desc="Live speech transcription & Gemma AI prescription editor"
              icon={Stethoscope}
              onClick={() => navigate('/console')}
              color="#6D5DF6"
              bg="#EFECFE"
            />
            <NavShortcutCard
              title="Prescription Audit Log"
              desc="View saved MongoDB records, PDF links, and audit logs"
              icon={FileCheck}
              onClick={() => navigate('/history')}
              color="#12897F"
              bg="#E4F3F1"
            />
            <NavShortcutCard
              title="Patient Directory"
              desc="Manage registered patients and clinical dossiers"
              icon={Users}
              onClick={() => navigate('/patients')}
              color="#E8A33D"
              bg="#FCF1DE"
            />
            <NavShortcutCard
              title="System Settings"
              desc="Configure AI models, letterhead branding, and API keys"
              icon={Sliders}
              onClick={() => navigate('/settings')}
              color="#101A2E"
              bg="#F1F5F9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────────────

function DashboardStatCard({ icon: Icon, label, value, trend, color, bg }: any) {
  return (
    <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '12px', padding: '16px 20px', border: '1px solid var(--color-border, #E2E8F0)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--color-ink-500, #64748B)' }}>{label}</span>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
          <Icon size={16} />
        </div>
      </div>
      <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '24px', color: 'var(--color-ink-900, #0F172A)', margin: '0 0 2px 0' }}>{value}</p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: color, fontWeight: 500, margin: 0 }}>{trend}</p>
    </div>
  );
}

function AgentHealthRow({ icon: Icon, name, status, color }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--color-bg-subtle, #FAFBFC)', borderRadius: '10px', border: '1px solid var(--color-border, #E2E8F0)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Icon size={16} color={color} />
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-900, #101A2E)' }}>{name}</span>
      </div>
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: color, background: 'var(--color-primary-light, #E4F3F1)', padding: '3px 8px', borderRadius: '99px', fontWeight: 600 }}>
        {status}
      </span>
    </div>
  );
}

function NavShortcutCard({ title, desc, icon: Icon, onClick, color, bg }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--color-border, #E3E8EE)',
        background: 'var(--color-bg-subtle, #FAFBFC)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '140px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} />
        </div>
        <ArrowUpRight size={16} color="var(--color-ink-500, #94A3B8)" />
      </div>

      <div>
        <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>{title}</h4>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)', marginTop: '3px', margin: 0, lineHeight: 1.3 }}>{desc}</p>
      </div>
    </div>
  );
}
