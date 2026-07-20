'use client';

interface SuccessAlertProps {
  message: string;
  transactionId?: string;
}

export function SuccessAlert({ message, transactionId }: SuccessAlertProps) {
  if (!message) return null;

  return (
    <div
      style={{
        background: '#f0fdf4',
        borderLeft: '4px solid #22c55e',
        padding: '1rem',
        borderRadius: '0.25rem',
        marginBottom: '1.5rem',
        color: '#166534',
        fontSize: '0.875rem',
      }}
    >
      {message}
      {transactionId && (
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', margin: 0 }}>
          ID de transacción: {transactionId}
        </p>
      )}
    </div>
  );
}
