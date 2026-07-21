'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRoles } from '@/hooks/useRoles';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mapeo de roles a nombres en español
const roleNames: Record<string, { label: string; emoji: string; color: string }> = {
  admin: { label: 'Administrador', emoji: '👑', color: 'from-red-600 to-red-500' },
  manager: { label: 'Gerente', emoji: '👔', color: 'from-blue-600 to-blue-500' },
  user: { label: 'Usuario', emoji: '👤', color: 'from-green-600 to-green-500' },
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
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-2xl">🏦</div>
            <span className="text-xl font-bold text-white hidden sm:inline">BancoPeru</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Admin/Manager Links */}
            {(isAdmin() || isManager()) && (
              <>
                <Link
                  href="/clients"
                  className="text-gray-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  Clientes
                </Link>
                <Link
                  href="/accounts"
                  className="text-gray-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  Cuentas
                </Link>
              </>
            )}

            {/* Common Links */}
            <Link
              href="/transfers"
              className="text-gray-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-all"
            >
              Transferencias
            </Link>
            <Link
              href="/transactions"
              className="text-gray-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-all"
            >
              Historial
            </Link>

            {/* Admin Only */}
            {isAdmin() && (
              <Link
                href="/audit-logs"
                className="text-gray-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-all"
              >
                Auditoría
              </Link>
            )}

            {/* User Info & Logout */}
            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user.username}</p>
                <div
                  className={`text-xs font-semibold rounded-full px-2 py-1 bg-gradient-to-r ${roleInfo.color} text-white inline-block`}
                >
                  {roleInfo.emoji} {roleInfo.label}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-all hover:shadow-lg"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
              aria-expanded="false"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-700 bg-slate-800">
            {/* Mobile User Info */}
            <div className="px-4 py-3 border-b border-slate-700">
              <p className="text-sm font-semibold text-white">{user.username}</p>
              <div
                className={`text-xs font-semibold rounded-full px-2 py-1 bg-gradient-to-r ${roleInfo.color} text-white inline-block mt-2`}
              >
                {roleInfo.emoji} {roleInfo.label}
              </div>
            </div>

            {/* Mobile Links */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              {(isAdmin() || isManager()) && (
                <>
                  <Link
                    href="/clients"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-sm font-medium transition-all"
                  >
                    Clientes
                  </Link>
                  <Link
                    href="/accounts"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-sm font-medium transition-all"
                  >
                    Cuentas
                  </Link>
                </>
              )}

              <Link
                href="/transfers"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-sm font-medium transition-all"
              >
                Transferencias
              </Link>
              <Link
                href="/transactions"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-sm font-medium transition-all"
              >
                Historial
              </Link>

              {isAdmin() && (
                <Link
                  href="/audit-logs"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  Auditoría
                </Link>
              )}
            </div>

            {/* Mobile Logout Button */}
            <div className="px-2 pb-3">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-all"
              >
                Salir
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
