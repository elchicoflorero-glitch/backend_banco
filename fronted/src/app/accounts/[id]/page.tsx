'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import axios from 'axios';

interface Account {
  id: number;
  accountNumber: string;
  clientId: number;
  balance: number;
  currency: string;
  createdAt: string;
}

interface Client {
  id: number;
  name: string;
  dni: string;
}

export default function AccountDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const accountId = params.id as string;
  const [account, setAccount] = useState<Account | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchAccount = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.get(`${apiUrl}/accounts/${accountId}`, { headers });
        setAccount(response.data);

        // Fetch client details
        const clientRes = await axios.get(`${apiUrl}/clients/${response.data.clientId}`, {
          headers,
        });
        setClient(clientRes.data);
      } catch (err: any) {
        setError('Error al cargar la cuenta');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [token, router, accountId]);

  if (!token) return null;
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  if (!account)
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        Cuenta no encontrada
      </div>
    );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back Link */}
        <Link
          href="/accounts"
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            display: 'block',
          }}
        >
          ← Volver a Cuentas
        </Link>

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

        {/* Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0,
              marginBottom: '1.5rem',
            }}
          >
            Detalle de Cuenta
          </h1>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Número de Cuenta
              </p>
              <p style={{ color: '#1f2937', fontSize: '1.125rem', fontWeight: '600' }}>
                {account.accountNumber}
              </p>
            </div>

            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Saldo
              </p>
              <p style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {account.currency} {(typeof account.balance === 'string' ? parseFloat(account.balance) : account.balance).toFixed(2)}
              </p>
            </div>

            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Cliente
              </p>
              <p style={{ color: '#1f2937', fontSize: '1rem', fontWeight: '500' }}>
                {client ? `${client.firstName} ${client.lastName}` : 'Cargando...'}
              </p>
              {client && (
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  DNI: {client.dni}
                </p>
              )}
            </div>

            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Fecha de Creación
              </p>
              <p style={{ color: '#1f2937', fontSize: '1rem', fontWeight: '500' }}>
                {new Date(account.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                Moneda
              </p>
              <p style={{ color: '#1f2937', fontSize: '1rem', fontWeight: '500' }}>
                {account.currency}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <Link href="/transfers" style={{ textDecoration: 'none' }}>
              <button
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
                Hacer Transferencia
              </button>
            </Link>
            <Link href={`/transactions`} style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: '#6b7280',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Ver Historial
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
