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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="card max-w-md w-full text-center border-l-4 border-red-500">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta página. Redirigiendo...
          </p>
          <div className="w-2 h-2 bg-red-500 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-4xl">👥</div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Gestión de Clientes
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Administra todos tus clientes en un solo lugar
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mt-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs">
                {filteredClientCount}
              </span>
              {filteredClientCount} cliente{filteredClientCount !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn btn-primary flex items-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl"
          >
            <span>➕</span>
            <span className="hidden sm:inline">Nuevo Cliente</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && <ErrorAlert message={error} />}

        {/* Search Section */}
        <div className="mb-6">
          <ClientSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Clients List */}
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

        {/* Back Link */}
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
