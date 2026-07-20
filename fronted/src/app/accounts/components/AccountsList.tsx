'use client';

import Link from 'next/link';
import type { Account } from './AccountFormData';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
}

interface AccountsListProps {
  accounts: Account[];
  clients: Client[];
  loading: boolean;
  onEdit?: (accountId: string) => void;
  onDelete?: (accountId: string, accountNumber: string) => void;
  onDeposit?: (accountId: string, accountNumber: string) => void;
}

export function AccountsList({
  accounts,
  clients,
  loading,
  onEdit,
  onDelete,
  onDeposit,
}: AccountsListProps) {
  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'N/A';
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          Cargando cuentas...
        </div>
      ) : accounts.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          No hay cuentas disponibles
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Número de Cuenta
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Cliente
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Saldo
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Moneda
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Fecha
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1f2937' }}>
                  {account.accountNumber}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1f2937' }}>
                  {getClientName(account.clientId)}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1f2937' }}>
                  S/. {(typeof account.balance === 'string' ? parseFloat(account.balance) : account.balance).toFixed(2)}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1f2937' }}>
                  {account.currency || 'N/A'}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1f2937' }}>
                  {new Date(account.createdAt).toLocaleDateString('es-ES')}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <Link href={`/accounts/${account.id}`} style={{ textDecoration: 'none' }}>
                      <button
                        style={{
                          background: '#2563eb',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        Ver
                      </button>
                    </Link>
                    <button
                      onClick={() => onDeposit?.(account.id, account.accountNumber)}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Depositar
                    </button>
                    <button
                      onClick={() => onEdit?.(account.id)}
                      style={{
                        background: '#f59e0b',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete?.(account.id, account.accountNumber)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
