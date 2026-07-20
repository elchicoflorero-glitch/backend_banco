'use client';

import { useState } from 'react';
import axios from 'axios';
import { Modal } from './Modal';
import { useToast } from '@/contexts/ToastContext';

interface DeleteClientModalProps {
  isOpen: boolean;
  clientName?: string;
  clientId?: string;
  token: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function DeleteClientModal({
  isOpen,
  clientName,
  clientId,
  token,
  onClose,
  onSuccess,
  onError,
}: DeleteClientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      await axios.delete(`${apiUrl}/clients/${clientId}`, { headers });
      addToast('success', `¡Cliente ${clientName} eliminado exitosamente!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al eliminar el cliente';
      addToast('error', errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Confirmar Eliminación" onClose={onClose} size="sm">
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#374151', marginBottom: '1rem' }}>
          ¿Estás seguro de que deseas eliminar al cliente <strong>{clientName}</strong>?
        </p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Esta acción no se puede deshacer. El cliente y toda su información asociada serán
          eliminados del sistema.
        </p>
      </div>

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
          onClick={handleConfirmDelete}
          disabled={isLoading}
          style={{
            background: isLoading ? '#dc2626' : '#ef4444',
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
