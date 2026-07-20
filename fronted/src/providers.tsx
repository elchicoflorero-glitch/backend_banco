'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { NotificationContainer } from '@/components/layout/NotificationContainer';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/Toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NotificationContainer />
        <ToastProvider>
          <ToastContainer />
          {children}
        </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
