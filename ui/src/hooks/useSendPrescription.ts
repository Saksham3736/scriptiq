/* useSendPrescription.ts — Custom hook for multi-channel prescription delivery */

import { useState } from 'react';
import { useDraftStore } from '@/store/draftStore';

export interface DeliveryResult {
  pdf_url?: string;
  pdf_path?: string;
  db_id?: string;
  pharmacy_result?: any;
}

export function useSendPrescription() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DeliveryResult | null>(null);

  const draft = useDraftStore((s) => s.draft);
  const setPdfUrl = useDraftStore((s) => s.setPdfUrl);
  const setSavedId = useDraftStore((s) => s.setSavedId);
  const setDeliveryStatus = useDraftStore((s) => s.setDeliveryStatus);

  const sendPrescription = async (
    phoneOverride?: string,
    channels: string[] = [],
    wantInHousePharmacy: boolean = true
  ): Promise<DeliveryResult | null> => {
    if (!draft) return null;
    setSending(true);
    setError(null);

    const targetPhone = phoneOverride || draft.phone || '919876543210';

    try {
      // 1. Approve prescription (generates PDF, saves DB)
      const approveRes = await fetch('/api/prescription/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescription_data: draft,
          phone: targetPhone,
          patient_dob: draft.dob || (draft as any).patient_dob || '01012000',
        }),
      });

      const approveText = await approveRes.text();
      let approveJson: any;
      try {
        approveJson = JSON.parse(approveText);
      } catch (err) {
        throw new Error(`Server returned error (${approveRes.status}): ${approveText.slice(0, 100)}`);
      }

      if (!approveRes.ok || !approveJson.success) {
        throw new Error(approveJson.detail || approveJson.error || 'Failed to approve prescription.');
      }

      let pharmacyJson: any = null;

      // 2. Trigger pharmacy receipt & dual dispatch if in-house buy selected
      if (wantInHousePharmacy) {
        const pharmRes = await fetch('/api/pharmacy/receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prescription_data: draft,
            want_in_house_buy: true,
            phone: targetPhone,
          }),
        });

        const pharmText = await pharmRes.text();
        try {
          pharmacyJson = JSON.parse(pharmText);
        } catch (_) {}
      }

      const resPayload: DeliveryResult = {
        ...approveJson.data,
        pharmacy_result: pharmacyJson?.data || null,
      };

      setResult(resPayload);
      setSent(true);

      if (resPayload.pdf_url) setPdfUrl(resPayload.pdf_url);
      if (resPayload.db_id) setSavedId(resPayload.db_id);
      setDeliveryStatus('sent');

      return resPayload;
    } catch (err: any) {
      console.error('[useSendPrescription Error]', err);
      setError(err.message || 'Delivery failed');
      return null;
    } finally {
      setSending(false);
    }
  };

  return {
    sending,
    sent,
    error,
    result,
    sendPrescription,
  };
}
