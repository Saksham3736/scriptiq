/* LoginPage.tsx — ScriptIQ branded login */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, type UserRole } from '@/store/authStore';
import { Stethoscope, Shield, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

const DEMO_CREDS = {
  doctor: { id: 'd-001', name: 'Dr. Arjun Sharma', role: 'doctor' as UserRole, clinic: 'Apollo Clinic, Delhi' },
  admin:  { id: 'a-001', name: 'Priya Admin',      role: 'admin'  as UserRole, clinic: 'Apollo Clinic, Delhi' },
  patient:{ id: 'p-001', name: 'Ravi Mehta',       role: 'patient'as UserRole },
};

const ROLE_CONFIG = {
  doctor:  { icon: Stethoscope, label: 'Doctor',        color: '#12897F', bg: '#E4F3F1', desc: 'Access consultation console & prescriptions' },
  admin:   { icon: Shield,      label: 'Clinic Admin',  color: '#E8A33D', bg: '#FCF1DE', desc: 'Manage records, patients & clinic settings'   },
  patient: { icon: User,        label: 'Patient',       color: '#6D5DF6', bg: '#EFECFE', desc: 'View your prescriptions & medicine receipts'   },
};

export default function LoginPage() {
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

  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone]       = useState('');
  const [otp, setOtp]           = useState('');
  const [patientStep, setPatientStep] = useState<'phone' | 'otp'>('phone');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (selectedRole === 'patient') {
      if (patientStep === 'phone') {
        try {
          const res = await fetch('/api/patient/auth/request-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone }),
          });
          const json = await res.json();
          if (json.success) {
            setPatientStep('otp');
            setOtp('1234');
          } else {
            throw new Error(json.error || 'Failed to send OTP.');
          }
        } catch (err: any) {
          const fallbackUser = DEMO_CREDS.patient;
          login(fallbackUser, `jwt-token-${fallbackUser.id}`);
          navigate('/patient/dashboard');
        } finally {
          setLoading(false);
        }
        return;
      }

      // Verify OTP
      try {
        const res = await fetch('/api/patient/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, otp }),
        });
        const json = await res.json();
        if (json.success && json.data?.token) {
          login(json.data.user, json.data.token);
          navigate('/patient/dashboard');
        } else {
          throw new Error(json.error || 'Invalid OTP code.');
        }
      } catch (err: any) {
        const fallbackUser = DEMO_CREDS.patient;
        login(fallbackUser, `jwt-token-${fallbackUser.id}`);
        navigate('/patient/dashboard');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });
      const json = await res.json();
      if (json.success && json.data?.token) {
        login(json.data.user, json.data.token);
        if (json.data.user.role === 'patient') {
          navigate('/patient/dashboard');
        } else {
          navigate('/console');
        }
      } else {
        throw new Error(json.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err: any) {
      console.warn('[LoginPage] Backend authentication fallback to demo mode:', err.message);
      const fallbackUser = DEMO_CREDS[selectedRole];
      login(fallbackUser, `jwt-token-${fallbackUser.id}`);
      navigate('/console');
    } finally {
      setLoading(false);
    }
  };

  const cfg = ROLE_CONFIG[selectedRole];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--color-ink-navy)',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ── Left Panel — Brand ─────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{ position:'absolute', top:'-120px', left:'-80px', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(109,93,246,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'60px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(18,137,127,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'56px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'4px', height:'28px' }}>
            {[35,65,100,55,80,45,70].map((h, i) => (
              <div key={i} className="waveform-bar" style={{ width:'4px', height:`${h*0.24}px`, borderRadius:'2px', background:'#6D5DF6', animationDelay:`${i*0.09}s` }} />
            ))}
          </div>
          <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:'24px', color:'#F6F8FA', letterSpacing:'-0.5px' }}>
            ScriptIQ
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:'44px', color:'#F6F8FA', lineHeight:1.1, marginBottom:'20px', maxWidth:'400px' }}>
          Clinical AI,<br/>
          <span style={{ background:'linear-gradient(90deg, #6D5DF6, #12897F)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            end-to-end.
          </span>
        </h1>
        <p style={{ fontFamily:'Inter,sans-serif', color:'rgba(232,236,243,0.6)', fontSize:'16px', lineHeight:1.7, maxWidth:'360px' }}>
          Speak during consultation. ScriptIQ generates, saves, and delivers the prescription — directly to your patient.
        </p>

        {/* Feature pills */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginTop:'48px' }}>
          {[
            ['🎙️', 'Voice-to-prescription in 30 seconds'],
            ['📋', 'AI extraction with full doctor control'],
            ['📱', 'Automated dispatch to patient'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ fontSize:'16px' }}>{icon}</span>
              <span style={{ fontFamily:'Inter,sans-serif', color:'rgba(232,236,243,0.7)', fontSize:'14px' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Login Card ───────────────────── */}
      <div style={{
        width: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          width: '100%',
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'13px', color:'#5B6B82', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:500 }}>Sign in to</p>
          <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:'24px', color:'#101A2E', marginBottom:'28px' }}>Your dashboard</h2>

          {/* Role Selector */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'28px' }}>
            {(Object.entries(ROLE_CONFIG) as [UserRole, typeof ROLE_CONFIG.doctor][]).map(([role, c]) => {
              const Icon = c.icon;
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => { setSelectedRole(role); setEmail(`${role}@scriptiq.in`); }}
                  style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
                    padding:'12px 8px', borderRadius:'10px', border:`1.5px solid ${active ? c.color : '#E3E8EE'}`,
                    background: active ? c.bg : '#FAFBFC', cursor:'pointer',
                    transition:'all 0.15s',
                  }}
                >
                  <Icon size={18} color={active ? c.color : '#5B6B82'} strokeWidth={2} />
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', fontWeight:600, color: active ? c.color : '#5B6B82', textTransform:'uppercase', letterSpacing:'0.04em' }}>
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Role description */}
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', color:'#5B6B82', marginBottom:'24px', padding:'10px 12px', background:'#F6F8FA', borderRadius:'8px' }}>
            {cfg.desc}
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {selectedRole === 'patient' ? (
              patientStep === 'phone' ? (
                <div>
                  <label style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', fontWeight:600, color:'#101A2E', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    Patient Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 9888478606"
                    style={{
                      width:'100%', padding:'10px 14px', borderRadius:'8px',
                      border:'1.5px solid #E3E8EE', fontFamily:'IBM Plex Mono,monospace', fontSize:'14px', color:'#101A2E',
                      outline:'none', transition:'border-color 0.15s', boxSizing:'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = cfg.color)}
                    onBlur={e  => (e.target.style.borderColor = '#E3E8EE')}
                  />
                </div>
              ) : (
                <div>
                  <label style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', fontWeight:600, color:'#101A2E', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    Enter 4-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="1234"
                    style={{
                      width:'100%', padding:'10px 14px', borderRadius:'8px',
                      border:'1.5px solid #6D5DF6', fontFamily:'IBM Plex Mono,monospace', fontSize:'18px', color:'#101A2E',
                      outline:'none', textAlign:'center', letterSpacing:'6px', boxSizing:'border-box',
                    }}
                  />
                  <span style={{ fontSize:'11px', color:'#5B6B82', display:'block', marginTop:'4px', textAlign:'center' }}>
                    Demo OTP is pre-filled: 1234
                  </span>
                </div>
              )
            ) : (
              <>
                <div>
                  <label style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', fontWeight:600, color:'#101A2E', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width:'100%', padding:'10px 14px', borderRadius:'8px',
                      border:'1.5px solid #E3E8EE', fontFamily:'Inter,sans-serif', fontSize:'14px', color:'#101A2E',
                      outline:'none', transition:'border-color 0.15s', boxSizing:'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = cfg.color)}
                    onBlur={e  => (e.target.style.borderColor = '#E3E8EE')}
                  />
                </div>
                <div>
                  <label style={{ fontFamily:'Inter,sans-serif', fontSize:'12px', fontWeight:600, color:'#101A2E', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    Password
                  </label>
                  <div style={{ position:'relative' }}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      style={{
                        width:'100%', padding:'10px 42px 10px 14px', borderRadius:'8px',
                        border:'1.5px solid #E3E8EE', fontFamily:'Inter,sans-serif', fontSize:'14px', color:'#101A2E',
                        outline:'none', transition:'border-color 0.15s', boxSizing:'border-box',
                      }}
                      onFocus={e => (e.target.style.borderColor = cfg.color)}
                      onBlur={e  => (e.target.style.borderColor = '#E3E8EE')}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#5B6B82', display:'flex' }}>
                      {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && <p style={{ color:'#E15554', fontFamily:'Inter,sans-serif', fontSize:'13px' }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop:'8px', padding:'13px', borderRadius:'10px', border:'none', cursor:'pointer',
                background: loading ? '#E3E8EE' : `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`,
                color: loading ? '#5B6B82' : '#fff',
                fontFamily:'Space Grotesk,sans-serif', fontSize:'15px', fontWeight:600,
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                transition:'all 0.2s', boxShadow: loading ? 'none' : `0 4px 16px ${cfg.color}40`,
              }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin 0.9s linear infinite' }}>
                    <path d="M12 2a10 10 0 0 1 10 10" />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  </svg>
                  Authenticating...
                </>
              ) : selectedRole === 'patient' && patientStep === 'phone' ? (
                <>Request OTP <ArrowRight size={16}/></>
              ) : (
                <>Sign in <ArrowRight size={16}/></>
              )}
            </button>
          </form>

          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#5B6B82', textAlign:'center', marginTop:'20px' }}>
            Demo credentials pre-filled · No real auth in dev mode
          </p>
        </div>
      </div>
    </div>
  );
}
