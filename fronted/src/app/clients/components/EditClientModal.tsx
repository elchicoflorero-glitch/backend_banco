'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { useToast } from '@/contexts/ToastContext';
import type { ClientFormData } from './ClientFormData';

interface EditClientModalProps {
  isOpen: boolean;
  clientId?: string;
  token: string;
  onClose: () => void;
  onSuccess: (client: any) => void;
  onError: (message: string) => void;
}

export function EditClientModal({
  isOpen,
  clientId,
  token,
  onClose,
  onSuccess,
  onError,
}: EditClientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  const [formData, setFormData] = useState({
    dni: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();
  const [hasLoadedClient, setHasLoadedClient] = useState(false);

  useEffect(() => {
    if (isOpen && clientId && !hasLoadedClient) {
      setLoadingClient(true);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFormData({
            dni: res.data.dni,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            phone: res.data.phone,
            password: '',
          });
          setHasLoadedClient(true);
        })
        .catch(() => {
          const errorMsg = 'Error al cargar el cliente';
          onError(errorMsg);
          addToast('error', errorMsg);
        })
        .finally(() => setLoadingClient(false));
    }
  }, [isOpen, clientId, token, onError, addToast, hasLoadedClient]);

  // Reset cuando se cierre el modal
  useEffect(() => {
    if (!isOpen) {
      setHasLoadedClient(false);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Nombre es requerido';
    if (!formData.lastName) newErrors.lastName = 'Apellido es requerido';
    if (!formData.email) newErrors.email = 'Email es requerido';
    if (!formData.phone) newErrors.phone = 'Teléfono es requerido';
    // Password es opcional en actualización
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Contraseña debe tener al menos 6 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      // Construir el payload sin enviar dni ni password vacío
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        ...(formData.password && { password: formData.password }), // Solo incluir si no está vacío
      };
      
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`,
        updatePayload,
        { headers }
      );
      
      addToast('success', `¡Cliente ${formData.firstName} ${formData.lastName} actualizado exitosamente!`);
      onSuccess(response.data);
      onClose();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar el cliente';
      addToast('error', errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} title="Editar Cliente" onClose={onClose} size="md">
      {loadingClient ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Cargando cliente...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>DNI</label>
              <input type="text" value={formData.dni} disabled style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', background: '#f3f4f6', color: '#6b7280' }} />
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.25rem' }}>No se puede cambiar</p>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Nombre</label>
              <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} disabled={isLoading} style={{ width: '100%', padding: '0.75rem', border: errors.firstName ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '0.375rem' }} />
              {errors.firstName && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.firstName}</p>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Apellido</label>
              <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} disabled={isLoading} style={{ width: '100%', padding: '0.75rem', border: errors.lastName ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '0.375rem' }} />
              {errors.lastName && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.lastName}</p>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={isLoading} style={{ width: '100%', padding: '0.75rem', border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '0.375rem' }} />
              {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Teléfono</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={isLoading} style={{ width: '100%', padding: '0.75rem', border: errors.phone ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '0.375rem' }} />
              {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Contraseña (opcional)</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} disabled={isLoading} placeholder="Dejar en blanco para mantener la actual" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} disabled={isLoading} style={{ background: '#d1d5db', color: '#374151', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} style={{ background: isLoading ? '#9ca3af' : '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
              {isLoading ? 'Procesando...' : 'Actualizar Cliente'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
