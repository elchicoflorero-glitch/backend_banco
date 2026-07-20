export function LoginHeader() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div
        style={{
          display: 'inline-block',
          background: '#dbeafe',
          padding: '1rem',
          borderRadius: '9999px',
          marginBottom: '1rem',
        }}
      >
        <svg
          style={{ width: '2rem', height: '2rem', color: '#2563eb' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="card-header">BancoPeru</h1>
      <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Sistema de Banca Digital</p>
    </div>
  );
}
