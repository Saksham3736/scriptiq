/* SettingsPage.tsx — ScriptIQ Web Application Settings Suite */

import { useState, useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import { useUIStore } from '@/store/uiStore';
import {
  Building2,
  Cpu,
  FileText,
  MessageSquare,
  Shield,
  Save,
  CheckCircle2,
  Sliders,
  Sparkles,
  Lock,
  Smartphone,
  Globe,
  UploadCloud,
  ExternalLink,
} from 'lucide-react';

type SettingsTab = 'clinic' | 'ai' | 'pdf' | 'pharmacy' | 'email' | 'security';

export default function SettingsPage() {
  const addToast = useUIStore((s) => s.addToast);
  const [activeTab, setActiveTab] = useState<SettingsTab>('clinic');
  const [saving, setSaving] = useState(false);
  const [generatingPreview, setGeneratingPreview] = useState(false);

  // Letterhead State
  const [hospitalName, setHospitalName] = useState('MEDICARE HOSPITAL');
  const [hospitalSubtitle, setHospitalSubtitle] = useState('Center for Advanced Medicine & Multispecialty Care');
  const [doctorNameLetterhead, setDoctorNameLetterhead] = useState('Dr. Arjun Sharma');
  const [doctorQualification, setDoctorQualification] = useState('MBBS, MD (General Medicine)');
  const [doctorSpecialization, setDoctorSpecialization] = useState('Senior Consultant Physician');
  const [doctorRegNo, setDoctorRegNo] = useState('PMC/2026/123456');
  const [hospitalAddress, setHospitalAddress] = useState('Civil Lines, Ludhiana, Punjab - 141001');
  const [hospitalPhone, setHospitalPhone] = useState('+91 98765 43210');
  const [hospitalEmail, setHospitalEmail] = useState('dr.arjunsharma@medicarehospital.com');
  const [tagline, setTagline] = useState('Notice: Valid for 30 days from date of issue. Please bring this prescription on follow-up visit.');
  const [primaryColor, setPrimaryColor] = useState('#1A365D');
  const [secondaryColor, setSecondaryColor] = useState('#2B6CB0');
  const [headerLayout, setHeaderLayout] = useState('center');

  // AI & Speech Settings State
  const [llmModel, setLlmModel] = useState('gemini-2.0-flash');
  const [fallbackModel, setFallbackModel] = useState('gemma-4-26b-a4b-it');
  const [sttModel, setSttModel] = useState('tiny');
  const [autoRefine, setAutoRefine] = useState(true);

  const [encryptPdf, setEncryptPdf] = useState(true);
  const [defaultFollowup, setDefaultFollowup] = useState('7 days');
  const [showWatermark, setShowWatermark] = useState(true);

  const [inHousePharmacyDefault, setInHousePharmacyDefault] = useState(true);

  // Email Settings State
  const [emailSimulationMode, setEmailSimulationMode] = useState(true);
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('scriptiq.sk@gmail.com');
  const [smtpPass, setSmtpPass] = useState('');
  const [senderEmail, setSenderEmail] = useState('scriptiq.sk@gmail.com');

  // Load Letterhead & System Settings from API on Mount
  useEffect(() => {
    fetch('/api/settings/letterhead')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          if (d.hospital_name) setHospitalName(d.hospital_name);
          if (d.hospital_subtitle) setHospitalSubtitle(d.hospital_subtitle);
          if (d.doctor_name) setDoctorNameLetterhead(d.doctor_name);
          if (d.doctor_qualification) setDoctorQualification(d.doctor_qualification);
          if (d.doctor_specialization) setDoctorSpecialization(d.doctor_specialization);
          if (d.doctor_reg_no) setDoctorRegNo(d.doctor_reg_no);
          if (d.hospital_address) setHospitalAddress(d.hospital_address);
          if (d.hospital_phone) setHospitalPhone(d.hospital_phone);
          if (d.hospital_email) setHospitalEmail(d.hospital_email);
          if (d.tagline) setTagline(d.tagline);
          if (d.primary_color) setPrimaryColor(d.primary_color);
          if (d.secondary_color) setSecondaryColor(d.secondary_color);
          if (d.header_layout) setHeaderLayout(d.header_layout);
          if (d.llm_model) setLlmModel(d.llm_model);
          if (d.fallback_model) setFallbackModel(d.fallback_model);
          if (d.stt_model) setSttModel(d.stt_model);
          if (d.auto_refine !== undefined) setAutoRefine(d.auto_refine);
          if (d.encrypt_pdf !== undefined) setEncryptPdf(d.encrypt_pdf);
          if (d.default_followup) setDefaultFollowup(d.default_followup);
          if (d.show_watermark !== undefined) setShowWatermark(d.show_watermark);
          if (d.in_house_pharmacy_default !== undefined) setInHousePharmacyDefault(d.in_house_pharmacy_default);
        }
      })
      .catch((err) => console.warn('[SettingsPage] Error loading letterhead config:', err));
      
    fetch('/api/settings/email')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          if (d.email_simulation_mode !== undefined) setEmailSimulationMode(d.email_simulation_mode);
          if (d.smtp_host) setSmtpHost(d.smtp_host);
          if (d.smtp_port) setSmtpPort(d.smtp_port.toString());
          if (d.smtp_user) setSmtpUser(d.smtp_user);
          if (d.smtp_pass !== undefined) setSmtpPass(d.smtp_pass);
          if (d.sender_email) setSenderEmail(d.sender_email);
        }
      })
      .catch((err) => console.warn('[SettingsPage] Error loading email config:', err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        hospital_name: hospitalName,
        hospital_subtitle: hospitalSubtitle,
        doctor_name: doctorNameLetterhead,
        doctor_qualification: doctorQualification,
        doctor_specialization: doctorSpecialization,
        doctor_reg_no: doctorRegNo,
        hospital_address: hospitalAddress,
        hospital_phone: hospitalPhone,
        hospital_email: hospitalEmail,
        tagline: tagline,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        header_layout: headerLayout,
        llm_model: llmModel,
        fallback_model: fallbackModel,
        stt_model: sttModel,
        auto_refine: autoRefine,
        encrypt_pdf: encryptPdf,
        default_followup: defaultFollowup,
        show_watermark: showWatermark,
        in_house_pharmacy_default: inHousePharmacyDefault,
      };

      const res = await fetch('/api/settings/letterhead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      const emailRes = await fetch('/api/settings/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_simulation_mode: emailSimulationMode,
          smtp_host: smtpHost,
          smtp_port: parseInt(smtpPort.toString(), 10),
          smtp_user: smtpUser,
          smtp_pass: smtpPass,
          sender_email: senderEmail,
        }),
      });
      const emailData = await emailRes.json();

      setSaving(false);
      if (data.success && emailData.success) {
        addToast({
          type: 'success',
          title: 'All Settings & Letterhead Saved',
          message: 'System configuration and PDF letterhead branding have been persisted to database.',
        });
      } else {
        addToast({
          type: 'error',
          title: 'Save Failed',
          message: data.error || 'Failed to save settings to server.',
        });
      }
    } catch (err: any) {
      setSaving(false);
      addToast({
        type: 'error',
        title: 'Connection Error',
        message: err.message || 'Unable to connect to server.',
      });
    }
  };

  const handleGenerateSamplePdf = async () => {
    setGeneratingPreview(true);
    try {
      const payload = {
        hospital_name: hospitalName,
        hospital_subtitle: hospitalSubtitle,
        doctor_name: doctorNameLetterhead,
        doctor_qualification: doctorQualification,
        doctor_specialization: doctorSpecialization,
        doctor_reg_no: doctorRegNo,
        hospital_address: hospitalAddress,
        hospital_phone: hospitalPhone,
        hospital_email: hospitalEmail,
        tagline: tagline,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        header_layout: headerLayout,
      };

      const res = await fetch('/api/settings/letterhead/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setGeneratingPreview(false);

      if (data.success && data.data?.pdf_url) {
        window.open(data.data.pdf_url, '_blank');
        addToast({
          type: 'success',
          title: 'Blank Sample PDF Generated',
          message: 'Sample prescription PDF with your customized letterhead has been generated and opened in a new tab.',
        });
      } else {
        addToast({
          type: 'error',
          title: 'Preview Generation Failed',
          message: data.error || 'Could not generate sample prescription PDF.',
        });
      }
    } catch (err: any) {
      setGeneratingPreview(false);
      addToast({
        type: 'error',
        title: 'Connection Error',
        message: err.message || 'Unable to connect to server.',
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-app, #F8FAFC)', color: 'var(--color-ink-900)', fontFamily: 'Inter, sans-serif' }}>
      <TopBar />

      <div style={{ flex: 1, padding: '32px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '26px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
              System & Clinical Settings
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)', marginTop: '4px' }}>
              Manage clinic identity, AI language models, PDF letterhead branding, and dispatch preferences
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {activeTab === 'pdf' && (
              <button
                onClick={handleGenerateSamplePdf}
                disabled={generatingPreview}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'var(--color-bg-subtle, #101A2E)',
                  color: 'var(--color-ink-900, #fff)',
                  border: '1px solid var(--color-border, #1E293B)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: generatingPreview ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                }}
              >
                <FileText size={16} color="#12897F" />
                {generatingPreview ? 'Generating PDF...' : 'Generate Blank PDF'}
                <ExternalLink size={14} color="var(--color-ink-500, rgba(255,255,255,0.7))" />
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                background: '#12897F',
                color: '#fff',
                border: 'none',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(18, 137, 127, 0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Main Settings Container (Tab Navigation + Panel) */}
        <div style={{ display: 'flex', gap: '32px', background: 'var(--color-bg-surface, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {/* Left Tab Sidebar */}
          <div style={{ width: '260px', background: 'var(--color-bg-subtle, #F8FAFC)', borderRight: '1px solid var(--color-border, #E3E8EE)', padding: '20px 12px', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <TabButton
                active={activeTab === 'clinic'}
                onClick={() => setActiveTab('clinic')}
                icon={Building2}
                label="Clinic & Doctor"
                desc="Branding & Letterhead"
              />
              <TabButton
                active={activeTab === 'ai'}
                onClick={() => setActiveTab('ai')}
                icon={Cpu}
                label="AI & Speech Engine"
                desc="LLM & Whisper STT"
              />
              <TabButton
                active={activeTab === 'pdf'}
                onClick={() => setActiveTab('pdf')}
                icon={FileText}
                label="Prescription & PDF"
                desc="Encrypted PDF options"
              />
              <TabButton
                active={activeTab === 'pharmacy'}
                onClick={() => setActiveTab('pharmacy')}
                icon={Building2}
                label="Pharmacy Dispatch"
                desc="Internal routing"
              />
              <TabButton
                active={activeTab === 'email'}
                onClick={() => setActiveTab('email')}
                icon={MessageSquare}
                label="Email Dispatch"
                desc="SMTP Configuration"
              />
              <TabButton
                active={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
                icon={Shield}
                label="Security & Roles"
                desc="JWT Auth & Tokens"
              />
            </div>
          </div>

          {/* Right Content Panel */}
          <div style={{ flex: 1, padding: '32px 40px', minHeight: '540px' }}>
            {activeTab === 'clinic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <SectionHeader title="Clinic & Doctor Profile" desc="Details printed on generated ReportLab PDF prescriptions and patient receipts." />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <FormField label="Hospital / Clinic Name">
                    <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} style={inputStyle} />
                  </FormField>

                  <FormField label="Doctor Full Name">
                    <input type="text" value={doctorNameLetterhead} onChange={(e) => setDoctorNameLetterhead(e.target.value)} style={inputStyle} />
                  </FormField>

                  <FormField label="Medical Council Reg. Number">
                    <input type="text" value={doctorRegNo} onChange={(e) => setDoctorRegNo(e.target.value)} style={inputStyle} />
                  </FormField>

                  <FormField label="Doctor Specialization">
                    <input type="text" value={doctorSpecialization} onChange={(e) => setDoctorSpecialization(e.target.value)} style={inputStyle} />
                  </FormField>

                  <FormField label="Clinic Address">
                    <input type="text" value={hospitalAddress} onChange={(e) => setHospitalAddress(e.target.value)} style={inputStyle} />
                  </FormField>

                  <FormField label="Contact Helpline Number">
                    <input type="text" value={hospitalPhone} onChange={(e) => setHospitalPhone(e.target.value)} style={inputStyle} />
                  </FormField>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <SectionHeader title="AI Language Model & Speech Pipeline" desc="Configure primary structured parsing engine, speech-to-text model, and fallback chain." />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <FormField label="Primary Language Model (LLM)">
                    <select value={llmModel} onChange={(e) => setLlmModel(e.target.value)} style={inputStyle}>
                      <option value="gemini-2.0-flash">Google Gemini 2.0 Flash (Recommended)</option>
                      <option value="gemini-1.5-flash">Google Gemini 1.5 Flash</option>
                      <option value="gemma-4-26b-a4b-it">Gemma 4 26B Local / Cloud</option>
                    </select>
                  </FormField>

                  <FormField label="Automated Fallback Model">
                    <select value={fallbackModel} onChange={(e) => setFallbackModel(e.target.value)} style={inputStyle}>
                      <option value="gemma-4-26b-a4b-it">Gemma 4 26B (High Accuracy Fallback)</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    </select>
                  </FormField>

                  <FormField label="Speech-to-Text (STT) Whisper Model Size">
                    <select value={sttModel} onChange={(e) => setSttModel(e.target.value)} style={inputStyle}>
                      <option value="tiny">Whisper Tiny (Fastest Real-time STT)</option>
                      <option value="small">Whisper Small (Higher Accuracy)</option>
                      <option value="base">Whisper Base (Balanced)</option>
                    </select>
                  </FormField>

                  <ToggleRow
                    title="Automatic Medical Spelling Refinement"
                    desc="Use LLM post-processing to clean up Indian brand names (Pan 40, Dolo 650, Combiflam) in audio transcripts."
                    checked={autoRefine}
                    onChange={setAutoRefine}
                  />
                </div>
              </div>
            )}

            {activeTab === 'pdf' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <SectionHeader
                  title="Prescription Letterhead & PDF Customization"
                  desc="Completely edit hospital letterhead details, primary/secondary colors, alignment, and security encryption options."
                />

                {/* 1. Live PDF Letterhead Interactive Preview Banner */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                      <Sparkles size={16} color={primaryColor} />
                      Live Printable PDF Letterhead Preview
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={handleGenerateSamplePdf}
                        disabled={generatingPreview}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#12897F',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: generatingPreview ? 'not-allowed' : 'pointer',
                          boxShadow: '0 2px 6px rgba(18, 137, 127, 0.2)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <FileText size={12} />
                        {generatingPreview ? 'Generating...' : 'Preview Blank PDF'}
                        <ExternalLink size={11} color="rgba(255,255,255,0.8)" />
                      </button>
                      <span style={{ fontSize: '11px', background: '#E2E8F0', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontFamily: 'Space Mono, monospace' }}>
                        Aspect Ratio Scaled (ReportLab)
                      </span>
                    </div>
                  </div>

                  <div style={{
                    background: 'var(--color-bg-subtle, #FFFFFF)',
                    border: '1px solid var(--color-border, #CBD5E1)',
                    borderRadius: '8px',
                    padding: '24px 28px',
                    textAlign: headerLayout === 'left' ? 'left' : (headerLayout === 'right' ? 'right' : 'center'),
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                  }}>
                    {/* Hospital Logo Graphic Mock */}
                    <div style={{ display: 'flex', justifyContent: headerLayout === 'left' ? 'flex-start' : (headerLayout === 'right' ? 'flex-end' : 'center'), marginBottom: '8px' }}>
                      <div style={{ background: `${primaryColor}15`, border: `1px solid ${primaryColor}40`, padding: '6px 14px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: primaryColor }}>
                        <Building2 size={16} /> OFFICIAL HOSPITAL SEAL
                      </div>
                    </div>

                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 800, color: primaryColor, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {hospitalName || 'HOSPITAL NAME'}
                    </h2>
                    {hospitalSubtitle && (
                      <p style={{ fontSize: '12px', fontStyle: 'italic', color: secondaryColor, margin: '0 0 6px 0' }}>
                        {hospitalSubtitle}
                      </p>
                    )}
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-900, #1E293B)', margin: '0 0 4px 0' }}>
                      <strong>{doctorNameLetterhead || 'Doctor Name'}</strong> — {doctorQualification} | {doctorSpecialization}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--color-ink-500, #64748B)', margin: '0 0 4px 0' }}>
                      Reg No: <strong>{doctorRegNo}</strong> | {hospitalAddress}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--color-ink-500, #64748B)', margin: '0 0 8px 0' }}>
                      Phone: {hospitalPhone} | Email: {hospitalEmail}
                    </p>
                    {tagline && (
                      <p style={{ fontSize: '11px', fontWeight: 600, color: secondaryColor, margin: '6px 0 0 0' }}>
                        {tagline}
                      </p>
                    )}
                    <div style={{ height: '3px', background: primaryColor, marginTop: '12px', borderRadius: '2px' }} />
                  </div>
                </div>

                {/* 2. Color Palette & Layout Alignment */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <FormField label="Primary Accent Color (Title & Borders)">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        style={{ width: '40px', height: '38px', borderRadius: '8px', border: '1px solid var(--color-border, #CBD5E1)', cursor: 'pointer', background: 'transparent' }}
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        style={{ ...inputStyle, width: '110px', fontFamily: 'monospace' }}
                      />
                    </div>
                  </FormField>

                  <FormField label="Secondary Accent Color (Headings & Tagline)">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        style={{ width: '40px', height: '38px', borderRadius: '8px', border: '1px solid var(--color-border, #CBD5E1)', cursor: 'pointer', background: 'transparent' }}
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        style={{ ...inputStyle, width: '110px', fontFamily: 'monospace' }}
                      />
                    </div>
                  </FormField>

                  <FormField label="Header Layout Alignment">
                    <select
                      value={headerLayout}
                      onChange={(e) => setHeaderLayout(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="center">Centered Letterhead (Standard)</option>
                      <option value="left">Left Aligned Title & Seal</option>
                      <option value="right">Right Aligned Title & Seal</option>
                    </select>
                  </FormField>
                </div>

                {/* 3. Letterhead Detail Form Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormField label="Hospital Subtitle / Tagline">
                    <input
                      type="text"
                      value={hospitalSubtitle}
                      onChange={(e) => setHospitalSubtitle(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. Center for Advanced Medicine & Surgery"
                    />
                  </FormField>

                  <FormField label="Doctor Full Name">
                    <input
                      type="text"
                      value={doctorNameLetterhead}
                      onChange={(e) => setDoctorNameLetterhead(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. Dr. Arjun Sharma"
                    />
                  </FormField>

                  <FormField label="Doctor Qualifications">
                    <input
                      type="text"
                      value={doctorQualification}
                      onChange={(e) => setDoctorQualification(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. MBBS, MD (General Medicine)"
                    />
                  </FormField>

                  <FormField label="Specialization / Designation">
                    <input
                      type="text"
                      value={doctorSpecialization}
                      onChange={(e) => setDoctorSpecialization(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. Senior Consultant Physician"
                    />
                  </FormField>

                  <FormField label="Medical Registration Number">
                    <input
                      type="text"
                      value={doctorRegNo}
                      onChange={(e) => setDoctorRegNo(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. PMC/2026/123456"
                    />
                  </FormField>

                  <FormField label="Hospital Physical Address">
                    <input
                      type="text"
                      value={hospitalAddress}
                      onChange={(e) => setHospitalAddress(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. Civil Lines, Ludhiana, Punjab - 141001"
                    />
                  </FormField>

                  <FormField label="Hospital Phone Number">
                    <input
                      type="text"
                      value={hospitalPhone}
                      onChange={(e) => setHospitalPhone(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </FormField>

                  <FormField label="Hospital Official Email">
                    <input
                      type="text"
                      value={hospitalEmail}
                      onChange={(e) => setHospitalEmail(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. contact@medicarehospital.com"
                    />
                  </FormField>

                  <FormField label="Prescription Header Notice / Tagline">
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. Notice: Valid for 30 days from date of issue"
                    />
                  </FormField>
                </div>

                {/* 4. Security & Encryption Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#101A2E', margin: 0 }}>
                    PDF Security & Formatting Options
                  </h4>

                  <ToggleRow
                    title="Patient DOB Password Encryption"
                    desc="Encrypt generated prescription PDFs with patient's DOB (DDMMYYYY) password key for privacy compliance."
                    checked={encryptPdf}
                    onChange={setEncryptPdf}
                  />

                  <FormField label="Default Follow-up Duration">
                    <select value={defaultFollowup} onChange={(e) => setDefaultFollowup(e.target.value)} style={inputStyle}>
                      <option value="3 days">3 Days</option>
                      <option value="5 days">5 Days</option>
                      <option value="7 days">7 Days (Default)</option>
                      <option value="14 days">14 Days</option>
                    </select>
                  </FormField>

                  <ToggleRow
                    title="Watermark & Official Clinic Stamp"
                    desc="Embed official clinic seal and digital signature on PDF exports."
                    checked={showWatermark}
                    onChange={setShowWatermark}
                  />
                </div>
              </div>
            )}

            {activeTab === 'pharmacy' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <SectionHeader title="Pharmacy Dispatch" desc="Manage automated pharmacy notification rules." />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <ToggleRow
                    title="Default In-House Pharmacy Routing"
                    desc="Pre-select in-house hospital pharmacy counter purchase option."
                    checked={inHousePharmacyDefault}
                    onChange={setInHousePharmacyDefault}
                  />
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <SectionHeader title="Email Dispatch Engine" desc="Configure SMTP credentials for sending PDF prescriptions." />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <ToggleRow
                    title="Email Simulation Mode"
                    desc="If enabled, emails will be printed to the backend console instead of being sent over SMTP."
                    checked={emailSimulationMode}
                    onChange={setEmailSimulationMode}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <FormField label="SMTP Host">
                      <input type="text" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} style={inputStyle} />
                    </FormField>
                    <FormField label="SMTP Port">
                      <input type="text" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} style={inputStyle} />
                    </FormField>
                    <FormField label="SMTP Username (Email)">
                      <input type="text" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} style={inputStyle} />
                    </FormField>
                    <FormField label="SMTP Password (App Password)">
                      <input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} style={inputStyle} />
                    </FormField>
                    <FormField label="Sender Email Address">
                      <input type="text" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} style={inputStyle} />
                    </FormField>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <SectionHeader title="Security, Roles & Access Control" desc="Verify active JWT secret configuration, RBAC policies, and server health." />

                <div style={{ background: '#FAFBFC', border: '1px solid #E3E8EE', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <SecurityStatusRow label="JWT Secret Key" status="Active (HS256 Standard)" badgeColor="#12897F" />
                  <SecurityStatusRow label="Role-Based Protection (<RequireRole>)" status="Enforced on Doctor & Admin console" badgeColor="#12897F" />
                  <SecurityStatusRow label="Session Token Expiry" status="24 Hours (Auto-logout on 401)" badgeColor="#6D5DF6" />
                  <SecurityStatusRow label="MongoDB Atlas Database" status="Connected (Agent_Doctor)" badgeColor="#12897F" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper Subcomponents ───────────────────────────────────────────────────

function TabButton({ active, onClick, icon: Icon, label, desc }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '12px 14px',
        borderRadius: '10px',
        background: active ? 'var(--color-bg-surface, #FFFFFF)' : 'transparent',
        border: active ? '1px solid var(--color-border, #E3E8EE)' : '1px solid transparent',
        boxShadow: active ? 'var(--shadow-xs)' : 'none',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{ color: active ? '#12897F' : 'var(--color-ink-500, #5B6B82)' }}>
        <Icon size={18} />
      </div>
      <div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13px', color: active ? 'var(--color-ink-900, #101A2E)' : 'var(--color-ink-500, #5B6B82)' }}>
          {label}
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--color-ink-500, #94A3B8)', marginTop: '1px' }}>
          {desc}
        </div>
      </div>
    </button>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ borderBottom: '1px solid var(--color-border, #F1F5F9)', paddingBottom: '16px' }}>
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
        {title}
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)', marginTop: '4px', margin: 0 }}>
        {desc}
      </p>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--color-ink-500, #5B6B82)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid var(--color-border, #E2E8F0)',
  background: 'var(--color-bg-subtle, #FAFBFC)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  color: 'var(--color-ink-900, #101A2E)',
  outline: 'none',
};

function ToggleRow({ title, desc, checked, onChange }: { title: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--color-bg-subtle, #FAFBFC)', border: '1px solid var(--color-border, #E2E8F0)', borderRadius: '10px' }}>
      <div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--color-ink-900, #101A2E)' }}>
          {title}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-ink-500, #5B6B82)', marginTop: '2px' }}>
          {desc}
        </div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: '20px', height: '20px', accentColor: '#12897F', cursor: 'pointer' }}
      />
    </div>
  );
}

function SecurityStatusRow({ label, status, badgeColor }: { label: string; status: string; badgeColor: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-ink-900, #101A2E)' }}>{label}</span>
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: badgeColor, background: 'var(--color-primary-light, #E4F3F1)', padding: '4px 10px', borderRadius: '99px', fontWeight: 600 }}>
        {status}
      </span>
    </div>
  );
}
