'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  clientId: string;
}

export default function ClientTransfers() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [transferData, setTransferData] = useState({
    sourceAccountId: '',
    destinationAccountNumber: '',
    amount: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== 'client') {
      router.push('/login');
      return;
    }

    fetchAccounts();
  }, [token, user, router]);

  const fetchAccounts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api';
      const response = await api.get(`${apiUrl}/accounts`);
      const accountsData = response.data || [];
      setAccounts(accountsData);
      
      if (accountsData.length > 0) {
        setTransferData(prev => ({
          ...prev,
          sourceAccountId: accountsData[0].id,
        }));
      }
    } catch (err: any) {
      console.error('Error fetching accounts:', err);
      setError('Error al cargar tus cuentas');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transferData.sourceAccountId || !transferData.destinationAccountNumber || !transferData.amount) {
      setError('Por favor completa todos los campos');
      return;
    }

    const amount = parseFloat(transferData.amount);
    if (amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    const sourceAccount = accounts.find(a => a.id === transferData.sourceAccountId);
    if (!sourceAccount || Number(sourceAccount.balance) < amount) {
      setError('Saldo insuficiente en la cuenta de origen');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api';
      
      const response = await api.post(`${apiUrl}/transfers`, {
        fromAccountNumber: sourceAccount.accountNumber,
        toAccountNumber: transferData.destinationAccountNumber,
        amount: amount,
      });

      setSuccessMessage(`Transferencia exitosa por S/. ${amount.toFixed(2)}`);
      setTransferData({
        sourceAccountId: accounts[0]?.id || '',
        destinationAccountNumber: '',
        amount: '',
      });
      
      // Refresh accounts to show updated balances
      setTimeout(() => fetchAccounts(), 1000);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al realizar la transferencia';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

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
            💸 Realizar Transferencia
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

          {successMessage && (
            <div
              style={{
                background: '#f0fdf4',
                borderLeft: '4px solid #22c55e',
                padding: '1rem',
                borderRadius: '0.25rem',
                marginBottom: '1.5rem',
                color: '#166534',
                fontSize: '0.875rem',
              }}
            >
              {successMessage}
            </div>
          )}

          {loading ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              Cargando tus cuentas...
            </p>
          ) : accounts.length === 0 ? (
            <p style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
              No tienes cuentas disponibles. Por favor contacta al banco.
            </p>
          ) : (
            <form onSubmit={handleTransfer} style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Source Account */}
              <div>
                <label
                  htmlFor="sourceAccount"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    color: '#1f2937',
                    fontSize: '0.875rem',
                  }}
                >
                  Cuenta de Origen
                </label>
                <select
                  id="sourceAccount"
                  value={transferData.sourceAccountId}
                  onChange={(e) => setTransferData({ ...transferData, sourceAccountId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                  required
                >
                  <option value="">Selecciona una cuenta</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountNumber} - S/. {Number(account.balance).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Account Number */}
              <div>
                <label
                  htmlFor="destinationAccount"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    color: '#1f2937',
                    fontSize: '0.875rem',
                  }}
                >
                  Número de Cuenta Destino
                </label>
                <input
                  id="destinationAccount"
                  type="text"
                  placeholder="Número de 20 dígitos"
                  value={transferData.destinationAccountNumber}
                  onChange={(e) =>
                    setTransferData({
                      ...transferData,
                      destinationAccountNumber: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    color: '#1f2937',
                    fontSize: '0.875rem',
                  }}
                >
                  Monto (S/.)
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  value={transferData.amount}
                  onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: submitting ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: 500,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  marginTop: '1rem',
                }}
              >
                {submitting ? 'Procesando...' : 'Realizar Transferencia'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
