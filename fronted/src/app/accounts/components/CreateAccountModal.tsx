'use client';

import axios from 'axios';
import { useState } from 'react';
import { Modal } from './Modal';
import type { Account, CreateAccountForm } from './AccountFormData';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
}

interface CreateAccountModalProps {
  isOpen: boolean;
  clients: Client[];
  token: string;
  onClose: () => void;
  onSuccess: (account: Account) => void;
  onError: (message: string) => void;
}

export function CreateAccountModal({
  isOpen,
  clients,
  token,
  onClose,
  onSuccess,
  onError,
}: CreateAccountModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAccountForm>({
    clientId: '',
    currency: 'PEN',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId) {
      onError('Selecciona un cliente');
      return;
    }

    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(
        `${apiUrl}/accounts`,
        {
          clientId: formData.clientId,
          currency: formData.currency,
        },
        { headers }
      );

      onSuccess(response.data);
      setFormData({ clientId: '', currency: 'PEN' });
      onClose();
    } catch (err: any) {
      onError(err.response?.data?.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ clientId: '', currency: 'PEN' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Nueva Cuenta" onClose={handleCancel} size="md">
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
            Cliente
          </label>
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
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
            <option value="">Selecciona un cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName} (DNI: {client.dni})
              </option>
            ))}
          </select>
        </div>

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
              background: isLoading ? '#9ca3af' : '#22c55e',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {isLoading ? 'Creando...' : 'Crear Cuenta'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
