export function RegisterHeader() {
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
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      </div>
      <h1 className="card-header">Crear Cuenta</h1>
      <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Sistema de Banca Digital</p>
    </div>
  );
}
