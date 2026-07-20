'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import type { Account, CreateAccountForm } from './AccountFormData';

interface EditAccountModalProps {
  isOpen: boolean;
  accountId?: string;
  token: string;
  onClose: () => void;
  onSuccess: (account: Account) => void;
  onError: (message: string) => void;
}

export function EditAccountModal({
  isOpen,
  accountId,
  token,
  onClose,
  onSuccess,
  onError,
}: EditAccountModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [formData, setFormData] = useState<CreateAccountForm>({
    clientId: '',
    currency: 'PEN',
  });

  // Fetch account data cuando se abre el modal
  useEffect(() => {
    if (isOpen && accountId) {
      const fetchAccount = async () => {
        setLoadingAccount(true);
        try {
          const headers = { Authorization: `Bearer ${token}` };
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.get(`${apiUrl}/accounts/${accountId}`, { headers });
          setFormData({
            clientId: response.data.clientId,
            currency: response.data.currency || 'PEN',
          });
        } catch (err: any) {
          onError('Error al cargar la cuenta');
        } finally {
          setLoadingAccount(false);
        }
      };

      fetchAccount();
    }
  }, [isOpen, accountId, token, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.patch(
        `${apiUrl}/accounts/${accountId}`,
        {
          currency: formData.currency,
        },
        { headers }
      );

      onSuccess(response.data);
      onClose();
    } catch (err: any) {
      onError(err.response?.data?.message || 'Error al actualizar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ clientId: '', currency: 'PEN' });
    onClose();
  };

  if (loadingAccount) {
    return (
      <Modal isOpen={isOpen} title="Editar Cuenta" onClose={handleCancel} size="md">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          Cargando cuenta...
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} title="Editar Cuenta" onClose={handleCancel} size="md">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            Moneda
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              backgroundColor: '#ffffff',
              color: '#1f2937',
              outline: 'none',
            }}
          >
            <option value="PEN">PEN (Soles Peruanos)</option>
            <option value="USD">USD (Dólares)</option>
            <option value="EUR">EUR (Euros)</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            style={{
              background: '#d1d5db',
              color: '#374151',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading ? '#9ca3af' : '#f59e0b',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
