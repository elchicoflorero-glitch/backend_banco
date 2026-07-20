import Link from 'next/link';

export function LoginLink() {
  return (
    <p
      style={{
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#4b5563',
      }}
    >
      ¿Ya tienes cuenta?{' '}
      <Link
        href="/login"
        style={{
          color: '#2563eb',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        Inicia sesión aquí
      </Link>
    </p>
  );
}
