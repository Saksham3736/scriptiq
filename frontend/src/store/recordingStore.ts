// recordingStore.ts — Zustand recording pipeline state

import { create } from 'zustand';

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'processing' | 'done' | 'error';
export type InputMode = 'voice' | 'text';
export type LanguageMode = 'en' | 'hinglish' | 'hi';
export type AIModelMode = 'gemini-2.5-flash' | 'gemini-3.5-flash' | 'gemini-3-flash' | 'gemini-2.5-flash-lite' | 'heuristic-regex';

interface RecordingState {
  status: RecordingStatus;
  mode: InputMode;
  language: LanguageMode;
  selectedModel: AIModelMode;
  elapsedMs: number;
  transcript: string;         // full raw transcript
  partialText: string;        // live streaming partial
  isProcessing: boolean;
  micError: string | null;
  audioBlob: Blob | null;

  setStatus: (status: RecordingStatus) => void;
  setMode: (mode: InputMode) => void;
  setLanguage: (lang: LanguageMode) => void;
  setSelectedModel: (model: AIModelMode) => void;
  setElapsedMs: (ms: number) => void;
  appendTranscript: (chunk: string) => void;
  setPartialText: (text: string) => void;
  setTranscript: (text: string) => void;
  setMicError: (err: string | null) => void;
  setAudioBlob: (blob: Blob | null) => void;
  resetRecording: () => void;
  setProcessing: (v: boolean) => void;
}

export const useRecordingStore = create<RecordingState>((set) => ({
  status: 'idle',
  mode: 'voice',
  language: 'en',
  selectedModel: 'gemini-2.5-flash',
  elapsedMs: 0,
  transcript: '',
  partialText: '',
  isProcessing: false,
  micError: null,
  audioBlob: null,

  setStatus: (status) => set({ status }),
  setMode: (mode) => set({ mode }),
  setLanguage: (language) => set({ language }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  setElapsedMs: (ms) => set({ elapsedMs: ms }),
  appendTranscript: (chunk) =>
    set((s) => ({ transcript: s.transcript ? s.transcript + ' ' + chunk : chunk })),
  setPartialText: (text) => set({ partialText: text }),
  setTranscript: (text) => set({ transcript: text }),
  setMicError: (micError) => set({ micError }),
  setAudioBlob: (audioBlob) => set({ audioBlob }),
  resetRecording: () =>
    set({ status: 'idle', elapsedMs: 0, transcript: '', partialText: '', isProcessing: false, micError: null, audioBlob: null }),
  setProcessing: (v) => set({ isProcessing: v }),
}));
