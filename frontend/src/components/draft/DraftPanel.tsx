/* DraftPanel.tsx — Modularized editable prescription draft (right pane) */

import { useState } from 'react';
import { useDraftStore, type Medicine } from '@/store/draftStore';
import { useRecordingStore } from '@/store/recordingStore';
import { useSavePrescription } from '@/hooks/useSavePrescription';
import FieldChip from './FieldChip';
import MedicineRow from './MedicineRow';
import DraftActionsBar from './DraftActionsBar';
import ConfidenceBadge from './ConfidenceBadge';
import DrugInteractionBanner from './DrugInteractionBanner';
import SendPrescriptionModal from '../delivery/SendPrescriptionModal';
import AILoadingStatusBadge from '../ui/AILoadingStatusBadge';
import AIDraftExtractionBanner from './AIDraftExtractionBanner';
import PatientIntakeSpace from './PatientIntakeSpace';
import { useUIStore } from '@/store/uiStore';
import { calculateAgeFromDOB } from '@/utils/validators';

import {
  Plus, Pill, FlaskConical, Heart, Calendar, FileText, Trash2, X, Check, ShoppingBag, ExternalLink,
} from 'lucide-react';
import { BoneDraftPanel } from '../ui/Boneyard';

export default function DraftPanel() {
  const { draft, isDirty, updateField, clearDraft } = useDraftStore();
  const status = useRecordingStore((s) => s.status);
  const resetRecording = useRecordingStore((s) => s.resetRecording);

  const { saving, saved, approvePrescription } = useSavePrescription();

  // State for SendPrescriptionModal & inline symptom input & order ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dispatchedOrderId, setDispatchedOrderId] = useState<string>('');
  const [newSymptomText, setNewSymptomText] = useState('');
  const [isAddingSymptom, setIsAddingSymptom] = useState(false);

  const isExtracting = status === 'processing';
  const hasData = !!draft;

  const handleRemoveMedicine = (idx: number) => {
    if (!draft) return;
    const arr = [...(draft.medicines || [])];
    arr.splice(idx, 1);
    updateField('medicines', arr);
  };

  const handleUpdateMedicine = (idx: number, updated: Medicine) => {
    if (!draft) return;
    const arr = [...(draft.medicines || [])];
    arr[idx] = updated;
    updateField('medicines', arr);
  };

  const handleAddMedicine = () => {
    if (!draft) return;
    const arr = [...(draft.medicines || []), { name: '', dosage: '', frequency: '', duration: '' }];
    updateField('medicines', arr);
  };

  const handleAddSymptomSubmit = () => {
    if (!draft || !newSymptomText.trim()) return;
    const current = draft.symptoms || [];
    updateField('symptoms', [...current, newSymptomText.trim()]);
    setNewSymptomText('');
    setIsAddingSymptom(false);
  };

  const handleRemoveSymptom = (idx: number) => {
    if (!draft) return;
    const arr = [...(draft.symptoms || [])];
    arr.splice(idx, 1);
    updateField('symptoms', arr);
  };

  const handleRegenerate = () => {
    clearDraft();
    resetRecording();
  };

  if (isExtracting) {
    return (
      <div style={{ background: 'var(--color-bg-surface, #FFFFFF)', height: '100%' }}>
        <BoneDraftPanel />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--color-bg-surface, #FFFFFF)', color: 'var(--color-ink-900)', gap: '16px', padding: '40px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-primary-light, #E4F3F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={28} color="var(--color-primary, #12897F)" />
        </div>
        <div>
          <p style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: '16px', color: 'var(--color-ink-900, #101A2E)', marginBottom: '6px' }}>Prescription draft will appear here</p>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: 'var(--color-ink-500, #5B6B82)' }}>Start recording or type the consultation, then click Extract.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-surface, #FFFFFF)', color: 'var(--color-ink-900)' }}>

      {/* Dispatch Modal */}
      <SendPrescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        draft={draft}
        onSuccess={(_, orderId) => {
          if (orderId) setDispatchedOrderId(orderId);
        }}
      />

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border, #E3E8EE)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={15} color="#12897F" />
          <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--color-ink-900, #101A2E)' }}>Prescription Draft</span>
          {isDirty && <span style={{ padding: '2px 7px', borderRadius: '99px', background: '#FCF1DE', fontFamily: 'IBM Plex Mono,monospace', fontSize: '10px', color: '#E8A33D', fontWeight: 500 }}>MODIFIED</span>}
          {saved && <span style={{ padding: '2px 7px', borderRadius: '99px', background: '#E4F3F1', fontFamily: 'IBM Plex Mono,monospace', fontSize: '10px', color: '#12897F', fontWeight: 500 }}>SAVED & SENT</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AILoadingStatusBadge isProcessing={isExtracting} />
          <ConfidenceBadge score={92} />
        </div>
      </div>

      {/* Scrollable fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Live AI Extraction Processing Shimmer Bar & Telemetry Status Banner */}
        <AIDraftExtractionBanner />

        {/* Doctor Console Voice & Typed Patient Intake Space */}
        <PatientIntakeSpace />

        {/* Dispatched Pharmacy Receipt Banner */}
        {saved && (
          <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#E4F3F1', border: '1.5px solid #12897F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={18} color="#12897F" />
              <div>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 700, color: '#12897F', margin: 0 }}>
                  Pharmacy Receipt Ready ({dispatchedOrderId})
                </p>
                <p style={{ fontSize: '11px', color: '#5B6B82', margin: '2px 0 0 0' }}>
                  Dispatched to Medical Desk Counter #1
                </p>
              </div>
            </div>
            <a
              href={`/receipt/${dispatchedOrderId}`}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: '#12897F',
                color: '#fff',
                textDecoration: 'none',
                fontFamily: 'Space Grotesk',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Open Receipt <ExternalLink size={12} />
            </a>
          </div>
        )}

        {/* Drug interaction safety banner */}
        <DrugInteractionBanner medicines={draft.medicines || []} />

        {/* Patient info row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <FieldChip
            label="Patient Name"
            value={draft.patient_name || ''}
            onChange={(v) => updateField('patient_name', v)}
            placeholder="Full name"
          />
          <FieldChip
            label="Phone"
            value={draft.phone || ''}
            onChange={(v) => updateField('phone', v)}
            placeholder="+91 98765 43210"
          />
          <FieldChip
            label="Date of Birth (DOB)"
            value={draft.dob || (draft as any).patient_dob || ''}
            onChange={(v) => {
              updateField('dob', v);
              const autoAge = calculateAgeFromDOB(v);
              if (autoAge !== null) {
                updateField('age', autoAge);
              }
            }}
            placeholder="DDMMYYYY (e.g. 15081989)"
          />
          <FieldChip
            label="Age (Years)"
            value={draft.age !== undefined && draft.age !== null ? String(draft.age) : ''}
            onChange={(v) => updateField('age', v ? parseInt(v, 10) || undefined : undefined)}
            placeholder="Auto-calculated from DOB"
          />
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-500, #5B6B82)', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>
              Gender
            </label>
            <select
              value={draft.gender || 'Male'}
              onChange={(e) => updateField('gender', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1.5px solid var(--color-border, #E3E8EE)',
                background: 'var(--color-bg-subtle, #FAFBFC)',
                color: 'var(--color-ink-900, #101A2E)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                outline: 'none',
                height: '38px',
              }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <FieldChip
              label="Patient Email"
              value={draft.email || ''}
              onChange={(v) => updateField('email', v)}
              placeholder="patient@example.com"
            />
          </div>
        </div>

        {/* Diagnosis */}
        <FieldChip
          label="Diagnosis"
          icon={<Heart size={11} style={{ marginRight: 2 }} />}
          value={draft.diagnosis || ''}
          onChange={(v) => updateField('diagnosis', v)}
          placeholder="Primary diagnosis"
        />

        {/* Symptoms */}
        <div className="animate-field" style={{ animationDelay: '0.14s' }}>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', fontWeight: 600, color: '#5B6B82', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
            Symptoms
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            {(draft.symptoms || []).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '99px', background: '#EFECFE', border: '1px solid #C5BCF8' }}>
                <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#6D5DF6', fontWeight: 500 }}>{s}</span>
                <button onClick={() => handleRemoveSymptom(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6D5DF6', display: 'flex', padding: 0 }} title="Remove symptom">
                  <X size={12} />
                </button>
              </div>
            ))}

            {isAddingSymptom ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="text"
                  autoFocus
                  value={newSymptomText}
                  onChange={(e) => setNewSymptomText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddSymptomSubmit();
                    if (e.key === 'Escape') setIsAddingSymptom(false);
                  }}
                  placeholder="Type symptom..."
                  style={{
                    padding: '4px 10px',
                    borderRadius: '99px',
                    border: '1.5px solid #6D5DF6',
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    outline: 'none',
                    width: '140px',
                  }}
                />
                <button
                  onClick={handleAddSymptomSubmit}
                  style={{ padding: '4px 8px', borderRadius: '99px', background: '#6D5DF6', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Add"
                >
                  <Check size={12} />
                </button>
                <button
                  onClick={() => setIsAddingSymptom(false)}
                  style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#5B6B82', display: 'flex' }}
                  title="Cancel"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingSymptom(true)}
                style={{ padding: '4px 12px', borderRadius: '99px', border: '1.5px dashed #6D5DF6', background: '#EFECFE22', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#6D5DF6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Add Symptom
              </button>
            )}
          </div>
        </div>

        {/* Prescribed Medicines */}
        <div className="animate-field" style={{ animationDelay: '0.18s' }}>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', fontWeight: 600, color: '#5B6B82', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Pill size={11} />Prescribed Medicines
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(draft.medicines || []).map((med: Medicine, i: number) => (
              <MedicineRow
                key={i}
                index={i}
                med={med}
                onRemove={handleRemoveMedicine}
                onUpdate={handleUpdateMedicine}
              />
            ))}
            <button
              onClick={handleAddMedicine}
              style={{ padding: '9px', borderRadius: '8px', border: '1.5px dashed #E3E8EE', background: 'transparent', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#5B6B82', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
            >
              <Plus size={12} />Add Medicine
            </button>
          </div>
        </div>

        {/* Tests */}
        {(draft.tests || []).length > 0 && (
          <div className="animate-field" style={{ animationDelay: '0.22s' }}>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', fontWeight: 600, color: '#5B6B82', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FlaskConical size={11} />Tests
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(draft.tests || []).map((t, i) => (
                <span key={i} style={{ padding: '4px 10px', borderRadius: '99px', background: '#FCF1DE', fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#E8A33D', border: '1px solid #E8A33D44' }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up */}
        {draft.follow_up && (
          <FieldChip
            label="Follow-up"
            icon={<Calendar size={11} style={{ marginRight: 2 }} />}
            value={draft.follow_up || ''}
            onChange={(v) => updateField('follow_up', v)}
            placeholder="e.g. After 5 days"
          />
        )}

        {/* Advice */}
        {(draft.advice || []).length > 0 && (
          <div className="animate-field" style={{ animationDelay: '0.3s' }}>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', fontWeight: 600, color: '#5B6B82', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Advice
            </p>
            <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
              {(draft.advice || []).map((a, i) => (
                <li key={i} style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: '#101A2E', lineHeight: 1.5 }}>{a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action bar */}
      <DraftActionsBar
        onRegenerate={handleRegenerate}
        onApprove={() => setIsModalOpen(true)}
        saving={saving}
        saved={saved}
      />
    </div>
  );
}
