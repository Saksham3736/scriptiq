/* Sidebar.tsx — ScriptIQ Navigation Rail with Interactive Bottom-Left Account Popover */

import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  User,
  ChevronUp,
  ShoppingBag,
  Receipt,
  Cpu,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

const NAV = [
  { to: '/console', icon: Stethoscope, label: 'New Consult', roles: ['doctor', 'admin'] },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['doctor', 'admin'] },
  { to: '/receipts', icon: Receipt, label: 'Patient Receipts Portal', roles: ['doctor', 'admin', 'patient'] },
  { to: '/history', icon: ClipboardList, label: 'History', roles: ['doctor', 'admin', 'patient'] },
  { to: '/patients', icon: Users, label: 'Patients', roles: ['doctor', 'admin'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['doctor', 'admin', 'patient'] },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const isTelemetryOpen = useUIStore((s) => s.isTelemetryOpen);
  const toggleTelemetry = useUIStore((s) => s.toggleTelemetry);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowAccountMenu(false);
    logout();
    navigate('/login');
  };

  const roleColor =
    user?.role === 'doctor' ? '#12897F' : user?.role === 'admin' ? '#E8A33D' : '#6D5DF6';

  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        background: '#101A2E',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '20px' }}>
            {[35, 65, 100, 55, 80].map((h, i) => (
              <div
                key={i}
                className="waveform-bar"
                style={{ width: '3px', height: `${h * 0.18}px`, borderRadius: '2px', background: '#6D5DF6' }}
              />
            ))}
          </div>
          <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: '17px', color: '#F6F8FA' }}>
            ScriptIQ
          </span>
        </div>
        {user?.clinic && (
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: 'rgba(232,236,243,0.4)', marginTop: '4px', marginLeft: '1px' }}>
            {user.clinic}
          </p>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.filter((n) => !user || n.roles.includes(user.role)).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              background: isActive ? 'rgba(109,93,246,0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(109,93,246,0.2)' : '1px solid transparent',
              transition: 'all 0.15s',
              color: isActive ? '#6D5DF6' : 'rgba(232,236,243,0.6)',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: isActive ? 600 : 400, flex: 1 }}>
                  {label}
                </span>
                {isActive && <ChevronRight size={12} strokeWidth={2.5} />}
              </>
            )}
          </NavLink>
        ))}

        {/* Sidebar Telemetry Action Button */}
        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
          <button
            onClick={toggleTelemetry}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              background: isTelemetryOpen ? 'rgba(18, 137, 127, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: isTelemetryOpen ? '1px solid rgba(18, 137, 127, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: isTelemetryOpen ? '#2DD4BF' : 'rgba(232,236,243,0.7)',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.15s ease',
            }}
          >
            <Cpu size={16} color={isTelemetryOpen ? '#2DD4BF' : '#A78BFA'} />
            <span style={{ flex: 1, textAlign: 'left' }}>AI Telemetry</span>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: isTelemetryOpen ? '#2DD4BF' : 'rgba(255, 255, 255, 0.3)',
                boxShadow: isTelemetryOpen ? '0 0 6px #2DD4BF' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Bottom-left Account Management Pill & Popover Menu */}
      <div ref={accountRef} style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
        <div
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '10px',
            background: showAccountMenu ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: roleColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Space Grotesk,sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0) || '?'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 500, color: '#F6F8FA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
              {user?.name || 'User'}
            </p>
            <p style={{ fontFamily: 'IBM Plex Mono,monospace', fontSize: '10px', color: 'rgba(232,236,243,0.4)', textTransform: 'capitalize', margin: 0 }}>
              {user?.role || 'Doctor'}
            </p>
          </div>
          <ChevronUp size={13} color="rgba(232,236,243,0.5)" />
        </div>

        {/* Account Management Popover Menu */}
        {showAccountMenu && (
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: '12px',
              width: '240px',
              background: '#1E293B',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 16px 36px -4px rgba(0,0,0,0.4)',
              zIndex: 1000,
              overflow: 'hidden',
              padding: '6px 0',
            }}
          >
            <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '11px', fontWeight: 600, color: 'rgba(232,236,243,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Account Management
              </span>
            </div>

            <div style={{ padding: '4px 0' }}>
              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  navigate('/settings');
                }}
                style={popoverBtnStyle}
              >
                <Settings size={14} color="#6D5DF6" />
                <span>Manage Settings & Clinic</span>
              </button>

              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  navigate('/patients');
                }}
                style={popoverBtnStyle}
              >
                <User size={14} color="#12897F" />
                <span>Patient Directory</span>
              </button>

              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  navigate('/dashboard');
                }}
                style={popoverBtnStyle}
              >
                <Shield size={14} color="#E8A33D" />
                <span>System Dashboard</span>
              </button>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '4px' }}>
              <button onClick={handleLogout} style={{ ...popoverBtnStyle, color: '#E15554' }}>
                <LogOut size={14} color="#E15554" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

const popoverBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '9px 14px',
  background: 'transparent',
  border: 'none',
  fontFamily: 'Inter, sans-serif',
  fontSize: '12px',
  color: '#F6F8FA',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.15s ease',
};
