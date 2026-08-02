/* OfficialReceiptsPage.tsx — Phase 67: Official Receipts History & Official Patient Receipt Editor */

import { useState, useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import { useUIStore } from '@/store/uiStore';
import {
  FileText,
  Search,
  Printer,
  Trash2,
  Eye,
  Palette,
  Building2,
  Save,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface ReceiptItem {
  name: string;
  dosage?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ReceiptDoc {
  _id?: string;
  order_id: string;
  patient_name: string;
  phone: string;
  doctor_name?: string;
  payment_method: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function OfficialReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptDoc[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'history' | 'receipt_editor'>('history');
  const [loading, setLoading] = useState(true);

  // Official Receipt Customization State
  const [hospitalName, setHospitalName] = useState('MEDICARE HOSPITAL & CLINIC');
  const [hospitalSubtitle, setHospitalSubtitle] = useState('Center for Advanced Medicine & Multispecialty Care');
  const [doctorName, setDoctorName] = useState('Dr. Arjun Sharma');
  const [doctorQualification, setDoctorQualification] = useState('MBBS, MD (General Medicine)');
  const [doctorSpecialization, setDoctorSpecialization] = useState('Senior Consultant Physician');
  const [doctorRegNo, setDoctorRegNo] = useState('PMC/2026/123456');
  const [hospitalAddress, setHospitalAddress] = useState('Civil Lines, Ludhiana, Punjab - 141001');
  const [hospitalPhone, setHospitalPhone] = useState('+91 98765 43210');
  const [hospitalEmail, setHospitalEmail] = useState('dr.arjunsharma@medicarehospital.com');
  
  // Specific Official Receipt Custom Fields
  const [receiptTitle, setReceiptTitle] = useState('OFFICIAL IN-HOUSE PHARMACY RECEIPT');
  const [receiptPickupLocation, setReceiptPickupLocation] = useState('Hospital Pharmacy Counter #1');
  const [receiptDisclaimer, setReceiptDisclaimer] = useState('Computer generated pharmacy receipt. Valid for medicine collection at Counter #1.');
  const [receiptPrimaryColor, setReceiptPrimaryColor] = useState('#12897F');
  const [receiptSignatoryLabel, setReceiptSignatoryLabel] = useState('Authorized Signatory');
  const [tagline, setTagline] = useState('Notice: Valid for 30 days from date of issue.');

  const [saving, setSaving] = useState(false);

  const addToast = useUIStore((s) => s.addToast);

  useEffect(() => {
    fetchReceipts();
    fetchReceiptConfig();
  }, []);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pharmacy/receipts');
      const json = await res.json();
      if (json.success && json.data?.receipts) {
        setReceipts(json.data.receipts);
      }
    } catch (err) {
      console.error('Failed to load receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceiptConfig = async () => {
    try {
      const res = await fetch('/api/settings/letterhead');
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.hospital_name) setHospitalName(d.hospital_name);
        if (d.hospital_subtitle) setHospitalSubtitle(d.hospital_subtitle);
        if (d.doctor_name) setDoctorName(d.doctor_name);
        if (d.doctor_qualification) setDoctorQualification(d.doctor_qualification);
        if (d.doctor_specialization) setDoctorSpecialization(d.doctor_specialization);
        if (d.doctor_reg_no) setDoctorRegNo(d.doctor_reg_no);
        if (d.hospital_address) setHospitalAddress(d.hospital_address);
        if (d.hospital_phone) setHospitalPhone(d.hospital_phone);
        if (d.hospital_email) setHospitalEmail(d.hospital_email);
        if (d.tagline) setTagline(d.tagline);
        if (d.receipt_title) setReceiptTitle(d.receipt_title);
        if (d.receipt_pickup_location) setReceiptPickupLocation(d.receipt_pickup_location);
        if (d.receipt_disclaimer) setReceiptDisclaimer(d.receipt_disclaimer);
        if (d.receipt_primary_color) setReceiptPrimaryColor(d.receipt_primary_color);
        if (d.receipt_signatory_label) setReceiptSignatoryLabel(d.receipt_signatory_label);
      }
    } catch (err) {
      console.warn('[OfficialReceiptsPage] Error loading receipt config:', err);
    }
  };

  const handleSaveReceiptConfig = async () => {
    setSaving(true);
    try {
      const payload = {
        hospital_name: hospitalName,
        hospital_subtitle: hospitalSubtitle,
        doctor_name: doctorName,
        doctor_qualification: doctorQualification,
        doctor_specialization: doctorSpecialization,
        doctor_reg_no: doctorRegNo,
        hospital_address: hospitalAddress,
        hospital_phone: hospitalPhone,
        hospital_email: hospitalEmail,
        tagline,
        receipt_title: receiptTitle,
        receipt_pickup_location: receiptPickupLocation,
        receipt_disclaimer: receiptDisclaimer,
        receipt_primary_color: receiptPrimaryColor,
        receipt_signatory_label: receiptSignatoryLabel,
      };
      const res = await fetch('/api/settings/letterhead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        addToast({ type: 'success', title: 'Official Receipt Saved 🎉', message: 'Official receipt template & letterhead branding updated successfully.' });
      } else {
        addToast({ type: 'error', title: 'Save Failed', message: json.message || 'Could not save receipt configuration.' });
      }
    } catch (err) {
      console.error('Failed to save receipt configuration:', err);
      addToast({ type: 'error', title: 'Save Error', message: 'Network error while saving configuration.' });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenSampleReceipt = () => {
    window.open('/receipt/SAMPLE-RECEIPT-PREVIEW', '_blank');
  };

  const handleDeleteReceipt = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to delete receipt #${orderId}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/pharmacy/receipts/${orderId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setReceipts(receipts.filter((r) => r.order_id !== orderId));
        addToast({ type: 'success', title: 'Receipt Deleted', message: `Order #${orderId} has been permanently removed.` });
      } else {
        addToast({ type: 'error', title: 'Delete Failed', message: json.message || 'Could not delete receipt.' });
      }
    } catch (err) {
      console.error('Failed to delete receipt:', err);
      addToast({ type: 'error', title: 'Delete Error', message: 'Network error while deleting receipt.' });
    }
  };

  const filteredReceipts = receipts.filter(
    (r) =>
      r.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--color-bg-app, #F6F8FA)' }}>
      <TopBar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header & Tab Selector */}
          <div
            style={{
              padding: '20px 32px 16px',
              background: 'var(--color-bg-surface, #fff)',
              borderBottom: '1px solid var(--color-border, #E3E8EE)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                  Official Receipts Workspace
                </h1>
                <span style={{ padding: '3px 8px', borderRadius: '99px', background: 'var(--color-primary-light, #E4F3F1)', color: '#12897F', fontSize: '11px', fontFamily: 'IBM Plex Mono', fontWeight: 600 }}>
                  Phase 67 Active
                </span>
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)', marginTop: '4px', margin: 0 }}>
                View generated patient pharmacy receipts history and customize the official patient receipt template.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px', background: 'var(--color-bg-subtle, #F1F5F9)', padding: '4px', borderRadius: '10px', border: '1px solid var(--color-border, #E2E8F0)' }}>
              <button
                onClick={() => setActiveTab('history')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px',
                  background: activeTab === 'history' ? '#12897F' : 'transparent',
                  color: activeTab === 'history' ? '#FFF' : 'var(--color-ink-900, #334155)',
                  border: 'none', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <FileText size={14} /> Receipt History ({receipts.length})
              </button>

              <button
                onClick={() => setActiveTab('receipt_editor')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px',
                  background: activeTab === 'receipt_editor' ? '#12897F' : 'transparent',
                  color: activeTab === 'receipt_editor' ? '#FFF' : 'var(--color-ink-900, #334155)',
                  border: 'none', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <Palette size={14} /> Official Receipt Editor
              </button>
            </div>
          </div>

          {/* TAB 1: RECEIPT HISTORY */}
          {activeTab === 'history' && (
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                    <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Search order ID, patient name, phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '36px' }}
                    />
                  </div>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                    {filteredReceipts.length} receipt{filteredReceipts.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#64748B' }}>Loading receipts...</p>
                  </div>
                ) : filteredReceipts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 24px', background: '#FFF', borderRadius: '12px', border: '1px solid var(--color-border, #E2E8F0)' }}>
                    <FileText size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
                    <p style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '15px', color: '#64748B', margin: 0 }}>
                      No receipts found
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                      {searchQuery ? 'Try a different search query.' : 'Official receipts will appear here once generated from POS Billing.'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredReceipts.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          background: '#FFF',
                          borderRadius: '12px',
                          border: '1px solid var(--color-border, #E2E8F0)',
                          padding: '18px 22px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'box-shadow 0.15s, border-color 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(18,137,127,0.08)';
                          e.currentTarget.style.borderColor = 'rgba(18,137,127,0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.borderColor = 'var(--color-border, #E2E8F0)';
                        }}
                      >
                        {/* Left: Receipt Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '13px', color: '#12897F' }}>
                              {r.order_id}
                            </span>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(18,137,127,0.1)', color: '#12897F', fontSize: '11px', fontWeight: 600 }}>
                              {r.status || 'Paid'}
                            </span>
                            <span style={{ fontFamily: 'Inter', fontSize: '11px', color: '#94A3B8' }}>
                              {r.items?.length || 0} item{(r.items?.length || 0) !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <p style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '15px', margin: '0 0 2px', color: '#101A2E' }}>
                            {r.patient_name}
                          </p>
                          <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#64748B', margin: 0 }}>
                            {r.phone} {r.doctor_name ? `· Dr. ${r.doctor_name}` : ''} · {r.payment_method}
                          </p>
                        </div>

                        {/* Center: Amount & Date */}
                        <div style={{ textAlign: 'right', marginRight: '20px' }}>
                          <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '16px', color: '#101A2E', margin: 0 }}>
                            ₹{r.total_amount.toFixed(2)}
                          </p>
                          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#64748B', margin: '2px 0 0' }}>
                            {new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        {/* Right: Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <button
                            onClick={() => window.open(`/receipt/${r.order_id}`, '_blank')}
                            title="View Official Patient Receipt"
                            style={{
                              display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px',
                              background: 'linear-gradient(135deg, #12897F 0%, #0E6A62 100%)', color: '#FFF', border: 'none',
                              fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '11px', cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(18, 137, 127, 0.25)', transition: 'all 0.15s ease',
                            }}
                          >
                            <Eye size={12} /> View Receipt
                          </button>

                          <button
                            onClick={() => window.open(`/receipt/${r.order_id}?autoprint=true`, '_blank')}
                            title="Print Official Receipt"
                            style={{
                              padding: '7px 10px', borderRadius: '8px',
                              background: 'var(--color-bg-subtle, #F1F5F9)', color: 'var(--color-ink-900, #334155)',
                              border: '1px solid var(--color-border, #E2E8F0)', cursor: 'pointer', transition: 'all 0.15s',
                            }}
                          >
                            <Printer size={13} />
                          </button>

                          <button
                            onClick={() => handleDeleteReceipt(r.order_id)}
                            title="Delete Receipt"
                            style={{
                              padding: '7px 10px', borderRadius: '8px',
                              background: 'rgba(225, 85, 84, 0.08)', color: '#E15554',
                              border: '1px solid rgba(225, 85, 84, 0.2)', cursor: 'pointer', transition: 'all 0.15s',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: OFFICIAL PATIENT RECEIPT EDITOR */}
          {activeTab === 'receipt_editor' && (
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Live Interactive Official Patient Receipt Preview Banner */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#101A2E', fontFamily: 'Space Grotesk' }}>
                      <Sparkles size={16} color={receiptPrimaryColor} />
                      Live Patient Pharmacy Receipt Preview
                    </div>
                    <button
                      onClick={handleOpenSampleReceipt}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px',
                        background: '#12897F', color: '#FFF', border: 'none', fontSize: '11px', fontWeight: 600,
                        cursor: 'pointer', boxShadow: '0 2px 6px rgba(18,137,127,0.25)', transition: 'all 0.15s',
                        fontFamily: 'Space Grotesk',
                      }}
                    >
                      <Printer size={12} />
                      Open Full Page Preview
                      <ExternalLink size={11} color="rgba(255,255,255,0.8)" />
                    </button>
                  </div>

                  {/* Live Interactive Receipt Card Mock (Matching ReceiptViewPage.tsx layout) */}
                  <div style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #E3E8EE', boxShadow: '0 4px 20px rgba(16,26,46,0.06)', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ padding: '20px 28px', borderBottom: `3px solid ${receiptPrimaryColor}`, background: '#FAFBFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 700, color: '#101A2E', margin: 0 }}>
                          {hospitalName || 'HOSPITAL NAME'}
                        </h1>
                        <p style={{ fontSize: '12px', color: '#5B6B82', margin: '3px 0 0' }}>
                          {hospitalAddress}
                        </p>
                        <p style={{ fontSize: '11px', color: '#5B6B82', margin: '2px 0 0', fontFamily: 'IBM Plex Mono' }}>
                          Phone: {hospitalPhone} | Email: {hospitalEmail}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: 700, color: receiptPrimaryColor, margin: 0 }}>
                          {doctorName || 'Doctor Name'}
                        </h3>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#101A2E', margin: '2px 0 0' }}>
                          {doctorQualification}
                        </p>
                        <p style={{ fontSize: '11px', color: '#5B6B82', margin: '1px 0 0' }}>
                          {doctorSpecialization}
                        </p>
                        <p style={{ fontSize: '10px', color: '#6D5DF6', fontFamily: 'IBM Plex Mono', margin: '2px 0 0' }}>
                          Reg. No: {doctorRegNo}
                        </p>
                      </div>
                    </div>

                    {/* Receipt Title Banner */}
                    <div style={{ background: '#101A2E', padding: '10px 28px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShoppingBag size={14} color={receiptPrimaryColor} /> {receiptTitle || 'OFFICIAL IN-HOUSE PHARMACY RECEIPT'}
                      </span>
                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '11px', color: receiptPrimaryColor, background: 'rgba(18,137,127,0.2)', padding: '3px 10px', borderRadius: '4px', fontWeight: 600 }}>
                        #ORD-2026-9812
                      </span>
                    </div>

                    {/* Patient & Fulfillment Block */}
                    <div style={{ padding: '16px 28px', borderBottom: '1px solid #E3E8EE', background: '#FFF', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: '#5B6B82', textTransform: 'uppercase', fontWeight: 600 }}>Patient Name</span>
                        <p style={{ fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: 700, color: '#101A2E', margin: '2px 0 0' }}>
                          Priya Verma
                        </p>
                        <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '11px', color: '#5B6B82', margin: '1px 0 0' }}>
                          Phone: +91 98765 43211
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '10px', color: '#5B6B82', textTransform: 'uppercase', fontWeight: 600 }}>Fulfillment Details</span>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: receiptPrimaryColor, margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                          <MapPin size={13} color={receiptPrimaryColor} /> {receiptPickupLocation || 'Hospital Pharmacy Counter #1'}
                        </p>
                        <p style={{ fontSize: '11px', color: '#5B6B82', margin: '1px 0 0', fontFamily: 'IBM Plex Mono' }}>
                          Date: 03 August 2026
                        </p>
                      </div>
                    </div>

                    {/* Sample Table */}
                    <div style={{ padding: '16px 28px', borderBottom: '1px solid #E3E8EE' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'Inter' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #CBD5E1', color: '#64748B', textAlign: 'left', fontSize: '11px' }}>
                            <th style={{ padding: '6px 0' }}>Medicine</th>
                            <th style={{ padding: '6px 0' }}>Dosage</th>
                            <th style={{ padding: '6px 0', textAlign: 'center' }}>Qty</th>
                            <th style={{ padding: '6px 0', textAlign: 'right' }}>Total (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '8px 0', fontWeight: 600, color: '#101A2E' }}>Pan 40 tablet</td>
                            <td style={{ padding: '8px 0', color: '#64748B' }}>Pantoprazole 40mg (1-0-0)</td>
                            <td style={{ padding: '8px 0', textAlign: 'center' }}>10</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontWeight: 600 }}>₹120.00</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '8px 0', fontWeight: 600, color: '#101A2E' }}>Cetzine 10mg</td>
                            <td style={{ padding: '8px 0', color: '#64748B' }}>Cetirizine 10mg (0-0-1)</td>
                            <td style={{ padding: '8px 0', textAlign: 'center' }}>10</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontWeight: 600 }}>₹45.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Stamp & Signature Footer */}
                    <div style={{ padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFBFC' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: 'Space Grotesk', fontSize: '10px', fontWeight: 700, color: receiptPrimaryColor, margin: 0, letterSpacing: '0.05em' }}>
                          OFFICIAL HOSPITAL STAMP
                        </p>
                      </div>
                      <div style={{ textAlign: 'center', maxWidth: '240px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: receiptPrimaryColor, fontSize: '10px', fontFamily: 'IBM Plex Mono', fontWeight: 600, marginBottom: '2px' }}>
                          <ShieldCheck size={13} /> System Verified
                        </div>
                        <p style={{ fontSize: '9px', color: '#5B6B82', margin: 0, lineHeight: 1.3 }}>
                          {receiptDisclaimer || 'Computer generated pharmacy receipt.'}
                        </p>
                      </div>
                      <div style={{ textAlign: 'center', borderTop: '1px solid #101A2E', paddingTop: '4px', width: '140px' }}>
                        <p style={{ fontFamily: 'Space Grotesk', fontSize: '11px', fontWeight: 700, color: '#101A2E', margin: 0 }}>
                          {doctorName || 'Doctor Name'}
                        </p>
                        <p style={{ fontSize: '9px', color: '#5B6B82', margin: 0, textTransform: 'uppercase' }}>
                          {receiptSignatoryLabel || 'Authorized Signatory'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Section 1: Official Receipt Specific Controls */}
                <div style={{ background: '#FFF', borderRadius: '14px', border: '1px solid var(--color-border, #E2E8F0)', padding: '24px' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', color: '#101A2E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingBag size={16} color="#12897F" /> Official Receipt Customization
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <FieldBlock label="Receipt Banner Title">
                      <input type="text" value={receiptTitle} onChange={(e) => setReceiptTitle(e.target.value)} style={inputStyle} placeholder="e.g. OFFICIAL IN-HOUSE PHARMACY RECEIPT" />
                    </FieldBlock>

                    <FieldBlock label="Receipt Accent Color">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="color" value={receiptPrimaryColor} onChange={(e) => setReceiptPrimaryColor(e.target.value)} style={{ width: '40px', height: '38px', borderRadius: '8px', border: '1px solid #CBD5E1', cursor: 'pointer', background: 'transparent' }} />
                        <input type="text" value={receiptPrimaryColor} onChange={(e) => setReceiptPrimaryColor(e.target.value)} style={{ ...inputStyle, width: '130px', fontFamily: 'monospace' }} />
                      </div>
                    </FieldBlock>

                    <FieldBlock label="Default Pickup Location">
                      <input type="text" value={receiptPickupLocation} onChange={(e) => setReceiptPickupLocation(e.target.value)} style={inputStyle} placeholder="e.g. Hospital Pharmacy Counter #1" />
                    </FieldBlock>

                    <FieldBlock label="Signature Footer Subtitle">
                      <input type="text" value={receiptSignatoryLabel} onChange={(e) => setReceiptSignatoryLabel(e.target.value)} style={inputStyle} placeholder="e.g. Authorized Signatory" />
                    </FieldBlock>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <FieldBlock label="Security Notice & Footer Disclaimer">
                        <textarea
                          rows={2}
                          value={receiptDisclaimer}
                          onChange={(e) => setReceiptDisclaimer(e.target.value)}
                          style={{ ...inputStyle, resize: 'vertical' }}
                          placeholder="e.g. Computer generated pharmacy receipt. Valid for medicine collection at Counter #1."
                        />
                      </FieldBlock>
                    </div>
                  </div>
                </div>

                {/* Form Section 2: Hospital & Doctor Branding */}
                <div style={{ background: '#FFF', borderRadius: '14px', border: '1px solid var(--color-border, #E2E8F0)', padding: '24px' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', color: '#101A2E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={16} color="#12897F" /> Hospital Branding & Doctor Signatory
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <FieldBlock label="Hospital Name">
                      <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} style={inputStyle} />
                    </FieldBlock>
                    <FieldBlock label="Hospital Subtitle">
                      <input type="text" value={hospitalSubtitle} onChange={(e) => setHospitalSubtitle(e.target.value)} style={inputStyle} />
                    </FieldBlock>
                    <FieldBlock label="Doctor Name">
                      <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} style={inputStyle} />
                    </FieldBlock>
                    <FieldBlock label="Qualification">
                      <input type="text" value={doctorQualification} onChange={(e) => setDoctorQualification(e.target.value)} style={inputStyle} />
                    </FieldBlock>
                    <FieldBlock label="Specialization">
                      <input type="text" value={doctorSpecialization} onChange={(e) => setDoctorSpecialization(e.target.value)} style={inputStyle} />
                    </FieldBlock>
                    <FieldBlock label="Registration No.">
                      <input type="text" value={doctorRegNo} onChange={(e) => setDoctorRegNo(e.target.value)} style={inputStyle} />
                    </FieldBlock>
                    <FieldBlock label="Hospital Address">
                      <input type="text" value={hospitalAddress} onChange={(e) => setHospitalAddress(e.target.value)} style={inputStyle} />
                    </FieldBlock>
                    <FieldBlock label="Hospital Phone">
                      <input type="text" value={hospitalPhone} onChange={(e) => setHospitalPhone(e.target.value)} style={inputStyle} />
                    </FieldBlock>
                    <FieldBlock label="Hospital Email">
                      <input type="text" value={hospitalEmail} onChange={(e) => setHospitalEmail(e.target.value)} style={inputStyle} />
                    </FieldBlock>
                    <FieldBlock label="Tagline / Notice">
                      <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} style={inputStyle} />
                    </FieldBlock>
                  </div>
                </div>

                {/* Save Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    onClick={handleSaveReceiptConfig}
                    disabled={saving}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #12897F 0%, #0E6A62 100%)', color: '#FFF', border: 'none',
                      fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(18,137,127,0.3)', opacity: saving ? 0.7 : 1, transition: 'all 0.15s',
                    }}
                  >
                    <Save size={15} />
                    {saving ? 'Saving...' : 'Save Official Receipt Configuration'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Helper Components */
function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #64748B)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1.5px solid var(--color-border, #E3E8EE)',
  background: 'var(--color-bg-subtle, #FAFBFC)',
  color: 'var(--color-ink-900, #101A2E)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box' as const,
};
