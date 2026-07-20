'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { LoginHeader } from './components/LoginHeader';
import { LoginPasswordInput } from './components/LoginPasswordInput';
import { LoginButton } from './components/LoginButton';
import { RegisterLink } from './components/RegisterLink';
import { AlertMessage } from '../register/components/AlertMessage';
import { Divider } from '../register/components/Divider';
import { FormInput } from '../register/components/FormInput';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      const msg = 'Registro exitoso. Por favor, inicia sesión con tus credenciales.';
      setSuccess(msg);
      addToast('success', '¡Bienvenido! Por favor inicia sesión');
    }
  }, [searchParams, addToast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!username.trim()) {
        const errorMsg = 'Por favor, ingresa tu usuario';
        setError(errorMsg);
        addToast('error', errorMsg);
        setLoading(false);
        return;
      }
      if (!password.trim()) {
        const errorMsg = 'Por favor, ingresa tu contraseña';
        setError(errorMsg);
        addToast('error', errorMsg);
        setLoading(false);
        return;
      }

      await login(username, password);
      addToast('success', `¡Bienvenido ${username}! Ingresando al sistema...`);
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      let displayError = 'Error al iniciar sesión. Intenta de nuevo.';

      if (errorMessage === 'Invalid credentials') {
        displayError = 'Usuario o contraseña incorrectos';
      } else if (errorMessage?.includes('not found')) {
        displayError = 'El usuario no existe';
      } else if (errorMessage?.includes('password')) {
        displayError = 'Contraseña incorrecta';
      } else if (errorMessage) {
        displayError = errorMessage;
      }

      setError(displayError);
      addToast('error', displayError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
        padding: '1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <div className="card">
          <LoginHeader />

          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
            onSubmit={handleSubmit}
          >
            {error && <AlertMessage type="error" message={error} />}
            {success && <AlertMessage type="success" message={success} />}

            <FormInput
              id="username"
              name="username"
              type="text"
              label="Usuario"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />

            <LoginPasswordInput
              id="password"
              name="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <LoginButton loading={loading} />

            <Divider />

            <RegisterLink />
          </form>
        </div>

        <p
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#6b7280',
          }}
        >
          © 2024 BancoPeru. Todos los derechos reservados.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
