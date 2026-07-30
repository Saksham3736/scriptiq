/* useAudioRecorder.ts — Browser MediaRecorder & Web Speech API custom hook */

import { useState, useRef, useCallback } from 'react';
import { useRecordingStore } from '@/store/recordingStore';

export interface UseAudioRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  elapsedMs: number;
  audioBlob: Blob | null;
  micError: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
}

export function useAudioRecorder(
  onDataChunk?: (chunk: Blob) => void
): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const setTranscript = useRecordingStore((s) => s.setTranscript);
  const setPartialText = useRecordingStore((s) => s.setPartialText);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedMs((prev) => prev + 100);
    }, 100);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];
    setAudioBlob(null);
    setElapsedMs(0);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('Audio recording is not supported in this browser environment.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          onDataChunk?.(event.data);
        }
      };

      mediaRecorder.start(250);

      // Start Browser Web Speech API for real-time STT streaming
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-IN'; // Optimized for Indian doctor accents & medical terms

          recognition.onresult = (event: any) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                final += event.results[i][0].transcript + ' ';
              } else {
                interim += event.results[i][0].transcript;
              }
            }

            if (interim) setPartialText(interim);
            if (final) {
              setPartialText('');
              const current = useRecordingStore.getState().transcript;
              setTranscript((current ? current + ' ' : '') + final.trim());
            }
          };

          recognition.onerror = (e: any) => {
            console.warn('[WebSpeech API Warning]', e.error);
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (speechErr) {
          console.warn('[WebSpeech API Init Warning]', speechErr);
        }
      }

      setIsRecording(true);
      setIsPaused(false);
      startTimer();
    } catch (err: any) {
      console.error('[useAudioRecorder] Mic access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError('Microphone permission was denied. Please allow microphone access in browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setMicError('No microphone hardware detected. Please connect a microphone.');
      } else {
        setMicError(`Microphone error: ${err.message || 'Could not start recording.'}`);
      }
    }
  };

  const stopRecording = async (): Promise<Blob | null> => {
    stopTimer();

    // Stop SpeechRecognition if active
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }

    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        setIsPaused(false);
        resolve(audioBlob);
        return;
      }

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const compiledBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(compiledBlob);
        setIsRecording(false);
        setIsPaused(false);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        resolve(compiledBlob);
      };

      recorder.stop();
    });
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setIsPaused(true);
      stopTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (_) {}
      }
      setIsPaused(false);
      startTimer();
    }
  };

  const resetRecording = () => {
    stopTimer();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (_) {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setIsPaused(false);
    setElapsedMs(0);
    setAudioBlob(null);
    setMicError(null);
    audioChunksRef.current = [];
  };

  return {
    isRecording,
    isPaused,
    elapsedMs,
    audioBlob,
    micError,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  };
}
