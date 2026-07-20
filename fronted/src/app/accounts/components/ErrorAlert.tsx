'use client';

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      style={{
        background: '#fef2f2',
        borderLeft: '4px solid #ef4444',
        padding: '1rem',
        borderRadius: '0.25rem',
        marginBottom: '1.5rem',
        color: '#b91c1c',
        fontSize: '0.875rem',
      }}
    >
      {message}
    </div>
  );
}
