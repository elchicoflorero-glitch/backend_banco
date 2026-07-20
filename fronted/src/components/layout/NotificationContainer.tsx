'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { Alert } from '@/components/common';

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="animate-in fade-in slide-in-from-right-4 duration-300"
        >
          <Alert
            type={notification.type}
            title={notification.title}
            closeable
            onClose={() => removeNotification(notification.id)}
          >
            {notification.message}
          </Alert>
        </div>
      ))}
    </div>
  );
}
