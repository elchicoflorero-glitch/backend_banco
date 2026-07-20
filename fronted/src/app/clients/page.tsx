'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRoles } from '@/hooks/useRoles';
import axios from 'axios';
import {
  ClientSearch,
  ClientsList,
  ErrorAlert,
  BackLink,
  CreateClientModal,
  EditClientModal,
  DeleteClientModal,
} from './components';
import { UserRole } from '@/types';

interface Client {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const { hasRole } = useRoles();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const [selectedClientName, setSelectedClientName] = useState<string>('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Verificar permisos
    if (!hasRole([UserRole.ADMIN, UserRole.MANAGER])) {
      setError('No tienes permisos para acceder a esta página');
      setTimeout(() => router.push('/dashboard'), 2000);
      return;
    }

    const fetchClients = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/clients`, { headers });
        setClients(response.data || []);
      } catch (err: any) {
        setError('Error al cargar los clientes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token, router, hasRole]);

  const handleCreateSuccess = (newClient: Client) => {
    setClients([newClient, ...clients]);
    setError('');
    // Mostrar notificación de éxito (opcional)
  };

  const handleEditSuccess = (updatedClient: Client) => {
    setClients(clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
    setSelectedClientId(undefined);
    setError('');
  };

  const handleDeleteSuccess = () => {
    setClients(clients.filter((c) => c.id !== selectedClientId));
    setSelectedClientId(undefined);
    setSelectedClientName('');
    setError('');
  };

  const handleOpenEdit = (clientId: string) => {
    setSelectedClientId(clientId);
    setEditModalOpen(true);
  };

  const handleOpenDelete = (clientId: string, clientName: string) => {
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    setDeleteModalOpen(true);
  };

  const handleError = (message: string) => {
    setError(message);
  };

  const filteredClientCount = clients.filter(
    (client) =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.dni.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).length;

  if (!token) return null;

  if (error && error.includes('No tienes permisos')) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f9fafb',
        }}
      >
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#991b1b', fontSize: '1.125rem', fontWeight: 500 }}>
            ❌ Acceso Denegado
          </p>
          <p style={{ color: '#7f1d1d', marginTop: '0.5rem' }}>
            No tienes permisos para acceder a esta página. Redirigiendo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Gestión de Clientes
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
              Total: {filteredClientCount} clientes
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            + Nuevo Cliente
          </button>
        </div>

        <ErrorAlert message={error} />
        <ClientSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <ClientsList
          clients={clients}
          loading={loading}
          searchTerm={searchTerm}
          token={token}
          onClientDeleted={() => {}}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onError={handleError}
        />
        <BackLink />

        {/* Modales */}
        <CreateClientModal
          isOpen={createModalOpen}
          token={token}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
          onError={handleError}
        />

        <EditClientModal
          isOpen={editModalOpen}
          clientId={selectedClientId}
          token={token}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedClientId(undefined);
          }}
          onSuccess={handleEditSuccess}
          onError={handleError}
        />

        <DeleteClientModal
          isOpen={deleteModalOpen}
          clientId={selectedClientId}
          clientName={selectedClientName}
          token={token}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedClientId(undefined);
            setSelectedClientName('');
          }}
          onSuccess={handleDeleteSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}
