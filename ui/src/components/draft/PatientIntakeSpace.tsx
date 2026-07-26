import React, { useState } from 'react';
import { Mic, MicOff, Type, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useDraftStore } from '@/store/draftStore';

export default function PatientIntakeSpace() {
  const { draft, updateField, setDraft } = useDraftStore();
  const [mode, setMode] = useState<'typed' | 'voice'>('voice');
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Local state for typed fields
  const [name, setName] = useState(draft?.patient_name || '');
  const [phone, setPhone] = useState(draft?.phone || '');
  const [age, setAge] = useState(draft?.age || '');
  const [gender, setGender] = useState(draft?.gender || 'Male');
  const [dob, setDob] = useState(draft?.dob || (draft as any)?.patient_dob || '');
  const [complaint, setComplaint] = useState(draft?.chief_complaint || '');

  // Web Speech Recognition for Voice Intake
  const startVoiceIntake = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage('Speech recognition is not supported in this browser. Please use Typed mode.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage('Listening... Speak patient details (e.g. "Patient Rajesh Kumar, 45 years male, phone 9888478606")');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceText(transcript);
        parseVoiceIntake(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech error:', event.error);
        setIsListening(false);
        setStatusMessage(`Speech error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Could not start microphone.');
    }
  };

  // Simple heuristic parser for spoken patient details
  const parseVoiceIntake = (text: string) => {
    const lower = text.toLowerCase();
    
    // Extract Phone (digits)
    const phoneMatch = text.match(/\b\d{10}\b/);
    if (phoneMatch) {
      setPhone(phoneMatch[0]);
    }

    // Extract Age
    const ageMatch = lower.match(/(\d{1,3})\s*(years|yr|years old|old)/);
    if (ageMatch) {
      setAge(ageMatch[1]);
    }

    // Extract Gender
    if (lower.includes('female') || lower.includes('woman') || lower.includes('lady')) {
      setGender('Female');
    } else if (lower.includes('male') || lower.includes('man') || lower.includes('boy')) {
      setGender('Male');
    }

    // Extract Name heuristic (after 'patient' or 'name')
    const nameMatch = text.match(/(?:patient|name is|mr\.|mrs\.|ms\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (nameMatch) {
      setName(nameMatch[1]);
    }

    // Auto-sync into draft store if draft exists or create base draft
    const updatedDraft = {
      ...(draft || { medicines: [], symptoms: [], advice: [] }),
      patient_name: nameMatch ? nameMatch[1] : (name || draft?.patient_name || 'Patient'),
      phone: phoneMatch ? phoneMatch[0] : (phone || draft?.phone || ''),
      age: ageMatch ? ageMatch[1] : (age || draft?.age || ''),
      gender: lower.includes('female') ? 'Female' : (gender || draft?.gender || 'Male'),
      dob: dob || (draft as any)?.patient_dob || '',
      chief_complaint: text || complaint,
    };

    setDraft(updatedDraft as any);
  };

  const handleSaveTyped = () => {
    const updatedDraft = {
      ...(draft || { medicines: [], symptoms: [], advice: [] }),
      patient_name: name || 'Patient',
      phone: phone || '',
      age: age || '',
      gender: gender || 'Male',
      dob: dob || '',
      chief_complaint: complaint || '',
    };
    setDraft(updatedDraft as any);
    setStatusMessage('Patient details updated in draft!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div style={{
      background: 'var(--color-bg-surface, #FFFFFF)',
      borderRadius: '12px',
      border: '1.5px solid var(--color-border, #E3E8EE)',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
    }}>
      {/* Top Header & Mode Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={16} color="#12897F" />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13px', color: '#101A2E' }}>
            Patient Intake Space
          </span>
        </div>

        <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px', gap: '4px' }}>
          <button
            onClick={() => setMode('voice')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'voice' ? '#FFF' : 'transparent',
              boxShadow: mode === 'voice' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              fontWeight: 600,
              color: mode === 'voice' ? '#12897F' : '#64748B'
            }}
          >
            <Mic size={13} /> Voice Intake
          </button>
          <button
            onClick={() => setMode('typed')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'typed' ? '#FFF' : 'transparent',
              boxShadow: mode === 'typed' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              fontWeight: 600,
              color: mode === 'typed' ? '#12897F' : '#64748B'
            }}
          >
            <Type size={13} /> Typed Intake
          </button>
        </div>
      </div>

      {/* Voice Mode Content */}
      {mode === 'voice' ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <button
              onClick={startVoiceIntake}
              disabled={isListening}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: isListening ? '#EF4444' : '#12897F',
                color: '#FFF',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              {isListening ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} />}
              {isListening ? 'Listening...' : 'Speak Patient Details'}
            </button>

            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Speak name, age, gender, phone & symptoms
            </span>
          </div>

          {voiceText && (
            <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: '#334155', marginBottom: '10px' }}>
              <span style={{ fontWeight: 600, color: '#12897F' }}>Transcribed: </span>"{voiceText}"
            </div>
          )}
        </div>
      ) : (
        /* Typed Mode Content */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Patient Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9888478606"
              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Age & Gender</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age (e.g. 35)"
                style={{ width: '50%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ width: '50%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', background: '#FFF' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Date of Birth (DOB)</label>
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="DDMMYYYY"
              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
            <button
              onClick={handleSaveTyped}
              style={{
                width: '100%',
                padding: '8px',
                background: '#12897F',
                color: '#FFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Apply Patient Details
            </button>
          </div>
        </div>
      )}

      {statusMessage && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#12897F', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} /> {statusMessage}
        </div>
      )}
    </div>
  );
}
