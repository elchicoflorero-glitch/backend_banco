'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRoles } from '@/hooks/useRoles';
import axios from 'axios';

interface AuditLog {
  id: string;
  operation: string;
  userId: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
  createdAt: string;
}

export default function AuditLogsPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { isAdmin } = useRoles();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterOperation, setFilterOperation] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (!isAdmin()) {
      setError('No tienes permisos para acceder a esta página');
      setTimeout(() => router.push('/dashboard'), 2000);
      return;
    }

    const fetchLogs = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/audit-logs`, { headers });
        setLogs(response.data || []);
      } catch (err: any) {
        setError('Error al cargar los logs de auditoría');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token, router, isAdmin]);

  if (!token) return null;

  if (error && error.includes('No tienes permisos')) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f9fafb',
        }}
      >
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#991b1b', fontSize: '1.125rem', fontWeight: 500 }}>
            ❌ Acceso Denegado
          </p>
          <p style={{ color: '#7f1d1d', marginTop: '0.5rem' }}>
            Solo los administradores pueden ver los logs de auditoría. Redirigiendo...
          </p>
        </div>
      </div>
    );
  }

  const filteredLogs = filterOperation
    ? logs.filter((log) => log.operation === filterOperation)
    : logs;

  const operations = Array.from(new Set(logs.map((log) => log.operation)));

  const operationColors: Record<string, string> = {
    CREATE: '#10b981',
    UPDATE: '#f59e0b',
    DELETE: '#ef4444',
    TRANSFER: '#3b82f6',
    LOGIN: '#8b5cf6',
    WITHDRAWAL: '#dc2626',
    DEPOSIT: '#059669',
    ACCOUNT_CREATE: '#06b6d4',
    CLIENT_CREATE: '#0ea5e9',
    CLIENT_UPDATE: '#f97316',
    CLIENT_DELETE: '#d946ef',
  };

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
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            📋 Logs de Auditoría
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Total: {filteredLogs.length} registros
          </p>
        </div>

        {/* Filter */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
            Filtrar por operación:
          </label>
          <select
            value={filterOperation}
            onChange={(e) => setFilterOperation(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
            }}
          >
            <option value="">Todas las operaciones</option>
            {operations.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>

        {/* Error Alert */}
        {error && !error.includes('No tienes permisos') && (
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

        {/* Logs Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#6b7280' }}>Cargando logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#6b7280' }}>No hay logs disponibles</p>
          </div>
        ) : (
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              overflow: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem',
              }}
            >
              <thead style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Operación</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Usuario</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Entidad</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Fecha/Hora</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      background: index % 2 === 0 ? 'white' : '#f9fafb',
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          background: operationColors[log.operation] || '#6b7280',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {log.operation}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#1f2937' }}>{log.userId}</td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {log.entityType && log.entityId ? (
                        <span>{log.entityType}</span>
                      ) : (
                        <span style={{ color: '#d1d5db' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {new Date(log.createdAt).toLocaleString('es-PE')}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <details>
                        <summary style={{ cursor: 'pointer', color: '#2563eb' }}>Ver</summary>
                        <pre
                          style={{
                            background: '#f3f4f6',
                            padding: '0.5rem',
                            marginTop: '0.5rem',
                            fontSize: '0.75rem',
                            borderRadius: '0.25rem',
                            maxWidth: '300px',
                            overflow: 'auto',
                          }}
                        >
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Back Link */}
        <div style={{ marginTop: '2rem' }}>
          <a
            href="/dashboard"
            style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
