/* SendPrescriptionModal.tsx — Multi-channel prescription dispatch modal */

import { useState } from 'react';
import { X, Send, MessageSquare, Smartphone, ShoppingBag, ShieldCheck, CheckCircle2, ExternalLink, FileText } from 'lucide-react';
import { useSendPrescription } from '@/hooks/useSendPrescription';
import type { PrescriptionDraft } from '@/store/draftStore';
import { useUIStore } from '@/store/uiStore';
import { BoneSpinner } from '../ui/Boneyard';

interface SendPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: PrescriptionDraft;
  onSuccess?: (pdfUrl?: string, orderId?: string) => void;
}

export default function SendPrescriptionModal({
  isOpen,
  onClose,
  draft,
  onSuccess,
}: SendPrescriptionModalProps) {
  const [phone, setPhone] = useState(draft.phone || '');
  const [email, setEmail] = useState(draft.email || 'saksham.kj.3736@gmail.com');
  const [channels, setChannels] = useState<{ push: boolean; email: boolean }>({
    push: true,
    email: true,
  });
  const [wantInHousePharmacy, setWantInHousePharmacy] = useState(true);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [createdPdfUrl, setCreatedPdfUrl] = useState<string | null>(null);

  const { sending, sent, error, sendPrescription } = useSendPrescription();
  const addToast = useUIStore((s) => s.addToast);
  const setPrescriptionStatus = useUIStore((s) => s.setPrescriptionStatus);

  if (!isOpen) return null;

  const toggleChannel = (key: 'push' | 'email') => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSend = async () => {
    const selected = Object.keys(channels).filter((k) => channels[k as keyof typeof channels]);
    const res = await sendPrescription(phone, email, selected, wantInHousePharmacy);
    if (res) {
      const orderId = res.pharmacy_result?.pharmacy_order?.order_id || res.db_id || '';
      setCreatedOrderId(orderId);
      setCreatedPdfUrl(res.pdf_url || null);
      setPrescriptionStatus('Sent');

      addToast({
        type: 'success',
        title: 'Prescription & Receipt Dispatched',
        message: `Sent to ${phone || 'patient'} and queued at Pharmacy Counter #1.`,
      });
      onSuccess?.(res.pdf_url, orderId);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(16,26,46,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          background: 'var(--color-bg-surface, #fff)',
          color: 'var(--color-ink-900)',
          borderRadius: '20px',
          border: '1px solid var(--color-border, #E3E8EE)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Modal Header */}
        <div style={{ background: 'var(--color-bg-subtle, #101A2E)', padding: '20px 24px', color: 'var(--color-ink-900, #fff)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-ink-900, #fff)' }}>
              {sent ? 'Prescription & Receipts Dispatched' : 'Send Prescription & Receipts'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--color-ink-500, rgba(232,236,243,0.7))', margin: '4px 0 0 0' }}>
              Patient: {draft.patient_name || 'Anonymous Patient'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-ink-900, #fff)', cursor: 'pointer', opacity: 0.8 }} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {sent ? (
            /* Success View with Direct Links */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--color-primary-light, #E4F3F1)', color: '#12897F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '16px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                  Sent Successfully!
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)', margin: '4px 0 0 0' }}>
                  Prescription PDF and Pharmacy Order have been sent.
                </p>
              </div>

              {/* Action Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {createdOrderId && (
                  <a
                    href={`/receipt/${createdOrderId}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '12px 18px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #12897F, #0F7268)',
                      color: '#fff',
                      textDecoration: 'none',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 600,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(18,137,127,0.3)',
                    }}
                  >
                    <ShoppingBag size={16} /> Open Official Pharmacy Receipt ({createdOrderId}) <ExternalLink size={14} />
                  </a>
                )}

                {createdPdfUrl && (
                  <a
                {/* 🔒 PDF Security Password Badge with 1-Click Copy */}
                {(() => {
                  const dobClean = (draft.dob || (draft as any).patient_dob || '').replace(/\D/g, '');
                  const phoneClean = (phone || draft.phone || '').replace(/\D/g, '');
                  const resolvedPassword = dobClean.length >= 4 ? dobClean : (phoneClean.length >= 4 ? phoneClean.slice(-4) : '1234');
                  const passwordLabel = dobClean.length >= 4 ? 'Patient DOB' : (phoneClean.length >= 4 ? 'Phone Last 4 Digits' : 'Default Passcode');
                  return (
                    <div style={{ background: '#E4F3F1', border: '1px solid #12897F', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 16px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>🔒</span>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#12897F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PDF Security Password ({passwordLabel})</div>
                          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '16px', fontWeight: 700, color: '#101A2E', marginTop: '2px' }}>{resolvedPassword}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(resolvedPassword);
                          addToast({ type: 'info', title: 'Password Copied', message: `Copied '${resolvedPassword}' to clipboard!` });
                        }}
                        style={{ background: '#12897F', color: '#FFF', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Copy Password
                      </button>
                    </div>
                  );
                })()}

                {createdPdfUrl && (
                  <a
                    href={createdPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '12px 18px',
                      borderRadius: '10px',
                      border: '1.5px solid #E3E8EE',
                      background: '#FAFBFC',
                      color: '#101A2E',
                      textDecoration: 'none',
                      fontFamily: 'Inter',
                      fontWeight: 600,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <FileText size={16} color="#6D5DF6" /> View Encrypted Prescription PDF <ExternalLink size={14} color="#5B6B82" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* Configure Dispatch Form */
            <>
              {/* Phone and Email Input */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#5B6B82', marginBottom: '6px' }}>
                    Patient Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #E3E8EE',
                      fontFamily: 'IBM Plex Mono',
                      fontSize: '14px',
                      color: '#101A2E',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#5B6B82', marginBottom: '6px' }}>
                    Patient Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #E3E8EE',
                      fontFamily: 'IBM Plex Mono',
                      fontSize: '14px',
                      color: '#101A2E',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Delivery Channels Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#5B6B82', marginBottom: '8px' }}>
                  Dispatch Channels
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

                  <div
                    onClick={() => toggleChannel('push')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px',
                      border: `1.5px solid ${channels.push ? '#6D5DF6' : '#E3E8EE'}`,
                      background: channels.push ? '#EFECFE22' : '#FAFBFC',
                      cursor: 'pointer', flex: 1, transition: 'all 0.15s',
                    }}
                  >
                    <Smartphone size={16} color={channels.push ? '#6D5DF6' : '#5B6B82'} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: channels.push ? '#6D5DF6' : '#5B6B82' }}>Web Push</span>
                  </div>
                  
                  <div
                    onClick={() => toggleChannel('email')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: `1.5px solid ${channels.email ? '#6D5DF6' : '#E3E8EE'}`,
                      background: channels.email ? '#EFECFE22' : '#FAFBFC',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <MessageSquare size={16} color={channels.email ? '#6D5DF6' : '#5B6B82'} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: channels.email ? '#6D5DF6' : '#5B6B82' }}>Email Dispatch</span>
                  </div>
                </div>
              </div>

              {/* In-House Pharmacy Choice Toggle */}
              <div style={{ padding: '14px', borderRadius: '12px', background: '#F6F8FA', border: '1px solid #E3E8EE' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingBag size={16} color="#12897F" />
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#101A2E', margin: 0 }}>In-House Medicine Purchase</p>
                      <p style={{ fontSize: '11px', color: '#5B6B82', margin: '2px 0 0 0' }}>Generate receipt & alert Medical Desk counter</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={wantInHousePharmacy}
                    onChange={(e) => setWantInHousePharmacy(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#12897F' }}
                  />
                </div>
              </div>

              {/* Password Protection Note */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#5B6B82', fontFamily: 'IBM Plex Mono' }}>
                <ShieldCheck size={13} color="#12897F" /> PDF password-protected (DOB or last 4 digits of phone). Password is sent in email.
              </div>

              {error && (
                <p style={{ fontSize: '12px', color: '#E15554', margin: 0 }}>{error}</p>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '16px 24px', background: '#FAFBFC', borderTop: '1px solid #E3E8EE', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #E3E8EE', background: '#fff', color: '#5B6B82', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
          >
            {sent ? 'Close' : 'Cancel'}
          </button>

          {!sent && (
            <button
              onClick={handleSend}
              disabled={sending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #12897F, #0F7268)',
                color: '#fff',
                fontFamily: 'Space Grotesk',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(18,137,127,0.3)',
              }}
            >
              {sending ? <BoneSpinner size={14} color="#fff" /> : <Send size={15} />}
              {sending ? 'Dispatching...' : 'Confirm & Dispatch'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
