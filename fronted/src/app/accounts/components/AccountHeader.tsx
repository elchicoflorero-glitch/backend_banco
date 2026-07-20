'use client';

interface AccountHeaderProps {
  totalAccounts: number;
  onCreateClick: () => void;
}

export function AccountHeader({ totalAccounts, onCreateClick }: AccountHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}
    >
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Gestión de Cuentas
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
          Total: {totalAccounts} cuentas
        </p>
      </div>
      <button
        onClick={onCreateClick}
        style={{
          background: '#2563eb',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        + Nueva Cuenta
      </button>
    </div>
  );
}
