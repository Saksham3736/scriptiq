import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Lock, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function PatientLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'patient') {
        navigate('/patient/dashboard', { replace: true });
      } else {
        navigate('/console', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/patient/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to send OTP.');

      setStep('otp');
      setOtp('1234'); // Pre-fill demo OTP
    } catch (err: any) {
      setError(err.message || 'Error requesting OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 4-digit OTP.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/patient/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Invalid OTP.');

      login(data.data.user, data.data.token);
      navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1E293B', borderRadius: '16px', border: '1px solid #334155', padding: '40px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', textAlign: 'center' }}>
        
        {/* Header Branding */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#0284C722', border: '1px solid #0284C744', borderRadius: '99px', marginBottom: '24px' }}>
          <Activity size={18} color="#38BDF8" />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '14px', color: '#38BDF8', letterSpacing: '0.05em' }}>
            ScriptIQ Patient Portal
          </span>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>
          {step === 'phone' ? 'Patient Sign In' : 'Enter Verification OTP'}
        </h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '32px' }}>
          {step === 'phone'
            ? 'Access your prescriptions, dosage reminders & instant doctor alerts.'
            : `We sent a 4-digit OTP to ${phone}. Enter demo code 1234.`}
        </p>

        {step === 'phone' ? (
          <form onSubmit={handleRequestOtp} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Smartphone size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9888478606"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    background: '#0F172A',
                    border: '1.5px solid #334155',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '15px',
                    fontFamily: 'IBM Plex Mono, monospace',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: '#0284C7',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? 'Sending OTP...' : 'Continue'} <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
                4-Digit OTP Code
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1234"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    background: '#0F172A',
                    border: '1.5px solid #38BDF8',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '20px',
                    letterSpacing: '8px',
                    fontFamily: 'IBM Plex Mono, monospace',
                    outline: 'none',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: '#10B981',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Access Dashboard'} <ShieldCheck size={18} />
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              style={{ width: '100%', padding: '10px', background: 'transparent', color: '#94A3B8', border: 'none', cursor: 'pointer', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}
            >
              Change Phone Number
            </button>
          </form>
        )}

        {error && (
          <p style={{ marginTop: '16px', fontSize: '13px', color: '#EF4444', background: '#EF444411', padding: '10px', borderRadius: '6px', border: '1px solid #EF444433' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
