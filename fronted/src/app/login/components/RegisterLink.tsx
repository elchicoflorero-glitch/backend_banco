import Link from 'next/link';

export function RegisterLink() {
  return (
    <p
      style={{
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#4b5563',
      }}
    >
      ¿No tienes cuenta?{' '}
      <Link
        href="/register"
        style={{
          color: '#2563eb',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        Regístrate aquí
      </Link>
    </p>
  );
}
