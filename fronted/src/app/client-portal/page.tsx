'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Account {
  id: string;
  accountNumber: string;
  balance: number | string;
  currency: string;
  createdAt: string;
}

export default function ClientPortal() {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'client') {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Fetch client info
        const clientRes = await axios.get(`${apiUrl}/clients/${user.id}`, { headers });
        setClientInfo(clientRes.data);

        // Fetch accounts
        const accountsRes = await axios.get(`${apiUrl}/accounts`, { headers });
        setAccounts(accountsRes.data || []);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, router, token]);

  if (!isAuthenticated || user?.role !== 'client') {
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
        {/* Header con Saludo Personalizado */}
        <div
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#1f2937' }}>
                🏦 BancoPeru
              </h1>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                Portal de Cliente
              </p>
              <h2 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.5rem', color: '#2563eb' }}>
                ¡Bienvenido, {clientInfo?.firstName} {clientInfo?.lastName}!
              </h2>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                  <strong>DNI:</strong> {clientInfo?.dni}
                </p>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                  <strong>Email:</strong> {clientInfo?.email}
                </p>
              </div>
            </div>
            <Link
              href="/login"
              style={{
                color: '#ef4444',
                textDecoration: 'none',
                fontSize: '0.875rem',
                cursor: 'pointer',
                background: '#fee2e2',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
              }}
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
              }}
            >
              ↪ Cerrar sesión
            </Link>
          </div>
        </div>

        {/* Mis Cuentas */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem' }}>
            Mis Cuentas
          </h2>
          {loading ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>Cargando cuentas...</p>
          ) : accounts.length === 0 ? (
            <div
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
                color: '#6b7280',
              }}
            >
              No tienes cuentas registradas
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {accounts.map((account) => (
                <div
                  key={account.id}
                  style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '2px solid #e5e7eb',
                  }}
                >
                  <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                    Número de Cuenta
                  </p>
                  <p style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '1.125rem', fontWeight: 600 }}>
                    {account.accountNumber}
                  </p>
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                      Saldo disponible
                    </p>
                    <p style={{ margin: 0, color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>
                      S/. {(typeof account.balance === 'string' ? parseFloat(account.balance) : account.balance).toFixed(2)}
                    </p>
                  </div>
                  <p style={{ margin: '1rem 0 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>
                    Moneda: {account.currency}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Opciones Principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Transferencias */}
          <Link href="/transfers" style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  background: '#dbeafe',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  fontSize: '1.5rem',
                }}
              >
                💸
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '1.125rem' }}>
                Transferencias
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                Realiza transferencias entre tus cuentas
              </p>
            </div>
          </Link>

          {/* Retiros */}
          <Link href="/withdrawals" style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  background: '#fed7aa',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  fontSize: '1.5rem',
                }}
              >
                💰
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '1.125rem' }}>
                Retiros
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                Realiza retiros de tu cuenta
              </p>
            </div>
          </Link>

          {/* Historial */}
          <Link href="/transactions" style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  background: '#fef3c7',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  fontSize: '1.5rem',
                }}
              >
                📊
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '1.125rem' }}>
                Historial
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                Revisa tu historial de transacciones
              </p>
            </div>
          </Link>

          {/* Perfil */}
          <Link href="/client-portal/profile" style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  background: '#e0e7ff',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  fontSize: '1.5rem',
                }}
              >
                👤
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '1.125rem' }}>
                Mi Perfil
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                Gestiona tu información personal
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
