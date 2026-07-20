'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600">BancoPeru</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/"
                className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/clients"
                className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Clientes
              </Link>
              <Link
                href="/accounts"
                className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Cuentas
              </Link>
              <Link
                href="/transfers"
                className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Transferencias
              </Link>
              <Link
                href="/transactions"
                className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Historial
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">Hola, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
