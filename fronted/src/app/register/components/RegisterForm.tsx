'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import { FormInput } from './FormInput';
import { PasswordInput } from './PasswordInput';
import { AlertMessage } from './AlertMessage';
import { RegisterHeader } from './RegisterHeader';
import { SubmitButton } from './SubmitButton';
import { LoginLink } from './LoginLink';
import { Divider } from './Divider';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordGenerated = (password: string) => {
    setFormData((prev) => ({
      ...prev,
      password,
      confirmPassword: '',
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.username.trim()) {
      return 'Por favor, ingresa un usuario';
    }
    if (!formData.email.trim()) {
      return 'Por favor, ingresa un email';
    }
    if (!formData.email.includes('@')) {
      return 'Por favor, ingresa un email válido';
    }
    if (!formData.password) {
      return 'Por favor, ingresa una contraseña';
    }
    if (formData.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!formData.confirmPassword) {
      return 'Por favor, confirma tu contraseña';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      addToast('error', validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010'}/auth/register`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'user', // Role siempre es 'user'
        }
      );

      if (response.status === 201) {
        const successMsg = 'Registro exitoso. Redirigiendo al login...';
        setSuccess(successMsg);
        addToast('success', '¡Registro completado! Bienvenido a BancoPeru');
        setTimeout(() => {
          router.push('/login?registered=true');
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      let displayError = 'Error al registrarse. Intenta de nuevo.';

      if (errorMessage?.includes('Username already exists')) {
        displayError = 'Este usuario ya está registrado';
      } else if (errorMessage?.includes('Email already exists')) {
        displayError = 'Este email ya está registrado';
      } else if (errorMessage?.includes('already exists')) {
        displayError = 'Este usuario o email ya existe';
      } else if (error.code === 'ECONNREFUSED') {
        displayError = 'No se pudo conectar con el servidor. Intenta más tarde.';
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
          <RegisterHeader />

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
              placeholder="Ingresa un usuario"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />

            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Ingresa tu email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />

            <PasswordInput
              id="password"
              name="password"
              label="Contraseña"
              placeholder="Contraseña (mínimo 6 caracteres)"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              showGenerator={true}
              onGeneratePassword={handlePasswordGenerated}
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar Contraseña"
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              showGenerator={false}
            />

            <SubmitButton loading={loading} />

            <Divider />

            <LoginLink />
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
