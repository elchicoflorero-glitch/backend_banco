'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import axios from 'axios';

interface DashboardStats {
  totalUsers: number;
  totalClients: number;
  totalAccounts: number;
  totalBalance: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalClients: 0,
    totalAccounts: 0,
    totalBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Redirect clients to client portal
    if (user?.role === 'client') {
      router.push('/client-portal');
      return;
    }

    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Dashboard is for admins and managers - get all data
        const [clientsRes, accountsRes] = await Promise.all([
          axios.get(`${apiUrl}/clients`, { headers }),
          axios.get(`${apiUrl}/accounts`, { headers }),
        ]);

        const totalBalance =
          accountsRes.data?.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0) || 0;

        setStats({
          totalUsers: 1,
          totalClients: clientsRes.data?.length || 0,
          totalAccounts: accountsRes.data?.length || 0,
          totalBalance,
        });
      } catch (err: any) {
        setError('Error al cargar las estadísticas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, router, user?.role]);

  const StatCard = ({ title, value, icon }: { title: string; value: number | string; icon: string }) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value || 0;
    
    return (
      <div
        style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{title}</p>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
              {title.includes('Saldo') ? `S/. ${numValue.toFixed(2)}` : Math.round(numValue)}
            </p>
          </div>
          <div
            style={{
              fontSize: '2rem',
              background: '#f3f4f6',
              padding: '1rem',
              borderRadius: '0.5rem',
            }}
          >
            {icon}
          </div>
        </div>
      </div>
    );
  };

  const ModuleLink = ({
    href,
    title,
    description,
    icon,
  }: {
    href: string;
    title: string;
    description: string;
    icon: string;
  }) => (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2rem' }}>{icon}</div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );

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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
              Bienvenido, {user?.username} 
              {user?.role === 'admin' && ' - 👑 Administrador'}
              {user?.role === 'manager' && ' - 👔 Gerente'}
              {user?.role === 'user' && ' - 👤 Usuario'}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/login');
            }}
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
            Cerrar Sesión
          </button>
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

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <StatCard title="Usuarios" value={stats.totalUsers} icon="👥" />
          <StatCard title="Clientes" value={stats.totalClients} icon="🏢" />
          <StatCard title="Cuentas" value={stats.totalAccounts} icon="💳" />
          <StatCard title="Saldo Total" value={stats.totalBalance} icon="💰" />
        </div>

        {/* Modules */}
        <div style={{ marginTop: '2rem' }}>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem',
            }}
          >
            Módulos
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Admin/Manager ven gestión de clientes */}
            <ModuleLink
              href="/clients"
              title="Gestión de Clientes"
              description="Crear, editar y ver clientes"
              icon="👤"
            />
            
            {/* Admin/Manager ven gestión de cuentas */}
            <ModuleLink
              href="/accounts"
              title="Gestión de Cuentas"
              description="Crear y gestionar cuentas bancarias"
              icon="💳"
            />
            
            {/* Todos ven transferencias */}
            <ModuleLink
              href="/transfers"
              title="Transferencias"
              description="Realizar transferencias entre cuentas"
              icon="💸"
            />
            
            {/* Todos ven transacciones */}
            <ModuleLink
              href="/transactions"
              title="Historial de Transacciones"
              description="Ver historial y filtrar transacciones"
              icon="📊"
            />
            
            {/* Solo Admin ve auditoría */}
            {user?.role === 'admin' && (
              <ModuleLink
                href="/audit-logs"
                title="Logs de Auditoría"
                description="Ver registros de auditoría del sistema"
                icon="📋"
              />
            )}
            
            {/* Usuario regular ve sus cuentas */}
            {user?.role === 'user' && (
              <ModuleLink
                href="/accounts"
                title="Mis Cuentas"
                description="Ver tus cuentas bancarias"
                icon="💳"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
