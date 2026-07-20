'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import axios from 'axios';

interface Transaction {
  id: number;
  sourceAccount?: {
    accountNumber: string;
    client: any;
  };
  destinationAccount?: {
    accountNumber: string;
    client: any;
  };
  fromAccount?: string;
  toAccount?: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
}

interface Filters {
  accountNumber: string;
  startDate: string;
  endDate: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Filters>({
    accountNumber: '',
    startDate: '',
    endDate: '',
  });
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Fetch accounts for filter dropdown
        const accountsRes = await axios.get(`${apiUrl}/accounts`, { headers });
        setAccounts(accountsRes.data || []);

        // Fetch transactions
        const params = new URLSearchParams();
        if (filters.accountNumber) params.append('accountNumber', filters.accountNumber);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const transUrl = `${apiUrl}/transactions${params.toString() ? '?' + params.toString() : ''}`;
        const transRes = await axios.get(transUrl, { headers });
        setTransactions(transRes.data || []);
      } catch (err: any) {
        setError('Error al cargar las transacciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router, filters]);

  const getTransactionTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'transfer':
        return '💸';
      case 'deposit':
        return '📥';
      case 'withdrawal':
        return '📤';
      default:
        return '💰';
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'transfer':
        return 'Transferencia';
      case 'deposit':
        return 'Depósito';
      case 'withdrawal':
        return 'Retiro';
      default:
        return type || 'Otro';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return '#22c55e';
      case 'pending':
        return '#f59e0b';
      case 'failed':
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setLoading(true);
  };

  if (!token) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            marginBottom: '2rem',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            Historial de Transacciones
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Total: {transactions.length} transacciones
          </p>
        </div>

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

        {/* Filters */}
        <div
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem',
              marginTop: 0,
            }}
          >
            Filtros
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Cuenta
              </label>
              <select
                value={filters.accountNumber}
                onChange={(e) => handleFilterChange('accountNumber', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  background: 'white',
                }}
              >
                <option value="">Todas las cuentas</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Fecha Fin
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Transactions List */}
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
              Cargando transacciones...
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              No hay transacciones disponibles
            </div>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        whiteSpace: 'nowrap',
                        minWidth: '140px',
                      }}
                    >
                      Fecha
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        whiteSpace: 'nowrap',
                        minWidth: '120px',
                      }}
                    >
                      De
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        whiteSpace: 'nowrap',
                        minWidth: '120px',
                      }}
                    >
                      Para
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'right',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        whiteSpace: 'nowrap',
                        minWidth: '100px',
                      }}
                    >
                      Monto
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        whiteSpace: 'nowrap',
                        minWidth: '110px',
                      }}
                    >
                      Tipo
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        whiteSpace: 'nowrap',
                        minWidth: '110px',
                      }}
                    >
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        '&:hover': { background: '#f9fafb' },
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                    >
                      <td
                        style={{
                          padding: '1rem',
                          fontSize: '0.875rem',
                          color: '#1f2937',
                          whiteSpace: 'nowrap',
                        }}
                        title={new Date(transaction.createdAt).toLocaleString('es-ES')}
                      >
                        {new Date(transaction.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          fontSize: '0.875rem',
                          color: '#1f2937',
                          fontFamily: 'monospace',
                          whiteSpace: 'nowrap',
                          maxWidth: '120px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={transaction.sourceAccount?.accountNumber || transaction.fromAccount || '-'}
                      >
                        {transaction.sourceAccount?.accountNumber || transaction.fromAccount || '-'}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          fontSize: '0.875rem',
                          color: '#1f2937',
                          fontFamily: 'monospace',
                          whiteSpace: 'nowrap',
                          maxWidth: '120px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={transaction.destinationAccount?.accountNumber || transaction.toAccount || '-'}
                      >
                        {transaction.destinationAccount?.accountNumber || transaction.toAccount || '-'}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          fontSize: '0.875rem',
                          color: '#1f2937',
                          fontWeight: '600',
                          textAlign: 'right',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        S/. {(typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount).toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getTransactionTypeIcon(transaction.type)}
                          {getTransactionTypeLabel(transaction.type)}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: getStatusColor(transaction.status),
                            background: getStatusColor(transaction.status) + '20',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {transaction.status === 'completed' || transaction.status === 'success'
                            ? 'Completada'
                            : transaction.status === 'pending'
                              ? 'Pendiente'
                              : transaction.status === 'failed' || transaction.status === 'error'
                                ? 'Fallida'
                                : transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div style={{ marginTop: '1.5rem' }}>
          <Link
            href="/dashboard"
            style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem' }}
          >
            ← Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
