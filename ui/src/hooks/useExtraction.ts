import { useState } from 'react';
import { useDraftStore } from '@/store/draftStore';
import { useRecordingStore } from '@/store/recordingStore';
import { useUIStore } from '@/store/uiStore';

export function useExtraction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setDraft = useDraftStore((s) => s.setDraft);
  const setPdfUrl = useDraftStore((s) => s.setPdfUrl);
  const setSavedId = useDraftStore((s) => s.setSavedId);
  const setDeliveryStatus = useDraftStore((s) => s.setDeliveryStatus);

  const setStatus = useRecordingStore((s) => s.setStatus);
  const setProcessing = useRecordingStore((s) => s.setProcessing);
  const setTranscript = useRecordingStore((s) => s.setTranscript);
  const addToast = useUIStore((s) => s.addToast);
  const setPrescriptionStatus = useUIStore((s) => s.setPrescriptionStatus);

  const extractConsultation = async (
    text?: string,
    audioBlob?: Blob | null
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setStatus('processing');
    setProcessing(true);

    let extractedData = null;

    try {
      // Audio processing branch
      if (audioBlob && audioBlob.size > 0) {
        const formData = new FormData();
        formData.append('file', audioBlob, 'consultation.webm');

        const audioRes = await fetch('/api/consultation/audio', {
          method: 'POST',
          body: formData,
        });
        const audioJson = await audioRes.json();

        if (audioJson.success && audioJson.data?.prescription) {
          extractedData = audioJson.data.prescription;
          setDraft(extractedData);
          if (audioJson.data.speech?.transcript) {
            setTranscript(audioJson.data.speech.transcript);
          }
        } else if (audioJson.error) {
          throw new Error(audioJson.error);
        } else if (audioJson.data?.speech?.transcript) {
          text = audioJson.data.speech.transcript;
        }
      }

      // Text transcript processing branch
      if (!extractedData) {
        if (!text || !text.trim()) {
          throw new Error('No consultation transcript or audio recorded.');
        }

        const res = await fetch('/api/consultation/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: text }),
        });
        const json = await res.json();

        if (json.success && json.data) {
          extractedData = json.data;
          setDraft(extractedData);
        } else {
          throw new Error(json.error || 'Extraction failed');
        }
      }

      setStatus('done');

      // Auto-Pilot Execution Chain: if enabled, zero-touch approve & PDF generation
      if (extractedData && useUIStore.getState().isAutoPilotEnabled) {
        try {
          const saveRes = await fetch('/api/prescription/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prescription_data: extractedData,
              phone: extractedData.phone || '919876543210',
              patient_dob: extractedData.dob || '15081995',
            }),
          });
          const saveJson = await saveRes.json();
          if (saveJson.success) {
            if (saveJson.data?.pdf_url) setPdfUrl(saveJson.data.pdf_url);
            if (saveJson.data?.db_id) setSavedId(saveJson.data.db_id);
            setDeliveryStatus('sent');
            setPrescriptionStatus('Saved');

            addToast({
              type: 'success',
              title: '⚡ Auto-Pilot Executed Seamlessly',
              message: `Prescription extracted, ReportLab PDF generated, and saved to MongoDB for ${extractedData.patient_name || 'Patient'}.`,
            });
          }
        } catch (autoErr) {
          console.warn('[Auto-Pilot Save Warn]', autoErr);
        }
      }

      return true;
    } catch (err: any) {
      console.error('[useExtraction Error]', err);
      setError(err.message || 'Failed to extract prescription');
      setStatus('error' as any);
      return false;
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  return {
    loading,
    error,
    extractConsultation,
  };
}
