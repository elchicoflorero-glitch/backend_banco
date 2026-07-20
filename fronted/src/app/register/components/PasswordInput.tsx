'use client';

import { useState } from 'react';

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  showGenerator?: boolean;
  onGeneratePassword?: (password: string) => void;
}

export function PasswordInput({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  disabled,
  showGenerator = false,
  onGeneratePassword,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const generateSecurePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const all = uppercase + lowercase + numbers + symbols;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = password.length; i < 12; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    const event = new Event('input', { bubbles: true });
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = newPassword;
      input.dispatchEvent(event);
      if (onGeneratePassword) {
        onGeneratePassword(newPassword);
      }
    }
    setShowSuggestion(true);
    setTimeout(() => setShowSuggestion(false), 3000);
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 'Muy débil', color: '#ef4444', percentage: 0 };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    if (strength <= 1) return { strength: 'Muy débil', color: '#ef4444', percentage: 20 };
    if (strength <= 2) return { strength: 'Débil', color: '#f97316', percentage: 40 };
    if (strength <= 4) return { strength: 'Media', color: '#eab308', percentage: 60 };
    if (strength <= 5) return { strength: 'Fuerte', color: '#84cc16', percentage: 80 };
    return { strength: 'Muy fuerte', color: '#22c55e', percentage: 100 };
  };

  const passwordStrength = getPasswordStrength(value);

  return (
    <div className="form-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label htmlFor={id} className="label">
          {label}
        </label>
        {showGenerator && (
          <button
            type="button"
            onClick={handleGeneratePassword}
            disabled={disabled}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '0.75rem',
              textDecoration: 'underline',
              opacity: disabled ? 0.5 : 1,
            }}
          >
            Generar segura
          </button>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          required
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            paddingRight: '2.5rem',
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: '#6b7280',
            opacity: disabled ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.5rem',
            height: '1.5rem',
            padding: 0,
          }}
          title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </button>
      </div>

      {value && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div
              style={{
                flex: 1,
                height: '4px',
                background: '#e5e7eb',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${passwordStrength.percentage}%`,
                  background: passwordStrength.color,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                color: passwordStrength.color,
                fontWeight: 500,
                minWidth: '5rem',
              }}
            >
              {passwordStrength.strength}
            </span>
          </div>
          <ul style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0', paddingLeft: '1.25rem' }}>
            <li style={{ color: value.length >= 8 ? '#22c55e' : '#9ca3af' }}>
              {value.length >= 8 ? '✓' : '○'} Al menos 8 caracteres
            </li>
            <li style={{ color: /[A-Z]/.test(value) ? '#22c55e' : '#9ca3af' }}>
              {/[A-Z]/.test(value) ? '✓' : '○'} Una mayúscula
            </li>
            <li style={{ color: /[a-z]/.test(value) ? '#22c55e' : '#9ca3af' }}>
              {/[a-z]/.test(value) ? '✓' : '○'} Una minúscula
            </li>
            <li style={{ color: /[0-9]/.test(value) ? '#22c55e' : '#9ca3af' }}>
              {/[0-9]/.test(value) ? '✓' : '○'} Un número
            </li>
            <li style={{ color: /[!@#$%^&*]/.test(value) ? '#22c55e' : '#9ca3af' }}>
              {/[!@#$%^&*]/.test(value) ? '✓' : '○'} Un símbolo (!@#$%^&*)
            </li>
          </ul>
        </div>
      )}

      {showSuggestion && (
        <div
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            background: '#f0fdf4',
            borderLeft: '3px solid #22c55e',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            color: '#166534',
          }}
        >
          ✓ Contraseña segura generada
        </div>
      )}
    </div>
  );
}
