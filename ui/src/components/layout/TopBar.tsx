/* TopBar.tsx — Doctor Console Header with Patient Autocomplete, Notifications Popover & Profile Dropdown */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  LogOut,
  User as UserIcon,
  Shield,
  MessageSquare,
  Check,
  Sun,
  Moon,
  Monitor,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useDraftStore } from '@/store/draftStore';
import { useRecordingStore } from '@/store/recordingStore';
import { useUIStore } from '@/store/uiStore';
import { useTheme } from '../theme/ThemeProvider';
import AILoadingStatusBadge from '../ui/AILoadingStatusBadge';
import PatientSearchAutocomplete from './PatientSearchAutocomplete';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

export default function TopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDirty, savedId, deliveryStatus } = useDraftStore();
  const { theme, effectiveTheme, setTheme } = useTheme();
  const { isAutoPilotEnabled, toggleAutoPilot } = useUIStore();
  const status = useRecordingStore((s) => s.status);
  const isProcessing = status === 'processing';

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'WhatsApp Link Dispatched',
      message: 'Prescription PDF link sent to patient Priya Verma (919876543211)',
      time: '5m ago',
      type: 'success',
      read: false,
    },
    {
      id: '2',
      title: 'Pharmacy Order Ready',
      message: 'In-house dispense order PHARM-20260725-9806 ready at counter desk',
      time: '18m ago',
      type: 'info',
      read: false,
    },
    {
      id: '3',
      title: 'MongoDB Cluster Synced',
      message: 'Database backup synchronized to Atlas collection Agent_Doctor',
      time: '42m ago',
      type: 'success',
      read: true,
    },
  ]);

  // Close popovers on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/login');
  };

  const saveStatus = !savedId
    ? { icon: Clock, text: 'Unsaved draft', color: '#5B6B82' }
    : isDirty
    ? { icon: AlertCircle, text: 'Unsaved changes', color: '#E8A33D' }
    : { icon: CheckCircle, text: 'Saved', color: '#12897F' };

  const SaveIcon = saveStatus.icon;

  const deliveryBadge =
    deliveryStatus === 'sent'
      ? { text: 'Sent', bg: '#E4F3F1', color: '#12897F' }
      : deliveryStatus === 'delivered'
      ? { text: 'Delivered', bg: '#E4F3F1', color: '#12897F' }
      : deliveryStatus === 'viewed'
      ? { text: 'Viewed', bg: '#EFECFE', color: '#6D5DF6' }
      : null;

  return (
    <header
      style={{
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'var(--color-bg-surface, #FFFFFF)',
        borderBottom: '1px solid var(--color-border, #E3E8EE)',
        boxShadow: 'var(--shadow-xs)',
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Left — Patient context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <p style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: '15px', color: 'var(--color-ink-900, #101A2E)', lineHeight: 1.2, margin: 0 }}>
            New Consultation
          </p>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: '#5B6B82', margin: 0 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Save status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '99px', background: '#F6F8FA', border: '1px solid #E3E8EE' }}>
          <SaveIcon size={11} color={saveStatus.color} strokeWidth={2.5} />
          <span style={{ fontFamily: 'IBM Plex Mono,monospace', fontSize: '10px', color: saveStatus.color, fontWeight: 500 }}>
            {saveStatus.text}
          </span>
        </div>

        {/* Delivery badge */}
        {deliveryBadge && (
          <div style={{ padding: '4px 10px', borderRadius: '99px', background: deliveryBadge.bg }}>
            <span style={{ fontFamily: 'IBM Plex Mono,monospace', fontSize: '10px', color: deliveryBadge.color, fontWeight: 500 }}>
              {deliveryBadge.text}
            </span>
          </div>
        )}
      </div>

      {/* Right — AI Processing Status + Search Autocomplete + Auto-Pilot Toggle + Theme Toggle + Bell + User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AILoadingStatusBadge isProcessing={isProcessing} />

        {/* Auto-Pilot Mode Switch */}
        <button
          onClick={toggleAutoPilot}
          title={isAutoPilotEnabled ? "Auto-Pilot ACTIVE: Voice/text automatically generates PDF & WhatsApp dispatch." : "Auto-Pilot OFF: Click to enable zero-touch automated processing."}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '99px',
            background: isAutoPilotEnabled ? 'var(--color-primary-light, #E4F3F1)' : 'var(--color-bg-subtle, #F6F8FA)',
            border: isAutoPilotEnabled ? '1.5px solid #12897F' : '1.5px solid var(--color-border, #E3E8EE)',
            color: isAutoPilotEnabled ? '#12897F' : 'var(--color-ink-500, #5B6B82)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isAutoPilotEnabled ? '0 2px 8px rgba(18, 137, 127, 0.2)' : 'none',
          }}
        >
          <Zap size={13} color={isAutoPilotEnabled ? '#12897F' : '#64748B'} fill={isAutoPilotEnabled ? '#12897F' : 'none'} />
          <span>{isAutoPilotEnabled ? 'Auto-Pilot ON' : 'Auto-Pilot OFF'}</span>
        </button>

        <PatientSearchAutocomplete />

        {/* Theme Toggle Button */}
        <button
          onClick={cycleTheme}
          title={`Theme: ${theme} (Effective: ${effectiveTheme}). Click to change.`}
          aria-label={`Current theme: ${theme}. Click to switch theme.`}
          style={{
            width: 36,
            height: 36,
            borderRadius: '8px',
            border: '1.5px solid var(--color-border)',
            background: 'var(--color-bg-subtle)',
            color: 'var(--color-ink-700)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          {theme === 'dark' ? (
            <Moon size={16} strokeWidth={2} />
          ) : theme === 'light' ? (
            <Sun size={16} strokeWidth={2} />
          ) : (
            <Monitor size={16} strokeWidth={2} />
          )}
        </button>

        {/* Notification Bell Icon & Popover */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              borderRadius: '8px',
              border: showNotifications ? '1.5px solid #12897F' : '1.5px solid #E3E8EE',
              background: '#F6F8FA',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <Bell size={16} color={showNotifications ? '#12897F' : '#5B6B82'} strokeWidth={2} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#E15554', border: '1.5px solid #fff' }} />
            )}
          </button>

          {/* Notifications Popover Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '340px',
                background: 'var(--color-bg-surface, #FFFFFF)',
                borderRadius: '12px',
                border: '1px solid var(--color-border, #E3E8EE)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 16px', background: 'var(--color-bg-subtle, #F8FAFC)', borderBottom: '1px solid var(--color-border, #E2E8F0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)' }}>
                  Notifications ({unreadCount} new)
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{ background: 'none', border: 'none', color: '#12897F', fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <Check size={12} /> Mark read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '6px 0' }}>
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--color-border, #F1F5F9)',
                      background: item.read ? 'transparent' : 'var(--color-primary-light, #F0FDF4)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '12px', color: 'var(--color-ink-900, #101A2E)' }}>
                        {item.title}
                      </span>
                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '10px', color: 'var(--color-ink-500, #94A3B8)' }}>{item.time}</span>
                    </div>
                    <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--color-ink-700, #5B6B82)', lineHeight: 1.4, margin: 0 }}>
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Pill & Dropdown Menu */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
              background: showProfileMenu ? 'var(--color-bg-subtle, #F1F5F9)' : 'transparent',
              transition: 'background 0.15s ease',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#12897F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Space Grotesk,sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                color: '#fff',
              }}
            >
              {user?.name?.charAt(0) || 'D'}
            </div>
            <ChevronDown size={13} color="var(--color-ink-500, #5B6B82)" />
          </div>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                background: 'var(--color-bg-surface, #FFFFFF)',
                borderRadius: '12px',
                border: '1px solid var(--color-border, #E3E8EE)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                overflow: 'hidden',
                padding: '6px 0',
              }}
            >
              {/* User Info Header */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border, #F1F5F9)' }}>
                <p style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                  {user?.name || 'Dr. Arjun Sharma'}
                </p>
                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '11px', color: '#12897F', margin: '2px 0 0 0', textTransform: 'capitalize', fontWeight: 600 }}>
                  Role: {user?.role || 'Doctor'}
                </p>
                <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--color-ink-500, #64748B)', margin: '2px 0 0 0' }}>
                  {user?.clinic || 'Apollo Medical Clinic'}
                </p>
              </div>

              {/* Menu Actions */}
              <div style={{ padding: '4px 0' }}>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  style={dropdownBtnStyle}
                >
                  <Settings size={14} color="#5B6B82" />
                  <span>Manage Settings & Clinic</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/patients');
                  }}
                  style={dropdownBtnStyle}
                >
                  <UserIcon size={14} color="#5B6B82" />
                  <span>Patient Directory Dossiers</span>
                </button>
              </div>

              {/* Logout Button */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '4px' }}>
                <button onClick={handleLogout} style={{ ...dropdownBtnStyle, color: '#E15554' }}>
                  <LogOut size={14} color="#E15554" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const dropdownBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '9px 16px',
  background: 'transparent',
  border: 'none',
  fontFamily: 'Inter, sans-serif',
  fontSize: '12px',
  color: '#334155',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.15s ease',
};
