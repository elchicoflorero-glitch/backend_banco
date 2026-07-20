'use client';

import axios from 'axios';
import { useState } from 'react';
import { Modal } from './Modal';

interface DeleteAccountModalProps {
  isOpen: boolean;
  accountId?: string;
  accountNumber?: string;
  token: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function DeleteAccountModal({
  isOpen,
  accountId,
  accountNumber,
  token,
  onClose,
  onSuccess,
  onError,
}: DeleteAccountModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      await axios.delete(`${apiUrl}/accounts/${accountId}`, { headers });

      onSuccess();
      onClose();
    } catch (err: any) {
      onError(err.response?.data?.message || 'Error al eliminar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Eliminar Cuenta" onClose={onClose} size="sm">
      <p style={{ marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
        ¿Está seguro de que desea eliminar la cuenta <strong>{accountNumber}</strong>? Esta acción
        no se puede deshacer.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
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
          onClick={handleDelete}
          disabled={isLoading}
          style={{
            background: isLoading ? '#9ca3af' : '#ef4444',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {isLoading ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </Modal>
  );
}
