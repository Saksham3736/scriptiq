import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Smartphone } from 'lucide-react';

const VAPID_PUBLIC_KEY = "BD3tmSicsE_2-a3_lG1yHpePnf2QLDnPx65cGgCzronPmSA86KX-H0OFfixR7ADYaFxIv1257RklLVrloPTgQyc";

function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PatientPortal() {
  const [phone, setPhone] = useState('9888478606');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if already subscribed in SW
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(swReg => {
        swReg.pushManager.getSubscription().then(sub => {
          if (sub) {
            setIsSubscribed(true);
          }
        });
      });
    }
  }, []);

  const handleSubscribe = async () => {
    if (!phone) {
      setMessage("Please enter your phone number.");
      return;
    }
    
    setLoading(true);
    setMessage('');
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications are not supported by your browser.');
      }

      // Request permission using Safari-compliant gesture flow
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification');
      }

      const swReg = await navigator.serviceWorker.register('/sw.js');
      const applicationServerKey = urlB64ToUint8Array(VAPID_PUBLIC_KEY);
      
      const subscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      // Send to backend
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          subscription: subscription.toJSON()
        })
      });

      if (!res.ok) throw new Error('Failed to save subscription on server');
      
      setIsSubscribed(true);
      setMessage('Successfully subscribed! Instant welcome push notification sent to your device.');
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestPush = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/prescription/send-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          patient_name: 'Patient (Test Mode)'
        })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to dispatch push notification.');
      }
      setMessage('Test push notification sent! Check your desktop popup.');
    } catch (err: any) {
      setMessage(err.message || 'Error sending test push.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#FFF', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: isSubscribed ? '#EFECFE' : '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          {isSubscribed ? <Bell size={32} color="#6D5DF6" /> : <BellOff size={32} color="#94A3B8" />}
        </div>
        
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>Patient Portal</h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px' }}>
          Subscribe to receive instant push notifications when your doctor generates a prescription.
        </p>

        <div style={{ textAlign: 'left', marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
            Phone Number
          </label>
          <div style={{ position: 'relative' }}>
            <Smartphone size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9888478606"
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                borderRadius: '8px',
                border: '1.5px solid #E2E8F0',
                outline: 'none',
                fontSize: '15px',
                fontFamily: 'IBM Plex Mono, monospace',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: isSubscribed ? '#10B981' : '#6D5DF6',
            color: '#FFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            opacity: loading ? 0.7 : 1,
            marginBottom: '10px'
          }}
        >
          {loading ? 'Processing...' : isSubscribed ? 'Re-Subscribe Push Notifications' : 'Enable Push Notifications'}
        </button>

        {isSubscribed && (
          <button
            onClick={handleSendTestPush}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#F1F5F9',
              color: '#334155',
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🔔 Send Test Push Notification
          </button>
        )}

        {message && (
          <p style={{ marginTop: '16px', fontSize: '13px', color: isSubscribed ? '#10B981' : '#EF4444' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
