/* ReceiptViewPage.tsx — Official Patient Pharmacy Receipt (matching ReportLab PDF letterhead) */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReceiptTable from '@/components/pharmacy/ReceiptTable';
import { ArrowLeft, Printer, ShieldCheck, ShoppingBag, MapPin } from 'lucide-react';

export default function ReceiptViewPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      setTimeout(() => {
        setOrder({
          order_id: orderId,
          patient_name: 'Priya Verma',
          phone: '+91 98765 43211',
          total_amount_inr: 100.0,
          pickup_location: 'Hospital Pharmacy Counter #1',
          order_date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          status: 'Priority Dispense Ready',
          doctor_name: 'Dr. Rajesh Sharma',
          doctor_qualification: 'MBBS, MD (General Medicine)',
          doctor_specialization: 'Senior Consultant Physician',
          doctor_reg_no: 'PMC/2026/123456',
          hospital_name: 'MEDICARE HOSPITAL & CLINIC',
          hospital_address: 'Civil Lines, Ludhiana, Punjab - 141001',
          hospital_phone: '+91 98765 43210',
          items: [
            { medicine: 'Pan 40 tablet', generic_name: 'Pantoprazole 40mg', quantity: 1, unit_price_inr: 50.0, total_price_inr: 50.0 },
            { medicine: 'Cetzine 10mg', generic_name: 'Cetirizine 10mg', quantity: 1, unit_price_inr: 50.0, total_price_inr: 50.0 },
          ],
        });
        setLoading(false);
      }, 300);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F8FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter' }}>
        <p style={{ color: '#5B6B82' }}>Loading official pharmacy receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F8FA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', padding: '20px' }}>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '20px', color: '#101A2E' }}>Receipt Not Found</h2>
        <p style={{ color: '#5B6B82', marginTop: '8px' }}>Please verify your order ID link.</p>
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
        {/* Navigation Bar (Hidden when printing) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/console')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontSize: '13px', color: '#5B6B82', fontWeight: 500 }}
          >
            <ArrowLeft size={16} /> Back to Console
          </button>
          <button
            onClick={() => window.print()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #12897F, #0F7268)', color: '#fff', cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 600, boxShadow: '0 4px 14px rgba(18,137,127,0.3)' }}
          >
            <Printer size={15} /> Print Official Receipt
          </button>
        </div>

        {/* Official Printable Receipt Container */}
        <div className="print-container" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E3E8EE', boxShadow: '0 8px 32px rgba(16,26,46,0.06)', overflow: 'hidden' }}>

          {/* Official Letterhead Header */}
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
                  {order.hospital_name}
                </h1>
                <p style={{ fontSize: '13px', color: '#5B6B82', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  {order.hospital_address}
                </p>
                <p style={{ fontSize: '12px', color: '#5B6B82', margin: '3px 0 0 0', fontFamily: 'IBM Plex Mono' }}>
                  Phone: {order.hospital_phone}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '17px', fontWeight: 700, color: '#12897F', margin: 0 }}>
                {order.doctor_name}
              </h3>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#101A2E', margin: '2px 0 0 0' }}>
                {order.doctor_qualification}
              </p>
              <p style={{ fontSize: '12px', color: '#5B6B82', margin: '2px 0 0 0' }}>
                {order.doctor_specialization}
              </p>
              <p style={{ fontSize: '11px', color: '#6D5DF6', fontFamily: 'IBM Plex Mono', margin: '4px 0 0 0', fontWeight: 500 }}>
                Reg. No: {order.doctor_reg_no}
              </p>
            </div>
          </div>

          {/* Receipt Title Banner */}
          <div style={{ background: '#101A2E', padding: '14px 36px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={16} color="#12897F" /> OFFICIAL IN-HOUSE PHARMACY RECEIPT
            </span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '13px', color: '#12897F', background: 'rgba(18,137,127,0.2)', padding: '4px 12px', borderRadius: '4px', fontWeight: 600 }}>
              {order.order_id}
            </span>
          </div>

          {/* Patient & Order Details Block */}
          <div style={{ padding: '24px 36px', borderBottom: '1px solid #E3E8EE', background: '#fff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#5B6B82', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Patient Name</span>
              <p style={{ fontFamily: 'Space Grotesk', fontSize: '17px', fontWeight: 700, color: '#101A2E', margin: '2px 0 0 0' }}>
                {order.patient_name}
              </p>
              <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: '#5B6B82', margin: '2px 0 0 0' }}>
                Phone: {order.phone}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#5B6B82', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Fulfillment Details</span>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#12897F', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                <MapPin size={14} color="#12897F" /> {order.pickup_location}
              </p>
              <p style={{ fontSize: '12px', color: '#5B6B82', margin: '2px 0 0 0', fontFamily: 'IBM Plex Mono' }}>
                Date: {order.order_date}
              </p>
            </div>
          </div>

          {/* Itemized Pharmacy Bill Table */}
          <div style={{ padding: '24px 36px' }}>
            <ReceiptTable items={order.items} totalAmountInr={order.total_amount_inr} />
          </div>

          {/* Official Hospital Stamp & Doctor Signature Footer */}
          <div style={{ padding: '28px 36px 36px 36px', borderTop: '1px solid #E3E8EE', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: '#FAFBFC' }}>
            {/* Left: Official Stamp */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src="/assets/doctor_stamp.png"
                alt="Hospital Stamp"
                style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '8px' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <p style={{ fontFamily: 'Space Grotesk', fontSize: '11px', fontWeight: 700, color: '#12897F', margin: 0, letterSpacing: '0.05em' }}>
                OFFICIAL HOSPITAL STAMP
              </p>
            </div>

            {/* Middle: Security Notice */}
            <div style={{ textAlign: 'center', maxWidth: '220px', paddingBottom: '12px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#12897F', fontSize: '11px', fontFamily: 'IBM Plex Mono', fontWeight: 600, marginBottom: '6px' }}>
                <ShieldCheck size={15} /> System Verified
              </div>
              <p style={{ fontSize: '10px', color: '#5B6B82', margin: 0, lineHeight: 1.4 }}>
                Computer generated pharmacy receipt. Valid for medicine collection at Counter #1.
              </p>
            </div>

            {/* Right: Doctor Signature */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src="/assets/doctor_signature.png"
                alt="Doctor Signature"
                style={{ height: '42px', width: 'auto', objectFit: 'contain', marginBottom: '4px' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div style={{ borderTop: '1.5px solid #101A2E', paddingTop: '6px', width: '180px' }}>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 700, color: '#101A2E', margin: 0 }}>
                  {order.doctor_name}
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
