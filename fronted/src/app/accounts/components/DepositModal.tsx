'use client';

import axios from 'axios';
import { useState } from 'react';
import { Modal } from './Modal';
import { useToast } from '@/contexts/ToastContext';

interface DepositModalProps {
  isOpen: boolean;
  accountId?: string;
  accountNumber?: string;
  token: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function DepositModal({
  isOpen,
  accountId,
  accountNumber,
  token,
  onClose,
  onSuccess,
  onError,
}: DepositModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Ingresa un monto válido mayor a 0';
    }
    if (parseFloat(amount) > 999999999.99) {
      newErrors.amount = 'El monto es demasiado grande';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('error', 'Por favor completa los campos correctamente');
      return;
    }

    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/deposit`,
        {
          accountId,
          amount: parseFloat(amount),
          description: description || undefined,
        },
        { headers }
      );

      addToast('success', `¡Depósito de S/. ${parseFloat(amount).toFixed(2)} realizado exitosamente!`);
      setAmount('');
      setDescription('');
      setErrors({});
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al realizar el depósito';
      addToast('error', errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} title={`Depósito a Cuenta ${accountNumber}`} onClose={handleClose} size="sm">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Monto a Depositar
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem', fontSize: '1.125rem', color: '#6b7280' }}>S/.</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="999999999.99"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
              placeholder="0.00"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: errors.amount ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
          </div>
          {errors.amount && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.amount}</p>}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Descripción (opcional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            placeholder="Ej: Depósito inicial"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            style={{
              background: '#d1d5db',
              color: '#374151',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading ? '#9ca3af' : '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isLoading ? 'Procesando...' : 'Realizar Depósito'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
