/* useSendPrescription.ts — Custom hook for multi-channel prescription delivery */

import { useState } from 'react';
import { useDraftStore } from '@/store/draftStore';

export interface DeliveryResult {
  pdf_url?: string;
  pdf_path?: string;
  db_id?: string;
  pharmacy_result?: any;
  email_result?: {
    success: boolean;
    data?: any;
    error?: string;
  } | null;
  push_result?: {
    success: boolean;
    data?: any;
    error?: string;
  } | null;
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
    emailOverride?: string,
    channels: string[] = [],
    wantInHousePharmacy: boolean = true
  ): Promise<DeliveryResult | null> => {
    if (!draft) return null;
    setSending(true);
    setError(null);

    const targetPhone = phoneOverride || draft.phone || '919876543210';
    const targetDob = draft.dob || (draft as any).patient_dob || '01012000';

    try {
      // 1. Approve prescription (generates PDF, saves DB)
      const approveRes = await fetch('/api/prescription/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescription_data: draft,
          phone: targetPhone,
          patient_dob: targetDob,
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

      // 2. Extract pharmacy receipt from approval response (already created on backend)
      let pharmacyJson: any = approveJson.data?.pharmacy_receipt || null;

      // 3. Parallel Non-Blocking Multi-Channel Dispatch (Step 68B & 68C)
      let emailResult: any = null;
      let pushResult: any = null;
      const deliveryTasks: Promise<void>[] = [];

      // Channel A: Email Dispatch
      if (channels.includes('email') && (emailOverride || draft.email)) {
        deliveryTasks.push((async () => {
          try {
            const targetEmail = emailOverride || draft.email;
            const emailRes = await fetch('/api/prescription/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prescription_data: draft,
                pdf_path: approveJson.data?.pdf_path,
                patient_email: targetEmail,
                patient_name: draft.patient_name || 'Patient',
                patient_dob: targetDob,
                phone: targetPhone,
              })
            });
            const emailText = await emailRes.text();
            let emailJson: any = null;
            try {
              emailJson = JSON.parse(emailText);
            } catch (_) {}
            
            if (emailRes.ok && emailJson?.success) {
              emailResult = { success: true, data: emailJson.data };
              console.log('[useSendPrescription] Email Agent success:', emailJson);
            } else {
              const errDetail = emailJson?.detail || emailJson?.error || `HTTP ${emailRes.status}`;
              emailResult = { success: false, error: errDetail };
              console.error('[useSendPrescription] Email Agent failed:', errDetail);
            }
          } catch (emailErr: any) {
            emailResult = { success: false, error: emailErr.message || 'Email network failure' };
            console.error('[useSendPrescription] Email Agent error:', emailErr);
          }
        })());
      }

      // Channel B: Web Push Dispatch
      if (channels.includes('push')) {
        deliveryTasks.push((async () => {
          try {
            const pushRes = await fetch('/api/prescription/send-push', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phone: targetPhone,
                patient_name: draft.patient_name || 'Patient',
              })
            });
            const pushText = await pushRes.text();
            let pushJson: any = null;
            try {
              pushJson = JSON.parse(pushText);
            } catch (_) {}
            if (pushRes.ok && pushJson?.success) {
              pushResult = { success: true, data: pushJson.data };
              console.log('[useSendPrescription] Push Agent success:', pushJson);
            } else {
              pushResult = { success: false, error: pushJson?.detail || pushJson?.error || 'Push unconfirmed' };
            }
          } catch (pushErr: any) {
            pushResult = { success: false, error: pushErr.message || 'Push network error' };
            console.error('[useSendPrescription] Push Agent error:', pushErr);
          }
        })());
      }

      // Await all parallel tasks concurrently
      if (deliveryTasks.length > 0) {
        await Promise.allSettled(deliveryTasks);
      }

      const resPayload: DeliveryResult = {
        ...approveJson.data,
        pharmacy_result: pharmacyJson?.data || null,
        email_result: emailResult,
        push_result: pushResult,
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
