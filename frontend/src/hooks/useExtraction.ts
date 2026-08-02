import { useState } from 'react';
import { useDraftStore } from '@/store/draftStore';
import { useRecordingStore } from '@/store/recordingStore';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { getApiUrl } from '@/utils/apiClient';
import { calculateAgeFromDOB } from '@/utils/validators';

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

  const getAuthHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const extractConsultation = async (
    text?: string,
    audioBlob?: Blob | null
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setStatus('processing');
    setProcessing(true);

    let extractedData = null;

    const selectedLanguage = useRecordingStore.getState().language || 'en';

    try {
      // Audio processing branch
      if (audioBlob && audioBlob.size > 0) {
        const formData = new FormData();
        formData.append('file', audioBlob, 'consultation.webm');

        const selectedModel = useRecordingStore.getState().selectedModel || 'gemini-2.5-flash';

        const audioRes = await fetch(getApiUrl(`/api/consultation/audio?language=${selectedLanguage}&llm_model=${selectedModel}`), {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData,
        });

        // Surface real backend errors (FastAPI returns {detail} on 4xx/5xx)
        if (!audioRes.ok) {
          const errBody = await audioRes.json().catch(() => ({}));
          const detail = errBody.detail || errBody.error || `Server error ${audioRes.status}`;
          throw new Error(`Audio processing failed: ${detail}`);
        }

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

        const selectedModel = useRecordingStore.getState().selectedModel || 'gemini-2.5-flash';

        const res = await fetch(getApiUrl('/api/consultation/process'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ transcript: text, language: selectedLanguage, llm_model: selectedModel }),
        });

        // Surface real backend errors — FastAPI returns {detail} on 4xx/5xx, not {error}
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          const detail = errBody.detail || errBody.error || `Server error ${res.status}`;
          throw new Error(`Extraction failed (${res.status}): ${detail}`);
        }

        const json = await res.json();

        if (json.success && json.data) {
          extractedData = json.data;

          // ── Field aliasing: backend schema → frontend DraftStore field names ──
          // Backend returns `general_advice`, DraftStore expects `advice`
          if (extractedData.general_advice && !extractedData.advice) {
            extractedData.advice = extractedData.general_advice;
          }
          // Backend returns `patient_dob`, DraftStore expects `dob`
          if (extractedData.patient_dob && !extractedData.dob) {
            extractedData.dob = extractedData.patient_dob;
          }
          // Backend returns `patient_email`, DraftStore expects `email`
          if (extractedData.patient_email && !extractedData.email) {
            extractedData.email = extractedData.patient_email;
          }

          const dobVal = extractedData.dob || extractedData.patient_dob;
          if (dobVal && (!extractedData.age || extractedData.age === '')) {
            const autoAge = calculateAgeFromDOB(dobVal);
            if (autoAge !== null) {
              extractedData.age = autoAge;
            }
          }
          setDraft(extractedData);
        } else {
          throw new Error(json.error || 'Extraction failed');
        }
      }

      setStatus('done');
      setPrescriptionStatus('Reviewed');

      // Auto-Pilot Execution Chain: if enabled, zero-touch full master agent workflow & live telemetry
      if (extractedData && useUIStore.getState().isAutoPilotEnabled) {
        try {
          // Open telemetry console so doctor sees live 6-agent execution steps
          useUIStore.getState().setTelemetryOpen(true);
          
          const autoRes = await fetch(getApiUrl('/api/consultation/autopilot'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({
              transcript: text || extractedData.chief_complaint || 'Consultation processed via Auto-Pilot',
              patient_name: extractedData.patient_name || 'Patient',
              phone: extractedData.phone || '919876543210',
              dob: extractedData.dob || extractedData.patient_dob || '15081995',
              want_in_house_buy: true,
              prescription_data: extractedData,
            }),
          });
          const autoJson = await autoRes.json();
          if (autoJson.success) {
            const rxDisp = autoJson.data?.prescription_dispatch;
            if (rxDisp?.pdf_url) setPdfUrl(rxDisp.pdf_url);
            if (rxDisp?.db_id) setSavedId(rxDisp.db_id);
            setDeliveryStatus('sent');
            setPrescriptionStatus('Saved');

            addToast({
              type: 'success',
              title: '⚡ Auto-Pilot Executed Seamlessly',
              message: `Full 6-agent workflow executed for ${extractedData.patient_name || 'Patient'}.`,
            });
          }
        } catch (autoErr) {
          console.warn('[Auto-Pilot Workflow Warn]', autoErr);
        }
      } else if (extractedData) {
        addToast({
          type: 'success',
          title: 'Prescription Extracted Successfully',
          message: `Structured medicines and clinical details extracted for ${extractedData.patient_name || 'Patient'}.`,
        });
      }

      return true;
    } catch (err: any) {
      console.error('[useExtraction Error]', err);
      const isNetworkFail = err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError');
      const errorMsg = isNetworkFail
        ? 'Backend server offline or unreachable. Please start backend server (uvicorn server:app --port 8000) or check network connection.'
        : (err.message || 'Failed to extract prescription');

      setError(errorMsg);
      addToast({
        type: 'error',
        title: 'Extraction Network Error',
        message: errorMsg,
      });
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
