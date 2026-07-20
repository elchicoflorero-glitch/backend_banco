interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      style={{
        background: '#fee2e2',
        border: '1px solid #fecaca',
        color: '#991b1b',
        padding: '1rem',
        borderRadius: '0.375rem',
        marginBottom: '1.5rem',
        fontSize: '0.875rem',
      }}
    >
      ⚠️ {message}
    </div>
  );
}
