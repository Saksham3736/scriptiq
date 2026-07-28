// uiStore.ts — Zustand global UI state store (toasts, timeline status, modals, loading)

import { create } from 'zustand';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // Duration in ms, defaults to 4000
}

export type PrescriptionLifecycleStatus = 'Draft' | 'Reviewed' | 'Saved' | 'Sent' | 'Viewed';

interface UIState {
  toasts: ToastItem[];
  prescriptionStatus: PrescriptionLifecycleStatus;
  globalLoading: boolean;
  isAutoPilotEnabled: boolean;
  isTelemetryOpen: boolean;

  // Actions
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  setPrescriptionStatus: (status: PrescriptionLifecycleStatus) => void;
  setGlobalLoading: (loading: boolean) => void;
  toggleAutoPilot: () => void;
  setAutoPilot: (enabled: boolean) => void;
  toggleTelemetry: () => void;
  setTelemetryOpen: (open: boolean) => void;
  clearToasts: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  prescriptionStatus: 'Draft',
  globalLoading: false,
  isAutoPilotEnabled: true, // Enabled by default for seamless zero-touch workflow
  isTelemetryOpen: false,

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const duration = toast.duration ?? 4000;

    const newToast: ToastItem = {
      ...toast,
      id,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  setPrescriptionStatus: (status) => {
    set({ prescriptionStatus: status });
  },

  setGlobalLoading: (loading) => {
    set({ globalLoading: loading });
  },

  toggleAutoPilot: () => {
    set((state) => ({ isAutoPilotEnabled: !state.isAutoPilotEnabled }));
  },

  setAutoPilot: (enabled) => {
    set({ isAutoPilotEnabled: enabled });
  },

  toggleTelemetry: () => {
    set((state) => ({ isTelemetryOpen: !state.isTelemetryOpen }));
  },

  setTelemetryOpen: (open) => {
    set({ isTelemetryOpen: open });
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));
