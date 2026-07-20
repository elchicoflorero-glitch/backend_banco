'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Transaction {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  sourceAccount?: {
    accountNumber: string;
  };
  destinationAccount?: {
    accountNumber: string;
  };
  createdAt: string;
}

interface Account {
  id: string;
  accountNumber: string;
  balance: number;
}

export default function ClientHistory() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');

  useEffect(() => {
    if (!token || user?.role !== 'client') {
      router.push('/login');
      return;
    }

    fetchData();
  }, [token, user, router]);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api';

      // Fetch client's accounts
      const accountsRes = await api.get(`${apiUrl}/accounts`);
      const accountsData = accountsRes.data || [];
      setAccounts(accountsData);

      if (accountsData.length > 0) {
        setSelectedAccountId(accountsData[0].id);
      }

      // Fetch all transactions (we'll filter on frontend)
      const transactionsRes = await api.get(`${apiUrl}/transactions`);
      setTransactions(transactionsRes.data || []);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    if (!selectedAccountId) return transactions;
    
    return transactions.filter(
      (tx) =>
        tx.sourceAccountId === selectedAccountId ||
        tx.destinationAccountId === selectedAccountId
    );
  };

  const getTransactionType = (tx: Transaction) => {
    const account = accounts.find(a => a.id === selectedAccountId);
    if (!account) return 'N/A';
    
    if (tx.sourceAccountId === selectedAccountId) {
      return 'Enviado';
    } else {
      return 'Recibido';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredTransactions = getFilteredTransactions();

  if (!token || user?.role !== 'client') {
    return null;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <Link
            href="/client-portal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            ← Volver
          </Link>
        </div>

        <div
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h1 style={{ margin: '0 0 1.5rem 0', color: '#1f2937', fontSize: '1.875rem' }}>
            📊 Historial de Transacciones
          </h1>

          {error && (
            <div
              style={{
                background: '#fef2f2',
                borderLeft: '4px solid #ef4444',
                padding: '1rem',
                borderRadius: '0.25rem',
                marginBottom: '1.5rem',
                color: '#b91c1c',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              Cargando historial...
            </p>
          ) : accounts.length === 0 ? (
            <p style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
              No tienes cuentas disponibles.
            </p>
          ) : (
            <>
              {/* Account Filter */}
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '0.375rem',
                }}
              >
                <label
                  htmlFor="accountFilter"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    color: '#1f2937',
                    fontSize: '0.875rem',
                  }}
                >
                  Filtrar por cuenta:
                </label>
                <select
                  id="accountFilter"
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountNumber} - S/. {Number(account.balance).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transactions Table */}
              {filteredTransactions.length === 0 ? (
                <p
                  style={{
                    color: '#6b7280',
                    textAlign: 'center',
                    padding: '2rem',
                    fontSize: '0.875rem',
                  }}
                >
                  No hay transacciones para esta cuenta.
                </p>
              ) : (
                <div
                  style={{
                    overflowX: 'auto',
                  }}
                >
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.875rem',
                    }}
                  >
                    <thead>
                      <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                        <th
                          style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: 600,
                            color: '#1f2937',
                          }}
                        >
                          Tipo
                        </th>
                        <th
                          style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: 600,
                            color: '#1f2937',
                          }}
                        >
                          Monto
                        </th>
                        <th
                          style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: 600,
                            color: '#1f2937',
                          }}
                        >
                          Cuenta
                        </th>
                        <th
                          style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: 600,
                            color: '#1f2937',
                          }}
                        >
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx, index) => (
                        <tr
                          key={tx.id}
                          style={{
                            borderBottom: '1px solid #e5e7eb',
                            background: index % 2 === 0 ? '#fff' : '#f9fafb',
                          }}
                        >
                          <td
                            style={{
                              padding: '0.75rem',
                              color: getTransactionType(tx) === 'Enviado' ? '#ef4444' : '#22c55e',
                              fontWeight: 500,
                            }}
                          >
                            {getTransactionType(tx) === 'Enviado' ? '📤 Enviado' : '📥 Recibido'}
                          </td>
                          <td
                            style={{
                              padding: '0.75rem',
                              fontWeight: 500,
                              color: '#1f2937',
                            }}
                          >
                            S/. {Number(tx.amount).toFixed(2)}
                          </td>
                          <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                            {getTransactionType(tx) === 'Enviado'
                              ? tx.destinationAccount?.accountNumber || 'N/A'
                              : tx.sourceAccount?.accountNumber || 'N/A'}
                          </td>
                          <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                            {formatDate(tx.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
