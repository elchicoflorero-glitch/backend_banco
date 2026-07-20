'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRoles } from '@/hooks/useRoles';
import axios from 'axios';
import {
  AccountsList,
  ErrorAlert,
  BackLink,
  CreateAccountModal,
  EditAccountModal,
  DeleteAccountModal,
  DepositModal,
} from './components';
import type { Account } from './components';
import { UserRole } from '@/types';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
}

export default function AccountsPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const { hasRole } = useRoles();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();
  const [selectedAccountNumber, setSelectedAccountNumber] = useState<string>('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const [accountsRes, clientsRes] = await Promise.all([
          axios.get(`${apiUrl}/accounts`, { headers }),
          axios.get(`${apiUrl}/clients`, { headers }),
        ]);

        setAccounts(accountsRes.data || []);
        setClients(clientsRes.data || []);
      } catch (err: any) {
        setError('Error al cargar las cuentas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router]);

  const handleCreateSuccess = (newAccount: Account) => {
    setAccounts([...accounts, newAccount]);
    setError('');
  };

  const handleEditSuccess = (updatedAccount: Account) => {
    setAccounts(accounts.map((a) => (a.id === updatedAccount.id ? updatedAccount : a)));
    setSelectedAccountId(undefined);
    setError('');
  };

  const handleDeleteSuccess = () => {
    setAccounts(accounts.filter((a) => a.id !== selectedAccountId));
    setSelectedAccountId(undefined);
    setSelectedAccountNumber('');
    setError('');
  };

  const handleOpenEdit = (accountId: string) => {
    setSelectedAccountId(accountId);
    setEditModalOpen(true);
  };

  const handleOpenDelete = (accountId: string, accountNumber: string) => {
    setSelectedAccountId(accountId);
    setSelectedAccountNumber(accountNumber);
    setDeleteModalOpen(true);
  };

  const handleOpenDeposit = (accountId: string, accountNumber: string) => {
    setSelectedAccountId(accountId);
    setSelectedAccountNumber(accountNumber);
    setDepositModalOpen(true);
  };

  const handleError = (message: string) => {
    setError(message);
  };

  if (!token) return null;

  // Verificar si el usuario es admin/manager (puede gestionar todas las cuentas)
  // Si es usuario regular, solo puede ver sus propias cuentas
  const canManageAllAccounts = hasRole([UserRole.ADMIN, UserRole.MANAGER]);

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
              {canManageAllAccounts ? 'Gestión de Cuentas' : 'Mis Cuentas'}
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
              Total: {accounts.length} cuentas
            </p>
          </div>
          {canManageAllAccounts && (
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
              + Nueva Cuenta
            </button>
          )}
        </div>

        <ErrorAlert message={error} />

        <AccountsList
          accounts={accounts}
          clients={clients}
          loading={loading}
          onEdit={canManageAllAccounts ? handleOpenEdit : undefined}
          onDelete={canManageAllAccounts ? handleOpenDelete : undefined}
          onDeposit={canManageAllAccounts ? handleOpenDeposit : undefined}
        />

        <BackLink />

        {/* Modales - Solo visible para admin/manager */}
        {canManageAllAccounts && (
          <>
            <CreateAccountModal
              isOpen={createModalOpen}
              clients={clients}
              token={token}
              onClose={() => setCreateModalOpen(false)}
              onSuccess={handleCreateSuccess}
              onError={handleError}
            />

            <EditAccountModal
              isOpen={editModalOpen}
              accountId={selectedAccountId}
              token={token}
              onClose={() => {
                setEditModalOpen(false);
                setSelectedAccountId(undefined);
              }}
              onSuccess={handleEditSuccess}
              onError={handleError}
            />

            <DeleteAccountModal
              isOpen={deleteModalOpen}
              accountId={selectedAccountId}
              accountNumber={selectedAccountNumber}
              token={token}
              onClose={() => {
                setDeleteModalOpen(false);
                setSelectedAccountId(undefined);
                setSelectedAccountNumber('');
              }}
              onSuccess={handleDeleteSuccess}
              onError={handleError}
            />

            <DepositModal
              isOpen={depositModalOpen}
              accountId={selectedAccountId}
              accountNumber={selectedAccountNumber}
              token={token}
              onClose={() => {
                setDepositModalOpen(false);
                setSelectedAccountId(undefined);
                setSelectedAccountNumber('');
              }}
              onSuccess={() => {
                // Recargar las cuentas después del depósito
                setLoading(true);
                const fetchAccounts = async () => {
                  try {
                    const headers = { Authorization: `Bearer ${token}` };
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    const response = await axios.get(`${apiUrl}/accounts`, { headers });
                    setAccounts(response.data || []);
                  } catch (err: any) {
                    console.error(err);
                  } finally {
                    setLoading(false);
                  }
                };
                fetchAccounts();
              }}
              onError={handleError}
            />
          </>
        )}
      </div>
    </div>
  );
}
