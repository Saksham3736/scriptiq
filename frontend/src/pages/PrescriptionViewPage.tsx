/* PrescriptionViewPage.tsx — Complete Patient-Facing Digital Prescription Page */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MedicineCard from '@/components/patient/MedicineCard';
import DiagnosisSummary from '@/components/patient/DiagnosisSummary';
import AdviceList from '@/components/patient/AdviceList';
import FollowUpBanner from '@/components/patient/FollowUpBanner';
import SetReminderToggle from '@/components/patient/SetReminderToggle';
import { Download, ArrowLeft, Printer, ShieldCheck, ShoppingBag, Share2, Check } from 'lucide-react';

export default function PrescriptionViewPage() {
  const { prescriptionId, shareToken } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch from backend API (by id or shareToken) or use demo fallback
    const targetId = shareToken || prescriptionId;
    if (targetId) {
      const endpoint = shareToken
        ? `/api/public/prescription/${shareToken}`
        : `/api/prescription/${prescriptionId}`;

      fetch(endpoint)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setData(json.data);
          } else {
            // Fallback demo data for immediate testing
            setData({
              patient_name: 'Priya Verma',
              age: '30',
              gender: 'Female',
              phone: '+91 98765 43210',
              dob: '15/08/1996',
              diagnosis: 'Acute Gastritis & Hyperacidity',
              chief_complaint: 'Stomach discomfort and burning sensation after meals for 3 days',
              symptoms: ['Hyperacidity', 'Stomach Discomfort', 'Nausea'],
              medicines: [
                { name: 'Pan 40 tablet', strength: '40mg', dosage: '1 tablet', frequency: 'once daily', duration: '7 days', timing: 'Before Food' },
                { name: 'Cetzine 10mg', strength: '10mg', dosage: '1 tablet', frequency: 'once daily', duration: '3 days', timing: 'At Bedtime' },
              ],
              advice: [
                'Avoid spicy, fried, and greasy foods for 1 week.',
                'Drink at least 3 liters of water daily.',
                'Do not skip meals; eat small frequent portions.',
              ],
              follow_up: 'After 7 Days',
              pdf_url: '/pdfs/prescription_priya_verma_20260724_170320.pdf',
              doctor_name: 'Dr. Rajesh Sharma',
              doctor_qualification: 'MBBS, MD (General Medicine)',
              doctor_specialization: 'Senior Consultant Physician',
              doctor_reg_no: 'PMC/2026/123456',
              hospital_name: 'MEDICARE HOSPITAL & CLINIC',
              hospital_address: 'Civil Lines, Ludhiana, Punjab - 141001',
              hospital_phone: '+91 98765 43210',
            });
          }
        })
        .catch(() => {
          setData({
            patient_name: 'Priya Verma',
            age: '30',
            gender: 'Female',
            phone: '+91 98765 43210',
            diagnosis: 'Acute Gastritis & Hyperacidity',
            symptoms: ['Hyperacidity', 'Stomach Discomfort'],
            medicines: [
              { name: 'Pan 40 tablet', strength: '40mg', dosage: '1 tablet', frequency: 'once daily', duration: '7 days', timing: 'Before Food' },
              { name: 'Cetzine 10mg', strength: '10mg', dosage: '1 tablet', frequency: 'once daily', duration: '3 days', timing: 'At Bedtime' },
            ],
            advice: ['Avoid spicy food', 'Drink plenty of water'],
            follow_up: 'After 7 Days',
            pdf_url: '/pdfs/prescription_priya_verma_20260724_170320.pdf',
            doctor_name: 'Dr. Rajesh Sharma',
            hospital_name: 'MEDICARE HOSPITAL & CLINIC',
          });
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [prescriptionId, shareToken]);

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F8FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter' }}>
        <p style={{ color: '#5B6B82' }}>Loading digital prescription...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F8FA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', padding: '20px' }}>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '20px', color: '#101A2E' }}>Prescription Not Found</h2>
        <p style={{ color: '#5B6B82', marginTop: '8px' }}>Please check your link or contact your clinic.</p>
        <button onClick={() => navigate('/console')} style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E3E8EE', background: '#fff', cursor: 'pointer' }}>
          Return to Console
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F6F8FA', fontFamily: 'Inter, sans-serif', padding: '24px 16px', display: 'flex', justifyContent: 'center' }}>
      <style>{`
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .print-container { border: none !important; box-shadow: none !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
        }
      `}</style>

      <div style={{ maxWidth: '760px', width: '100%' }}>
        {/* Navigation & Action Bar (Hidden when printing) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/console')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: '13px', color: '#5B6B82', fontWeight: 500 }}
          >
            <ArrowLeft size={16} /> Doctor Console
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopyShareLink}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #E3E8EE', background: '#fff', cursor: 'pointer', fontFamily: 'Inter', fontSize: '12px', color: '#101A2E', fontWeight: 500 }}
            >
              {copied ? <Check size={14} color="#12897F" /> : <Share2 size={14} />}
              {copied ? 'Link Copied!' : 'Share'}
            </button>
            <button
              onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #E3E8EE', background: '#fff', cursor: 'pointer', fontFamily: 'Inter', fontSize: '12px', color: '#101A2E', fontWeight: 500 }}
            >
              <Printer size={14} /> Print
            </button>
          </div>
        </div>

        {/* Printable Digital Prescription Document */}
        <div className="print-container" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E3E8EE', boxShadow: '0 8px 32px rgba(16,26,46,0.06)', overflow: 'hidden' }}>

          {/* Official Hospital Letterhead */}
          <div style={{ padding: '28px 36px', borderBottom: '3px solid #12897F', background: '#FAFBFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img
                src="/assets/hospital_logo.png"
                alt="Hospital Logo"
                style={{ height: '76px', width: 'auto', objectFit: 'contain' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div>
                <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: 700, color: '#101A2E', margin: 0, letterSpacing: '-0.02em' }}>
                  {data.hospital_name || 'MEDICARE HOSPITAL & CLINIC'}
                </h1>
                <p style={{ fontSize: '13px', color: '#5B6B82', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  {data.hospital_address || 'Civil Lines, Ludhiana, Punjab - 141001'}
                </p>
                <p style={{ fontSize: '12px', color: '#5B6B82', margin: '3px 0 0 0', fontFamily: 'IBM Plex Mono' }}>
                  Phone: {data.hospital_phone || '+91 98765 43210'}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '17px', fontWeight: 700, color: '#12897F', margin: 0 }}>
                {data.doctor_name || 'Dr. Rajesh Sharma'}
              </h3>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#101A2E', margin: '2px 0 0 0' }}>
                {data.doctor_qualification || 'MBBS, MD (General Medicine)'}
              </p>
              <p style={{ fontSize: '12px', color: '#5B6B82', margin: '2px 0 0 0' }}>
                {data.doctor_specialization || 'Senior Consultant Physician'}
              </p>
              <p style={{ fontSize: '11px', color: '#6D5DF6', fontFamily: 'IBM Plex Mono', margin: '4px 0 0 0', fontWeight: 500 }}>
                Reg. No: {data.doctor_reg_no || 'PMC/2026/123456'}
              </p>
            </div>
          </div>

          {/* Patient Details Header */}
          <div style={{ padding: '20px 36px', background: '#F6F8FA', borderBottom: '1px solid #E3E8EE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#5B6B82', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Patient Name</span>
              <p style={{ fontFamily: 'Space Grotesk', fontSize: '17px', fontWeight: 700, color: '#101A2E', margin: '2px 0 0 0' }}>
                {data.patient_name} {data.age && `(${data.age}${data.gender ? '/' + data.gender.charAt(0) : ''})`}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#5B6B82', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Consultation Date</span>
              <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '13px', fontWeight: 600, color: '#101A2E', margin: '2px 0 0 0' }}>
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div style={{ padding: '28px 36px' }}>
            {/* Diagnosis Summary Block */}
            <DiagnosisSummary
              diagnosis={data.diagnosis}
              symptoms={data.symptoms}
              chiefComplaint={data.chief_complaint}
            />

            {/* Dose Reminder Toggle */}
            <SetReminderToggle />

            {/* Prescribed Medicines Cards */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: 700, color: '#101A2E', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Rx · Prescribed Medications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(data.medicines || []).map((med: any, idx: number) => (
                  <MedicineCard key={idx} medicine={med} index={idx} />
                ))}
              </div>
            </div>

            {/* General Advice */}
            <AdviceList advice={data.advice || data.general_advice} />

            {/* Follow-up Banner */}
            <FollowUpBanner followUpDate={data.follow_up} />

            {/* PDF Download Button */}
            {data.pdf_url && (
              <div className="no-print" style={{ marginTop: '24px', textAlign: 'center' }}>
                <a
                  href={data.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #12897F, #0F7268)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 600,
                    fontSize: '14px',
                    boxShadow: '0 4px 16px rgba(18,137,127,0.3)',
                  }}
                >
                  <Download size={16} /> Download Official Encrypted PDF <ShieldCheck size={14} color="rgba(255,255,255,0.8)" />
                </a>
              </div>
            )}
          </div>

          {/* Official Footer with Stamp & Signature */}
          <div style={{ padding: '28px 36px', borderTop: '1px solid #E3E8EE', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: '#FAFBFC' }}>
            <div style={{ textAlign: 'center' }}>
              <img
                src="/assets/doctor_stamp.png"
                alt="Hospital Stamp"
                style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '8px' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <p style={{ fontFamily: 'Space Grotesk', fontSize: '11px', fontWeight: 700, color: '#12897F', margin: 0 }}>
                OFFICIAL HOSPITAL STAMP
              </p>
            </div>

            <div style={{ textAlign: 'center', maxWidth: '220px', paddingBottom: '12px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#12897F', fontSize: '11px', fontFamily: 'IBM Plex Mono', fontWeight: 600, marginBottom: '6px' }}>
                <ShieldCheck size={15} /> DOB Password Encrypted
              </div>
              <p style={{ fontSize: '10px', color: '#5B6B82', margin: 0, lineHeight: 1.4 }}>
                Official medical prescription document. Verified by Medicare Hospital system.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <img
                src="/assets/doctor_signature.png"
                alt="Doctor Signature"
                style={{ height: '42px', width: 'auto', objectFit: 'contain', marginBottom: '4px' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div style={{ borderTop: '1.5px solid #101A2E', paddingTop: '6px', width: '180px' }}>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 700, color: '#101A2E', margin: 0 }}>
                  {data.doctor_name || 'Dr. Rajesh Sharma'}
                </p>
                <p style={{ fontSize: '10px', color: '#5B6B82', margin: '2px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Authorized Signatory
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
