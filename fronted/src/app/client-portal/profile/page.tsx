'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface ClientProfile {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  createdAt: string;
}

export default function ClientProfile() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!token || user?.role !== 'client') {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [token, user, router]);

  const fetchProfile = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api';

      // Fetch client profile by DNI (username for clients)
      const clientRes = await api.get(`${apiUrl}/clients/dni/${user?.username}`);
      const clientData = clientRes.data;
      setProfile(clientData);
      setEditData({
        email: clientData.email,
        phone: clientData.phone,
      });

      // Fetch client's accounts
      const accountsRes = await api.get(`${apiUrl}/accounts?clientId=${clientData.id}`);
      setAccounts(accountsRes.data || []);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;

    setSubmitting(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api';

      await api.patch(
        `${apiUrl}/clients/${profile.id}`,
        {
          email: editData.email,
          phone: editData.phone,
        }
      );

      setProfile({
        ...profile,
        email: editData.email,
        phone: editData.phone,
      });

      setSuccessMessage('Perfil actualizado correctamente');
      setEditMode(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar el perfil';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
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
            justifyContent: 'space-between',
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
          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Cerrar sesión
          </button>
        </div>

        {/* Profile Card */}
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
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                width: '4rem',
                height: '4rem',
                background: '#e0e7ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              👤
            </div>
            <div>
              <h1 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem' }}>
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                DNI: {profile?.dni}
              </p>
            </div>
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
            <p style={{ color: '#6b7280' }}>Cargando perfil...</p>
          ) : editMode ? (
            <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    color: '#1f2937',
                    fontSize: '0.875rem',
                  }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
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

              <div>
                <label
                  htmlFor="phone"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    color: '#1f2937',
                    fontSize: '0.875rem',
                  }}
                >
                  Teléfono
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setEditData({
                      email: profile?.email || '',
                      phone: profile?.phone || '',
                    });
                  }}
                  style={{
                    padding: '0.75rem',
                    background: '#e5e7eb',
                    color: '#1f2937',
                    borderRadius: '0.375rem',
                    border: 'none',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.75rem',
                    background: submitting ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    borderRadius: '0.375rem',
                    border: 'none',
                    fontWeight: 500,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  {submitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.375rem',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
                    EMAIL
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937' }}>{profile?.email}</p>
                </div>

                <div
                  style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.375rem',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
                    TELÉFONO
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937' }}>{profile?.phone}</p>
                </div>

                <div
                  style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.375rem',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
                    MIEMBRO DESDE
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937' }}>
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-PE') : 'N/A'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditMode(true)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#2563eb',
                  color: 'white',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Editar perfil
              </button>
            </>
          )}
        </div>

        {/* Accounts Section */}
        <div
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#1f2937', fontSize: '1.25rem' }}>
            💳 Mis Cuentas
          </h2>

          {accounts.length === 0 ? (
            <p
              style={{
                color: '#6b7280',
                textAlign: 'center',
                padding: '2rem',
                fontSize: '0.875rem',
              }}
            >
              No tienes cuentas registradas.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {accounts.map((account) => (
                <div
                  key={account.id}
                  style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                        {account.accountNumber}
                      </p>
                      <p
                        style={{
                          margin: '0.25rem 0 0 0',
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                        }}
                      >
                        Creada: {new Date(account.createdAt).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '1.125rem',
                        fontWeight: 'bold',
                        color: '#2563eb',
                      }}
                    >
                      S/. {Number(account.balance).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
