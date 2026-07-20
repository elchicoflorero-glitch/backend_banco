'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import Link from 'next/link';

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAccounts: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido al Sistema Bancario BancoPeru</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <CardBody>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">{stats.totalClients}</div>
              <p className="text-gray-600 mt-2">Clientes Registrados</p>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">{stats.totalAccounts}</div>
              <p className="text-gray-600 mt-2">Cuentas Activas</p>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">{stats.totalTransactions}</div>
              <p className="text-gray-600 mt-2">Transacciones Realizadas</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Gestión de Clientes" subtitle="Administra los clientes del banco" />
          <CardBody>
            <p className="text-gray-600 mb-4">
              Crea, visualiza, actualiza o elimina clientes de la base de datos.
            </p>
            <Link
              href="/clients"
              className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Ir a Clientes →
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Gestión de Cuentas" subtitle="Administra las cuentas bancarias" />
          <CardBody>
            <p className="text-gray-600 mb-4">
              Crea nuevas cuentas y visualiza el balance de todas las cuentas.
            </p>
            <Link
              href="/accounts"
              className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Ir a Cuentas →
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Realizar Transferencias" subtitle="Transfiere dinero entre cuentas" />
          <CardBody>
            <p className="text-gray-600 mb-4">
              Realiza transferencias de dinero de forma segura entre cuentas.
            </p>
            <Link
              href="/transfers"
              className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Ir a Transferencias →
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Historial de Transacciones"
            subtitle="Visualiza el historial de movimientos"
          />
          <CardBody>
            <p className="text-gray-600 mb-4">
              Consulta el historial completo de transacciones del sistema.
            </p>
            <Link
              href="/transactions"
              className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Ver Historial →
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
