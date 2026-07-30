/* useRecordingSocket.ts — WebSocket hook for live consultation transcript streaming */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRecordingStore } from '@/store/recordingStore';
import { useDraftStore } from '@/store/draftStore';

export interface UseRecordingSocketReturn {
  isConnected: boolean;
  sendTextChunk: (text: string) => void;
  sendAudioChunk: (chunk: Blob) => void;
  sendProcess: (patientName?: string, phone?: string, dob?: string) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export function resolveWsUrl(path: string): string {
  if (import.meta.env.VITE_WS_URL) {
    const base = import.meta.env.VITE_WS_URL.replace(/\/$/, '');
    return `${base}${path.startsWith('/') ? path : '/' + path}`;
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    const wsBase = import.meta.env.VITE_API_BASE_URL.replace(/^http/, 'ws').replace(/\/$/, '');
    return `${wsBase}${path.startsWith('/') ? path : '/' + path}`;
  }
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isLocal) {
    return `ws://${window.location.hostname}:8000${path.startsWith('/') ? path : '/' + path}`;
  }
  return `wss://scriptiq-backend.onrender.com${path.startsWith('/') ? path : '/' + path}`;
}

export function useRecordingSocket(wsUrl?: string): UseRecordingSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const setPartialText = useRecordingStore((s) => s.setPartialText);
  const setTranscript = useRecordingStore((s) => s.setTranscript);
  const setStatus = useRecordingStore((s) => s.setStatus);
  const setProcessing = useRecordingStore((s) => s.setProcessing);
  const setDraft = useDraftStore((s) => s.setDraft);

  const getUrl = useCallback(() => {
    if (wsUrl) return wsUrl;
    return resolveWsUrl('/ws/transcript');
  }, [wsUrl]);

  const connectSocket = useCallback(() => {
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const socket = new WebSocket(getUrl());
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('[WebSocket] Connected to transcript stream');
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.event === 'transcript_partial') {
            setPartialText(msg.text || '');
            if (msg.cumulative) {
              setTranscript(msg.cumulative);
            }
          } else if (msg.event === 'processing_started') {
            setStatus('processing');
            setProcessing(true);
          } else if (msg.event === 'prescription_ready') {
            if (msg.data) {
              setDraft(msg.data);
            }
            setStatus('done');
            setProcessing(false);
          } else if (msg.event === 'error') {
            console.error('[WebSocket Error]', msg.message);
            setStatus('error' as any);
            setProcessing(false);
          }
        } catch (err) {
          console.error('[WebSocket Parse Error]', err);
        }
      };

      socket.onclose = () => {
        console.log('[WebSocket] Disconnected');
        setIsConnected(false);
      };

      socket.onerror = (err) => {
        console.error('[WebSocket Socket Error]', err);
        setIsConnected(false);
      };
    } catch (e) {
      console.error('[WebSocket Connection Failed]', e);
    }
  }, [getUrl, setPartialText, setTranscript, setStatus, setProcessing, setDraft]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const sendTextChunk = (text: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event: 'text_chunk', text }));
    }
  };

  const sendAudioChunk = (chunk: Blob) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        if (base64Data) {
          socketRef.current?.send(
            JSON.stringify({
              event: 'audio_chunk',
              data: base64Data,
              mimeType: chunk.type,
            })
          );
        }
      };
      reader.readAsDataURL(chunk);
    }
  };

  const sendProcess = (patientName?: string, phone?: string, dob?: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const currentTranscript = useRecordingStore.getState().transcript;
      socketRef.current.send(
        JSON.stringify({
          event: 'process',
          transcript: currentTranscript,
          patient_name: patientName,
          phone,
          dob,
        })
      );
    }
  };

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return {
    isConnected,
    sendTextChunk,
    sendAudioChunk,
    sendProcess,
    connectSocket,
    disconnectSocket,
  };
}
