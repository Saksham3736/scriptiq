import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Pill, FileText, Download, LogOut, Smartphone, CheckCircle, ShieldCheck, Sun, Moon, Sunset, Bell
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import TopBar from '@/components/layout/TopBar';

const VAPID_PUBLIC_KEY = "BD3tmSicsE_2-a3_lG1yHpePnf2QLDnPx65cGgCzronPmSA86KX-H0OFfixR7ADYaFxIv1257RklLVrloPTgQyc";

function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PatientDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'prescriptions' | 'medications' | 'notifications'>('overview');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Push state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushMessage, setPushMessage] = useState('');

  const patientPhone = user?.phone || '9888478606';

  useEffect(() => {
    fetchPrescriptions();
    checkPushSubscription();
  }, [patientPhone]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/patient/prescriptions?phone=${patientPhone}`);
      const data = await res.json();
      if (data.success && data.data?.prescriptions) {
        setPrescriptions(data.data.prescriptions);
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkPushSubscription = () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then((swReg) => {
        swReg.pushManager.getSubscription().then((sub) => {
          if (sub) setIsSubscribed(true);
        });
      });
    }
  };

  const handleSubscribe = async () => {
    setPushLoading(true);
    setPushMessage('');
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications not supported by browser.');
      }
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied.');
      }
      const swReg = await navigator.serviceWorker.register('/sw.js');

      // Unsubscribe any existing stale push subscription to force a fresh VAPID token
      const existingSub = await swReg.pushManager.getSubscription();
      if (existingSub) {
        await existingSub.unsubscribe();
      }

      const sub = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: patientPhone, subscription: sub.toJSON() }),
      });
      if (!res.ok) throw new Error('Failed to register subscription.');

      setIsSubscribed(true);
      setPushMessage('Subscribed! Instant welcome push sent to your device.');
    } catch (err: any) {
      setPushMessage(err.message || 'Subscription failed.');
    } finally {
      setPushLoading(false);
    }
  };

  const handleSendTestPush = async () => {
    setPushLoading(true);
    setPushMessage('');
    try {
      const res = await fetch('/api/prescription/send-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: patientPhone, patient_name: user?.name || 'Patient' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Push failed.');
      setPushMessage('Test push dispatched! Check your desktop popup.');
    } catch (err: any) {
      setPushMessage(err.message || 'Error sending push.');
    } finally {
      setPushLoading(false);
    }
  };

  const latestPrescription = prescriptions.length > 0 ? prescriptions[0] : null;
  const activeMedicines = latestPrescription?.medicines || [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg, #F8FAFC)', color: 'var(--color-ink-900, #101A2E)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <TopBar />

      {/* Main Container */}
      <div style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '24px', boxSizing: 'border-box' }}>
        
        {/* Patient Sub-Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '16px 20px', background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--color-border, #E3E8EE)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E4F3F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="#12897F" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
                Patient Health Portal
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--color-ink-500, #5B6B82)', margin: 0, fontFamily: 'IBM Plex Mono, monospace' }}>
                Patient ID / Phone: {patientPhone}
              </p>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            style={{ padding: '8px 14px', borderRadius: '8px', background: '#F1F5F9', color: '#5B6B82', border: '1px solid #E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--color-bg-surface, #FFFFFF)', padding: '6px', borderRadius: '12px', border: '1px solid var(--color-border, #E3E8EE)', marginBottom: '24px' }}>
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
            { id: 'medications', label: 'Daily Medications', icon: Pill },
            { id: 'notifications', label: 'Push Notifications', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? '#12897F' : 'transparent',
                  color: isActive ? '#FFF' : 'var(--color-ink-500, #5B6B82)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #12897F, #0E6A62)', borderRadius: '16px', padding: '28px', color: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#E4F3F1' }}>
                  ScriptIQ Health Dossier
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '6px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Welcome back!
                </h2>
                <p style={{ fontSize: '14px', color: '#E4F3F1', margin: 0 }}>
                  You have {prescriptions.length} consultation prescription(s) on file with your doctor.
                </p>
              </div>
              <ShieldCheck size={56} color="#E4F3F1" opacity={0.6} />
            </div>

            {/* Latest Prescription Card */}
            {latestPrescription ? (
              <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="#12897F" /> Latest Prescription Diagnosis
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--color-ink-500, #5B6B82)', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {latestPrescription.created_at || 'Recent'}
                  </span>
                </div>
                
                <div style={{ background: 'var(--color-bg, #F8FAFC)', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--color-border, #E3E8EE)' }}>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#12897F' }}>
                    {latestPrescription.diagnosis || 'General Consultation'}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)' }}>
                    Doctor: {latestPrescription.doctor_name || 'Dr. Arjun Sharma'} ({latestPrescription.clinic_name || 'MediCare Hospital'})
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  {latestPrescription.pdf_url && (
                    <a
                      href={latestPrescription.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: '10px 16px', borderRadius: '8px', background: '#12897F', color: '#FFF', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Download size={15} /> Download PDF Prescription
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '40px', textAlign: 'center', color: 'var(--color-ink-500, #5B6B82)' }}>
                <p>No prescription history found for phone number {patientPhone}.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Prescriptions Timeline */}
        {activeTab === 'prescriptions' && (
          <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
              Prescription Consultation History
            </h3>

            {loading ? (
              <p style={{ color: 'var(--color-ink-500, #5B6B82)' }}>Loading prescriptions...</p>
            ) : prescriptions.length === 0 ? (
              <p style={{ color: 'var(--color-ink-500, #5B6B82)' }}>No prescription records found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {prescriptions.map((p, idx) => (
                  <div key={idx} style={{ background: 'var(--color-bg, #F8FAFC)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border, #E3E8EE)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#12897F', margin: 0 }}>
                          {p.diagnosis || 'Medical Consultation'}
                        </h4>
                        <p style={{ fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)', margin: '4px 0 0 0' }}>
                          Patient: {p.patient_name || 'Patient'} | Phone: {p.phone || patientPhone}
                        </p>
                      </div>
                      {p.pdf_url && (
                        <a
                          href={p.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ padding: '8px 14px', borderRadius: '6px', background: '#12897F', color: '#FFF', textDecoration: 'none', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Download size={14} /> PDF
                        </a>
                      )}
                    </div>

                    {/* Prescribed medicines list */}
                    {(p.medicines || []).length > 0 && (
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border, #E3E8EE)' }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ink-900, #101A2E)', marginBottom: '8px' }}>
                          Prescribed Medicines:
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {p.medicines.map((m: any, mIdx: number) => (
                            <span key={mIdx} style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--color-bg-surface, #FFFFFF)', border: '1px solid var(--color-border, #E3E8EE)', fontSize: '12px', color: 'var(--color-ink-900, #101A2E)', fontFamily: 'IBM Plex Mono, monospace' }}>
                              💊 {m.name} ({m.dosage || 'As directed'})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Daily Medications */}
        {activeTab === 'medications' && (
          <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
              Daily Medication Dosage Schedule
            </h3>

            {activeMedicines.length === 0 ? (
              <p style={{ color: 'var(--color-ink-500, #5B6B82)' }}>No active medication schedule available.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                
                {/* Morning */}
                <div style={{ background: 'var(--color-bg, #F8FAFC)', borderRadius: '12px', border: '1px solid var(--color-border, #E3E8EE)', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#D97706' }}>
                    <Sun size={20} />
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Morning (Breakfast)</h4>
                  </div>
                  {activeMedicines.map((m: any, i: number) => (
                    <div key={i} style={{ padding: '10px', background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '8px', border: '1px solid var(--color-border, #E3E8EE)', marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600, color: '#12897F' }}>{m.name}</span>
                      <div style={{ fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)' }}>Dosage: {m.dosage || '1 Tablet'}</div>
                    </div>
                  ))}
                </div>

                {/* Afternoon */}
                <div style={{ background: 'var(--color-bg, #F8FAFC)', borderRadius: '12px', border: '1px solid var(--color-border, #E3E8EE)', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#12897F' }}>
                    <Sunset size={20} />
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Afternoon (Lunch)</h4>
                  </div>
                  {activeMedicines.map((m: any, i: number) => (
                    <div key={i} style={{ padding: '10px', background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '8px', border: '1px solid var(--color-border, #E3E8EE)', marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600, color: '#12897F' }}>{m.name}</span>
                      <div style={{ fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)' }}>Dosage: {m.dosage || '1 Tablet'}</div>
                    </div>
                  ))}
                </div>

                {/* Night */}
                <div style={{ background: 'var(--color-bg, #F8FAFC)', borderRadius: '12px', border: '1px solid var(--color-border, #E3E8EE)', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#6D5DF6' }}>
                    <Moon size={20} />
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Night (Bedtime)</h4>
                  </div>
                  {activeMedicines.map((m: any, i: number) => (
                    <div key={i} style={{ padding: '10px', background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '8px', border: '1px solid var(--color-border, #E3E8EE)', marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600, color: '#12897F' }}>{m.name}</span>
                      <div style={{ fontSize: '11px', color: 'var(--color-ink-500, #5B6B82)' }}>Dosage: {m.dosage || '1 Tablet'}</div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        )}

        {/* Tab 4: Push Notifications & Devices */}
        {activeTab === 'notifications' && (
          <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '32px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: isSubscribed ? '#E4F3F1' : '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Bell size={32} color={isSubscribed ? '#12897F' : '#94A3B8'} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
              Push Notification Status
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-ink-500, #5B6B82)', marginBottom: '24px' }}>
              Device Subscribed for: <strong style={{ color: 'var(--color-ink-900, #101A2E)' }}>{patientPhone}</strong>
            </p>

            <button
              onClick={handleSubscribe}
              disabled={pushLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: isSubscribed ? '#10B981' : '#12897F',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: pushLoading ? 'not-allowed' : 'pointer',
                marginBottom: '12px'
              }}
            >
              {pushLoading ? 'Processing...' : isSubscribed ? 'Re-Subscribe Push Notifications' : 'Enable Push Notifications'}
            </button>

            {isSubscribed && (
              <button
                onClick={handleSendTestPush}
                disabled={pushLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--color-bg, #F8FAFC)',
                  color: '#12897F',
                  border: '1.5px solid #12897F44',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: pushLoading ? 'not-allowed' : 'pointer'
                }}
              >
                🔔 Send Test Push Notification
              </button>
            )}

            {pushMessage && (
              <p style={{ marginTop: '16px', fontSize: '13px', color: isSubscribed ? '#10B981' : '#EF4444' }}>
                {pushMessage}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
