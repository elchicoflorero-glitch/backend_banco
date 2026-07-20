interface SuccessAlertProps {
  message: string;
  transactionId?: string;
}

export function SuccessAlert({ message, transactionId }: SuccessAlertProps) {
  if (!message) return null;

  return (
    <div
      style={{
        background: '#dcfce7',
        border: '1px solid #86efac',
        color: '#166534',
        padding: '1rem',
        borderRadius: '0.375rem',
        marginBottom: '1.5rem',
        fontSize: '0.875rem',
      }}
    >
      <div>✅ {message}</div>
      {transactionId && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.8 }}>
          ID de transacción: {transactionId}
        </div>
      )}
    </div>
  );
}
