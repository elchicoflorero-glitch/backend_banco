import Link from 'next/link';

export function BackLink() {
  return (
    <Link
      href="/client-portal"
      style={{
        display: 'inline-block',
        marginBottom: '1.5rem',
        color: '#2563eb',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: '600',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textDecoration = 'underline';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecoration = 'none';
      }}
    >
      ← Volver al portal
    </Link>
  );
}
