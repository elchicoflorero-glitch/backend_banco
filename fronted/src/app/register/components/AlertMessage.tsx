interface AlertMessageProps {
  type: 'error' | 'success';
  message: string;
}

export function AlertMessage({ type, message }: AlertMessageProps) {
  const isError = type === 'error';
  
  return (
    <div
      style={{
        background: isError ? '#fef2f2' : '#f0fdf4',
        borderLeft: `4px solid ${isError ? '#ef4444' : '#22c55e'}`,
        padding: '1rem',
        borderRadius: '0.25rem',
        display: 'flex',
      }}
    >
      <svg
        style={{
          width: '1.25rem',
          height: '1.25rem',
          color: isError ? '#ef4444' : '#22c55e',
          flexShrink: 0,
        }}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {isError ? (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        )}
      </svg>
      <p
        style={{
          marginLeft: '0.75rem',
          fontSize: '0.875rem',
          color: isError ? '#b91c1c' : '#166534',
        }}
      >
        {message}
      </p>
    </div>
  );
}
