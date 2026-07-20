'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRoles } from '@/hooks/useRoles';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mapeo de roles a nombres en español
const roleNames: Record<string, { label: string; emoji: string; color: string }> = {
  admin: { label: 'Administrador', emoji: '👑', color: '#ef4444' },
  manager: { label: 'Gerente', emoji: '👔', color: '#3b82f6' },
  user: { label: 'Usuario', emoji: '👤', color: '#10b981' },
};

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { isAdmin, isManager } = useRoles();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const roleInfo = roleNames[user.role as string] || roleNames.user;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="text-2xl">🏦</div>
            <span className="text-xl font-bold text-gray-900">BancoPeru</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Admin/Manager Links */}
            {(isAdmin() || isManager()) && (
              <>
                <Link
                  href="/clients"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Clientes
                </Link>
                <Link
                  href="/accounts"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Cuentas
                </Link>
              </>
            )}

            {/* Common Links */}
            <Link
              href="/transfers"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Transferencias
            </Link>
            <Link
              href="/transactions"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Historial
            </Link>

            {/* Admin Only */}
            {isAdmin() && (
              <Link
                href="/audit-logs"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Auditoría
              </Link>
            )}

            {/* User Info */}
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p
                  className="text-xs font-semibold rounded-full px-2 py-1"
                  style={{ background: roleInfo.color + '20', color: roleInfo.color }}
                >
                  {roleInfo.emoji} {roleInfo.label}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {/* Mobile User Info */}
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p
                className="text-xs font-semibold rounded-full px-2 py-1 inline-block mt-1"
                style={{ background: roleInfo.color + '20', color: roleInfo.color }}
              >
                {roleInfo.emoji} {roleInfo.label}
              </p>
            </div>

            {(isAdmin() || isManager()) && (
              <>
                <Link
                  href="/clients"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Clientes
                </Link>
                <Link
                  href="/accounts"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cuentas
                </Link>
              </>
            )}

            <Link
              href="/transfers"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Transferencias
            </Link>
            <Link
              href="/transactions"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Historial
            </Link>

            {isAdmin() && (
              <Link
                href="/audit-logs"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Auditoría
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
