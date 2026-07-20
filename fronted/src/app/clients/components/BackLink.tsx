'use client';

import Link from 'next/link';

export function BackLink() {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <Link href="/dashboard" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem' }}>
        ← Volver al Dashboard
      </Link>
    </div>
  );
}
