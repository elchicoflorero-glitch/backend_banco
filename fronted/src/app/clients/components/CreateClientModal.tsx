'use client';

import { useState } from 'react';
import axios from 'axios';
import { Modal } from './Modal';
import { useToast } from '@/contexts/ToastContext';
import type { ClientFormData } from './ClientFormData';

interface CreateClientModalProps {
  isOpen: boolean;
  token: string;
  onClose: () => void;
  onSuccess: (client: any) => void;
  onError: (message: string) => void;
}

export function CreateClientModal({
  isOpen,
  token,
  onClose,
  onSuccess,
  onError,
}: CreateClientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.dni) {
      newErrors.dni = 'DNI es requerido';
    } else if (formData.dni.length !== 8) {
      newErrors.dni = 'DNI debe tener exactamente 8 dígitos';
    }
    if (!formData.firstName) newErrors.firstName = 'Nombre es requerido';
    if (!formData.lastName) newErrors.lastName = 'Apellido es requerido';
    if (!formData.email) newErrors.email = 'Email es requerido';
    if (!formData.phone) newErrors.phone = 'Teléfono es requerido';
    if (!formData.password) newErrors.password = 'Contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('error', 'Por favor completa todos los campos correctamente');
      return;
    }

    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/clients`, formData, { headers });
      
      addToast('success', `¡Cliente ${formData.firstName} ${formData.lastName} creado exitosamente!`);
      onSuccess(response.data);
      setFormData({ dni: '', firstName: '', lastName: '', email: '', phone: '', password: '' });
      onClose();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al crear el cliente';
      addToast('error', errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} title="Nuevo Cliente" onClose={onClose} size="md">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>DNI (8 dígitos)</label>
            <input type="text" maxLength={8} value={formData.dni} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} disabled={isLoading} style={{ width: '100%', padding: '0.75rem', border: errors.dni ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '0.375rem' }} />
            {errors.dni && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.dni}</p>}
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Contraseña</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} disabled={isLoading} style={{ width: '100%', padding: '0.75rem', border: errors.password ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '0.375rem' }} />
            {errors.password && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</p>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} disabled={isLoading} style={{ background: '#d1d5db', color: '#374151', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button type="submit" disabled={isLoading} style={{ background: isLoading ? '#9ca3af' : '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
            {isLoading ? 'Procesando...' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
