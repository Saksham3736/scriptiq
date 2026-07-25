/* ToastContainer.tsx — Floating viewport container for stacked toast notifications */

import { useUIStore } from '@/store/uiStore';
import Toast from './Toast';

export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
