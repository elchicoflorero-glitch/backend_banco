'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import axios from 'axios';

interface Client {
  id: number;
  dni: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const clientId = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ dni: '', name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchClient = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/clients/${clientId}`, { headers });
        setClient(response.data);
        setFormData({
          dni: response.data.dni,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
        });
      } catch (err: any) {
        setError('Error al cargar el cliente');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [token, router, clientId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.put(`${apiUrl}/clients/${clientId}`, formData, { headers });
      setClient(response.data);
      setEditing(false);
    } catch (err: any) {
      setError('Error al guardar los cambios');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!token) return null;
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  if (!client)
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        Cliente no encontrado
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
          href="/clients"
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            display: 'block',
          }}
        >
          ← Volver a Clientes
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {client.name}
            </h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
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
                Editar
              </button>
            )}
          </div>

          {!editing ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  DNI
                </p>
                <p style={{ color: '#1f2937', fontSize: '1rem', fontWeight: 500 }}>{client.dni}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Email
                </p>
                <p style={{ color: '#1f2937', fontSize: '1rem', fontWeight: 500 }}>
                  {client.email}
                </p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Teléfono
                </p>
                <p style={{ color: '#1f2937', fontSize: '1rem', fontWeight: 500 }}>
                  {client.phone}
                </p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Fecha de Creación
                </p>
                <p style={{ color: '#1f2937', fontSize: '1rem', fontWeight: 500 }}>
                  {new Date(client.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          ) : (
            <form
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                  }}
                >
                  DNI
                </label>
                <input
                  type="text"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
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
                    fontWeight: 500,
                    color: '#374151',
                  }}
                >
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    fontWeight: 500,
                    color: '#374151',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    fontWeight: 500,
                    color: '#374151',
                  }}
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
            </form>
          )}

          {editing && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditing(false)}
                style={{
                  background: '#d1d5db',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: '#22c55e',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
