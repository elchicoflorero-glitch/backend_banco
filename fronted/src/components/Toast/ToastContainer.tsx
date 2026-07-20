'use client';

import { useToast } from '@/contexts/ToastContext';
import { Toast } from './Toast';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '28rem',
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
