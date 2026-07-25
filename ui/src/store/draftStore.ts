// draftStore.ts — Zustand prescription draft state

import { create } from 'zustand';

export interface Medicine {
  name: string;
  strength?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  timing?: string;
  notes?: string;
}

export interface PrescriptionDraft {
  patient_name?: string;
  phone?: string;
  dob?: string;
  symptoms?: string[];
  diagnosis?: string;
  medicines?: Medicine[];
  tests?: string[];
  advice?: string[];
  follow_up?: string;
  doctor_name?: string;
  clinic_name?: string;
  consultation_date?: string;
}

interface DraftState {
  draft: PrescriptionDraft | null;
  isDirty: boolean;
  savedId: string | null;          // MongoDB _id after save
  pdfUrl: string | null;
  deliveryStatus: 'unsent' | 'sent' | 'delivered' | 'viewed';
  pharmacyStatus: 'pending' | 'in-house' | 'external' | null;
  confidenceScores: Record<string, number>;

  setDraft: (draft: PrescriptionDraft) => void;
  updateField: <K extends keyof PrescriptionDraft>(key: K, value: PrescriptionDraft[K]) => void;
  setSavedId: (id: string) => void;
  setPdfUrl: (url: string) => void;
  setDeliveryStatus: (s: DraftState['deliveryStatus']) => void;
  setPharmacyStatus: (s: DraftState['pharmacyStatus']) => void;
  setConfidenceScores: (scores: Record<string, number>) => void;
  clearDraft: () => void;
}

export const useDraftStore = create<DraftState>((set) => ({
  draft: null,
  isDirty: false,
  savedId: null,
  pdfUrl: null,
  deliveryStatus: 'unsent',
  pharmacyStatus: null,
  confidenceScores: {
    patient_name: 96,
    symptoms: 92,
    diagnosis: 89,
    medicines: 94,
    tests: 88,
    advice: 90,
  },

  setDraft: (draft) => set({ draft, isDirty: false }),
  updateField: (key, value) =>
    set((s) => ({ draft: s.draft ? { ...s.draft, [key]: value } : { [key]: value }, isDirty: true })),
  setSavedId: (id) => set({ savedId: id }),
  setPdfUrl: (url) => set({ pdfUrl: url }),
  setDeliveryStatus: (s) => set({ deliveryStatus: s }),
  setPharmacyStatus: (s) => set({ pharmacyStatus: s }),
  setConfidenceScores: (scores) => set({ confidenceScores: scores }),
  clearDraft: () =>
    set({ draft: null, isDirty: false, savedId: null, pdfUrl: null, deliveryStatus: 'unsent', pharmacyStatus: null, confidenceScores: {} }),
}));
