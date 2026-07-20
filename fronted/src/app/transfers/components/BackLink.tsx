'use client';

import Link from 'next/link';

export function BackLink() {
  return (
    <Link
      href="/dashboard"
      style={{
        color: '#2563eb',
        textDecoration: 'none',
        fontSize: '0.875rem',
        marginBottom: '1rem',
        display: 'block',
      }}
    >
      ← Volver al Dashboard
    </Link>
  );
}
