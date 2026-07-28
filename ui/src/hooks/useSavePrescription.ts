import { useState } from 'react';
import { useDraftStore } from '@/store/draftStore';
import { useUIStore } from '@/store/uiStore';

export function useSavePrescription() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draft = useDraftStore((s) => s.draft);
  const setPdfUrl = useDraftStore((s) => s.setPdfUrl);
  const setSavedId = useDraftStore((s) => s.setSavedId);
  const setDeliveryStatus = useDraftStore((s) => s.setDeliveryStatus);

  const addToast = useUIStore((s) => s.addToast);
  const setPrescriptionStatus = useUIStore((s) => s.setPrescriptionStatus);

  const approvePrescription = async (): Promise<boolean> => {
    if (!draft) return false;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/prescription/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescription_data: draft,
          phone: draft.phone,
          patient_dob: draft.dob,
          patient_age: draft.age,
          patient_gender: draft.gender,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        if (json.data?.pdf_url) setPdfUrl(json.data.pdf_url);
        if (json.data?.db_id) setSavedId(json.data.db_id);
        setDeliveryStatus('sent');
        setPrescriptionStatus('Saved');

        addToast({
          type: 'success',
          title: 'Prescription Approved & Saved',
          message: `Saved to MongoDB Atlas and PDF generated for ${draft.patient_name || 'Patient'}.`,
        });
        return true;
      } else {
        throw new Error(json.error || 'Save failed');
      }
    } catch (err: any) {
      console.error('[useSavePrescription Error]', err);
      const errMsg = err.message || 'Could not save prescription';
      setError(errMsg);
      addToast({
        type: 'error',
        title: 'Prescription Save Failed',
        message: errMsg,
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    saved,
    error,
    approvePrescription,
  };
}
