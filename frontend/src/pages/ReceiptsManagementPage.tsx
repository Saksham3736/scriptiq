/* ReceiptsManagementPage.tsx — ScriptIQ In-House Pharmacy Receipt & POS Velocity Management Suite */

import { useState, useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import { useUIStore } from '@/store/uiStore';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Printer,
  QrCode,
  Search,
  AlertTriangle,
  FileText,
  Zap,
  X,
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

interface InventoryItem {
  name: string;
  stock: number;
  price: number;
  category: string;
  low_stock_warning: boolean;
}

export default function ReceiptsManagementPage() {
  const [receipts, setReceipts] = useState<ReceiptDoc[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'history' | 'inventory'>('history');

  // POS Form State
  const [patientName, setPatientName] = useState('Amit Patel');
  const [phone, setPhone] = useState('919876543210');
  const [doctorName] = useState('Dr. Arjun Sharma');
  const [paymentMethod, setPaymentMethod] = useState<'UPI QR' | 'Cash' | 'Card'>('UPI QR');
  const [items, setItems] = useState<ReceiptItem[]>([
    { name: 'Amoxicillin 500mg', dosage: '1-0-1', quantity: 10, unit_price: 12.5, total_price: 125.0 },
    { name: 'Paracetamol 650mg', dosage: '1-1-1', quantity: 15, unit_price: 3.0, total_price: 45.0 },
  ]);
  const [discount] = useState<number>(0);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [savingReceipt, setSavingReceipt] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);

  const addToast = useUIStore((s) => s.addToast);

  const handleLoadRecentPrescription = async () => {
    setLoadingRecent(true);
    try {
      const res = await fetch('/api/consultations/recent');
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.patient_name) setPatientName(d.patient_name);
        if (d.phone) setPhone(d.phone);
        if (d.items && Array.isArray(d.items) && d.items.length > 0) {
          setItems(d.items);
        }
        addToast({
          title: 'Prescription Loaded',
          message: `Loaded prescribed medicines for ${d.patient_name || 'patient'} directly into POS bill!`,
          type: 'success',
        });
        setActiveTab('create');
      } else {
        addToast({
          title: 'No Recent Prescription',
          message: 'No recent doctor prescription found to load.',
          type: 'warning',
        });
      }
    } catch (err) {
      console.error('Failed to load recent prescription:', err);
      addToast({
        title: 'Load Error',
        message: 'Could not fetch recent prescription data.',
        type: 'error',
      });
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recRes, invRes] = await Promise.all([
        fetch('/api/pharmacy/receipts'),
        fetch('/api/pharmacy/inventory'),
      ]);
      const recJson = await recRes.json();
      const invJson = await invRes.json();

      if (recJson.success && recJson.data?.receipts) {
        setReceipts(recJson.data.receipts);
      }
      if (invJson.success && invJson.data?.inventory) {
        setInventory(invJson.data.inventory);
      }
    } catch (err) {
      console.error('Failed to load pharmacy data:', err);
    }
  };

  const subtotal = items.reduce((acc, curr) => acc + curr.total_price, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const grandTotal = Math.max(0, Math.round((subtotal + tax - discount) * 100) / 100);

  const handleAddItem = (inventoryItem?: InventoryItem) => {
    if (inventoryItem) {
      const existing = items.find((i) => i.name.toLowerCase() === inventoryItem.name.toLowerCase());
      if (existing) {
        setItems(
          items.map((i) =>
            i.name.toLowerCase() === inventoryItem.name.toLowerCase()
              ? { ...i, quantity: i.quantity + 1, total_price: (i.quantity + 1) * i.unit_price }
              : i
          )
        );
      } else {
        setItems([
          ...items,
          {
            name: inventoryItem.name,
            dosage: '1-0-1',
            quantity: 1,
            unit_price: inventoryItem.price,
            total_price: inventoryItem.price,
          },
        ]);
      }
    } else {
      setItems([
        ...items,
        { name: 'New Medicine Item', dosage: '1-0-1', quantity: 1, unit_price: 50, total_price: 50 },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, key: keyof ReceiptItem, val: any) => {
    setItems(
      items.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [key]: val };
        if (key === 'quantity' || key === 'unit_price') {
          const qty = key === 'quantity' ? Number(val) : item.quantity;
          const price = key === 'unit_price' ? Number(val) : item.unit_price;
          updated.total_price = qty * price;
        }
        return updated;
      })
    );
  };

  const handleSaveReceipt = async () => {
    if (!patientName.trim()) {
      addToast({ type: 'warning', title: 'Missing Patient Name', message: 'Please enter patient name.' });
      return;
    }
    if (items.length === 0) {
      addToast({ type: 'warning', title: 'Empty Cart', message: 'Add at least one item to generate a receipt.' });
      return;
    }

    setSavingReceipt(true);
    try {
      const payload = {
        patient_name: patientName,
        phone: phone,
        doctor_name: doctorName,
        payment_method: paymentMethod,
        items: items,
        subtotal: subtotal,
        tax: tax,
        discount: discount,
        total_amount: grandTotal,
      };

      const res = await fetch('/api/pharmacy/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        addToast({
          type: 'success',
          title: 'Pharmacy Receipt Issued 🎉',
          message: `Generated order #${json.data.order_id} for ₹${grandTotal}.`,
        });

        setReceipts([json.data, ...receipts]);
        setActiveTab('history');

        // Trigger push dispatch
        try {
          await fetch(`/api/pharmacy/receipts/${json.data.order_id}/dispatch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(json.data),
          });
        } catch (e) {
          console.warn('Receipt dispatch warning:', e);
        }
      }
    } catch (err) {
      console.error('Failed to create receipt:', err);
      addToast({ type: 'error', title: 'Receipt Failed', message: 'Could not generate receipt.' });
    } finally {
      setSavingReceipt(false);
      setShowUpiModal(false);
    }
  };

  const handleIssueAndPrintOfficialReceipt = async () => {
    if (items.length === 0) {
      addToast({ type: 'warning', title: 'Empty Cart', message: 'Add at least one item to generate a receipt.' });
      return;
    }

    setSavingReceipt(true);
    try {
      const payload = {
        patient_name: patientName || 'Walk-in Patient',
        phone: phone,
        doctor_name: doctorName,
        payment_method: paymentMethod,
        items: items,
        subtotal: subtotal,
        tax: tax,
        discount: discount,
        total_amount: grandTotal,
      };

      const res = await fetch('/api/pharmacy/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        addToast({
          type: 'success',
          title: 'Official Receipt Issued 🎉',
          message: `Opening official letterhead receipt #${json.data.order_id}...`,
        });

        setReceipts([json.data, ...receipts]);

        // Launch official letterhead receipt page in a new tab with autoprint flag
        window.open(`/receipt/${json.data.order_id}?autoprint=true`, '_blank');
      }
    } catch (err) {
      console.error('Failed to create official receipt:', err);
      addToast({ type: 'error', title: 'Receipt Failed', message: 'Could not generate official receipt.' });
    } finally {
      setSavingReceipt(false);
    }
  };

  // Phase 66C: Re-load a receipt's data into POS Builder for editing
  const handleReloadReceiptIntoPOS = (receipt: ReceiptDoc) => {
    setPatientName(receipt.patient_name || 'Walk-in Patient');
    setPhone(receipt.phone || '');
    if (receipt.items && receipt.items.length > 0) {
      setItems(receipt.items.map((it) => ({
        name: it.name,
        dosage: it.dosage || '',
        quantity: it.quantity,
        unit_price: it.unit_price,
        total_price: it.total_price,
      })));
    }
    if (receipt.payment_method) {
      const pm = receipt.payment_method as 'UPI QR' | 'Cash' | 'Card';
      if (['UPI QR', 'Cash', 'Card'].includes(pm)) {
        setPaymentMethod(pm);
      }
    }
    setActiveTab('create');
    addToast({
      type: 'success',
      title: '⚡ Receipt Re-Loaded into POS',
      message: `Order #${receipt.order_id} hydrated into POS Builder — modify items and re-save.`,
    });
  };

  // Phase 66C: Delete a receipt via DELETE /api/pharmacy/receipts/:order_id
  const handleDeleteReceipt = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to delete receipt #${orderId}? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/pharmacy/receipts/${orderId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setReceipts(receipts.filter((r) => r.order_id !== orderId));
        addToast({
          type: 'success',
          title: 'Receipt Deleted',
          message: `Order #${orderId} has been permanently removed.`,
        });
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
        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header & Sub-Tabs */}
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
                  In-House Pharmacy & POS Suite
                </h1>
                <span style={{ padding: '3px 8px', borderRadius: '99px', background: 'var(--color-primary-light, #E4F3F1)', color: '#12897F', fontSize: '11px', fontFamily: 'IBM Plex Mono', fontWeight: 600 }}>
                  Phase 34 Active
                </span>
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)', marginTop: '4px', margin: 0 }}>
                Instant patient billing, thermal receipt printing, low-stock alerts, and Web Push digital dispatch.
              </p>
            </div>

            {/* Navigation Mode Selector & Quick Load Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleLoadRecentPrescription}
                disabled={loadingRecent}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #12897F 0%, #0E6A62 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(18, 137, 127, 0.3)',
                  transition: 'all 0.15s ease',
                  opacity: loadingRecent ? 0.7 : 1,
                }}
              >
                <Zap size={14} color="#FFF" />
                {loadingRecent ? 'Loading...' : '⚡ Load Recent Prescription'}
              </button>

              <div style={{ display: 'flex', gap: '6px', background: 'var(--color-bg-subtle, #F1F5F9)', padding: '4px', borderRadius: '10px', border: '1px solid var(--color-border, #E2E8F0)' }}>
                <button
                  onClick={() => setActiveTab('history')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: activeTab === 'history' ? '#12897F' : 'transparent',
                    color: activeTab === 'history' ? '#FFF' : 'var(--color-ink-900, #334155)',
                    border: 'none',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <FileText size={14} /> Patient Receipts Portal ({receipts.length})
                </button>

                <button
                  onClick={() => setActiveTab('create')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: activeTab === 'create' ? '#12897F' : 'transparent',
                    color: activeTab === 'create' ? '#FFF' : 'var(--color-ink-900, #334155)',
                    border: 'none',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <ShoppingBag size={14} /> POS Bill Builder
                </button>

              <button
                onClick={() => setActiveTab('inventory')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: activeTab === 'inventory' ? '#12897F' : 'transparent',
                  color: activeTab === 'inventory' ? '#FFF' : 'var(--color-ink-900, #334155)',
                  border: 'none',
                  fontFamily: 'Space Grotesk',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <ShoppingBag size={14} /> Stock Inventory
              </button>
            </div>
          </div>
        </div>

          {/* TAB 1: POS BILLING & RECEIPT CREATOR */}
          {activeTab === 'create' && (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '24px', gap: '24px' }}>
              {/* Left Pane: Item Selection & Patient Form */}
              <div style={{ flex: 1.2, background: 'var(--color-bg-surface, #fff)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '16px', color: 'var(--color-ink-900, #101A2E)', marginBottom: '16px' }}>
                  Patient & Billing Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #64748B)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Patient Name
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. Amit Patel"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #64748B)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Phone / Web Push ID
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. 919876543210"
                    />
                  </div>
                </div>

                {/* Quick Add Inventory Pills */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #64748B)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    ⚡ POS Quick-Add Inventory Items
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {inventory.map((inv, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAddItem(inv)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: inv.low_stock_warning ? 'rgba(217, 119, 6, 0.1)' : 'var(--color-bg-subtle, #F8FAFC)',
                          border: inv.low_stock_warning ? '1px solid #D97706' : '1px solid var(--color-border, #E2E8F0)',
                          color: 'var(--color-ink-900, #1E293B)',
                          fontFamily: 'Inter',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Plus size={12} color="#12897F" />
                        <span>{inv.name}</span>
                        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '10px', color: '#12897F', fontWeight: 700 }}>
                          ₹{inv.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bill Line Items Table */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', color: 'var(--color-ink-900)' }}>
                      Prescription Line Items ({items.length})
                    </span>
                    <button
                      onClick={() => handleAddItem()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'var(--color-primary-light, #E4F3F1)',
                        color: '#12897F',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={12} /> Custom Row
                    </button>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--color-border, #E3E8EE)', borderRadius: '10px', background: 'var(--color-bg-subtle, #FAFBFC)' }}>
                    {items.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr 1fr 40px',
                          gap: '8px',
                          alignItems: 'center',
                          padding: '10px 12px',
                          borderBottom: '1px solid var(--color-border, #E2E8F0)',
                        }}
                      >
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                          style={{ ...inputStyle, padding: '6px 8px', fontSize: '12px' }}
                        />
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                          style={{ ...inputStyle, padding: '6px 8px', fontSize: '12px' }}
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={item.unit_price}
                          onChange={(e) => handleUpdateItem(index, 'unit_price', e.target.value)}
                          style={{ ...inputStyle, padding: '6px 8px', fontSize: '12px' }}
                        />
                        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '13px', fontWeight: 700, color: '#12897F', textAlign: 'right' }}>
                          ₹{item.total_price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E15554', textAlign: 'center' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Pane: Live Thermal Receipt Preview & Checkout */}
              <div style={{ flex: 1, background: 'var(--color-bg-surface, #fff)', borderRadius: '16px', border: '1px solid var(--color-border, #E3E8EE)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '16px', color: 'var(--color-ink-900, #101A2E)', margin: 0 }}>
                      Live Thermal Receipt Preview
                    </h3>
                    <span style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono', color: 'var(--color-ink-500)' }}>
                      80mm Thermal Printer Standard
                    </span>
                  </div>

                  {/* Print Styles for 80mm Thermal Printer Isolation */}
                  <style>{`
                    @media print {
                      body * {
                        visibility: hidden !important;
                      }
                      #thermal-receipt, #thermal-receipt * {
                        visibility: visible !important;
                      }
                      #thermal-receipt {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 80mm !important;
                        margin: 0 !important;
                        padding: 16px !important;
                        background: #ffffff !important;
                        color: #000000 !important;
                        border: none !important;
                        box-shadow: none !important;
                        font-family: 'IBM Plex Mono', monospace !important;
                      }
                      @page {
                        size: 80mm auto;
                        margin: 0mm;
                      }
                    }
                  `}</style>

                  {/* Thermal Receipt Card */}
                  <div
                    id="thermal-receipt"
                    style={{
                      background: '#FFF',
                      border: '1.5px dashed var(--color-border, #CBD5E1)',
                      borderRadius: '12px',
                      padding: '20px',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ textAlign: 'center', borderBottom: '1px dashed #CBD5E1', paddingBottom: '12px', marginBottom: '12px' }}>
                      <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '16px', margin: 0, color: '#101A2E' }}>
                        ScriptIQ Pharmacy Desk
                      </h2>
                      <p style={{ fontSize: '10px', color: '#64748B', margin: '2px 0 0' }}>Apollo Medical Hub · Reg #RX-99214</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px', color: '#334155' }}>
                      <span>Patient: <strong>{patientName || 'Walk-in Patient'}</strong></span>
                      <span>Phone: {phone || 'N/A'}</span>
                    </div>

                    {/* Table */}
                    <div style={{ borderBottom: '1px dashed #CBD5E1', paddingBottom: '10px', marginBottom: '10px' }}>
                      {items.map((it, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: '11px' }}>
                          <span>{it.quantity}x {it.name}</span>
                          <span>₹{it.total_price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div style={{ fontSize: '11px', color: '#334155' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                        <span>GST (5%):</span>
                        <span>₹{tax.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0 0', fontWeight: 700, fontSize: '14px', color: '#12897F' }}>
                        <span>Grand Total:</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout & Payment CTAs */}
                <div style={{ borderTop: '1px solid var(--color-border, #E3E8EE)', paddingTop: '16px', marginTop: '16px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Payment Method
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {(['UPI QR', 'Cash', 'Card'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setPaymentMethod(m)}
                          style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: paymentMethod === m ? '1.5px solid #12897F' : '1px solid var(--color-border, #E2E8F0)',
                            background: paymentMethod === m ? 'var(--color-primary-light, #E4F3F1)' : 'transparent',
                            color: paymentMethod === m ? '#12897F' : 'var(--color-ink-900)',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setShowUpiModal(true)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        background: '#12897F',
                        color: '#FFF',
                        fontFamily: 'Space Grotesk',
                        fontWeight: 700,
                        fontSize: '13px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(18,137,127,0.25)',
                      }}
                    >
                      <QrCode size={16} /> Collect ₹{grandTotal.toFixed(2)} & Issue
                    </button>

                    <button
                      onClick={handleIssueAndPrintOfficialReceipt}
                      disabled={savingReceipt}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'var(--color-bg-subtle, #F1F5F9)',
                        color: 'var(--color-ink-900)',
                        border: '1px solid var(--color-border, #CBD5E1)',
                        cursor: 'pointer',
                        opacity: savingReceipt ? 0.7 : 1,
                      }}
                      title="Generate & Print Official Letterhead Receipt (/receipt/:orderId)"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ISSUED RECEIPTS HISTORY — Phase 66B+66C Enhanced */}
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

                {filteredReceipts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 24px', background: '#FFF', borderRadius: '12px', border: '1px solid var(--color-border, #E2E8F0)' }}>
                    <FileText size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
                    <p style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '15px', color: '#64748B', margin: 0 }}>
                      No receipts found
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                      {searchQuery ? 'Try a different search query.' : 'Create your first receipt in the POS Bill Builder tab.'}
                    </p>
                  </div>
                ) : (
                  <div style={{ background: '#FFF', borderRadius: '12px', border: '1px solid var(--color-border, #E2E8F0)', overflow: 'hidden' }}>
                    {filteredReceipts.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px 20px',
                          borderBottom: i < filteredReceipts.length - 1 ? '1px solid var(--color-border, #E2E8F0)' : 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#FAFBFC')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Left: Receipt Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                          <p style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '14px', margin: '4px 0 0', color: '#101A2E' }}>
                            {r.patient_name} <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', color: '#64748B' }}>({r.phone})</span>
                          </p>
                          {r.doctor_name && (
                            <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#94A3B8', margin: '2px 0 0' }}>
                              Dr. {r.doctor_name}
                            </p>
                          )}
                        </div>

                        {/* Center: Amount & Date */}
                        <div style={{ textAlign: 'right', marginRight: '16px' }}>
                          <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '15px', color: '#101A2E', margin: 0 }}>
                            ₹{r.total_amount.toFixed(2)}
                          </p>
                          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#64748B', margin: '2px 0 0' }}>
                            {r.payment_method} · {new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        {/* Right: Action Buttons — Phase 66C */}
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          {/* Edit / Re-Load into POS Builder */}
                          <button
                            onClick={() => handleReloadReceiptIntoPOS(r)}
                            title="Edit / Re-Load into POS Builder"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #12897F 0%, #0E6A62 100%)',
                              color: '#FFF',
                              border: 'none',
                              fontFamily: 'Space Grotesk',
                              fontWeight: 600,
                              fontSize: '11px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(18, 137, 127, 0.25)',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Zap size={12} /> Edit / Re-Load
                          </button>

                          {/* View Official Receipt */}
                          <button
                            onClick={() => window.open(`/receipt/${r.order_id}`, '_blank')}
                            title="View Official Receipt"
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              background: 'var(--color-bg-subtle, #F1F5F9)',
                              color: 'var(--color-ink-900, #334155)',
                              border: '1px solid var(--color-border, #E2E8F0)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Printer size={13} />
                          </button>

                          {/* Delete Receipt */}
                          <button
                            onClick={() => handleDeleteReceipt(r.order_id)}
                            title="Delete Receipt"
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              background: 'rgba(225, 85, 84, 0.08)',
                              color: '#E15554',
                              border: '1px solid rgba(225, 85, 84, 0.2)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
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

          {/* TAB 3: STOCK INVENTORY ALERT PANEL */}
          {activeTab === 'inventory' && (
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>
                  Hospital Pharmacy Stock Inventory ({inventory.length})
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {inventory.map((inv, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: '#FFF',
                        border: inv.low_stock_warning ? '1.5px solid #D97706' : '1px solid var(--color-border, #E2E8F0)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', color: '#101A2E' }}>
                          {inv.name}
                        </span>
                        {inv.low_stock_warning && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', fontSize: '10px', fontWeight: 700 }}>
                            <AlertTriangle size={10} /> Low Stock
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: '12px', color: '#64748B' }}>
                        <span>Stock Units: <strong>{inv.stock}</strong></span>
                        <span>Unit Price: <strong>₹{inv.price}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic UPI QR Code Collection Modal */}
      {showUpiModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFF', width: '380px', borderRadius: '16px', padding: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '16px', margin: 0 }}>
                Dynamic UPI Payment QR
              </h3>
              <button onClick={() => setShowUpiModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'var(--color-bg-subtle, #F8FAFC)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border, #E2E8F0)', marginBottom: '16px' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=scriptiq@apollo&pn=ScriptIQ%20Pharmacy&am=${grandTotal}&cu=INR`}
                alt="UPI QR Code"
                style={{ width: '160px', height: '160px', borderRadius: '8px', margin: '0 auto' }}
              />
              <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '16px', color: '#12897F', margin: '12px 0 0' }}>
                ₹{grandTotal.toFixed(2)}
              </p>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0' }}>
                Scan with PhonePe, Google Pay, or Paytm
              </p>
            </div>

            <button
              onClick={handleSaveReceipt}
              disabled={savingReceipt}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#12897F',
                color: '#FFF',
                fontFamily: 'Space Grotesk',
                fontWeight: 700,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {savingReceipt ? 'Confirming Payment...' : 'Mark Paid & Dispatch Receipt'}
            </button>
          </div>
        </div>
      )}
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
  boxSizing: 'border-box',
};
