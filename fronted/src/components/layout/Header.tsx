'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">BP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Banco Perú</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/clients"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Clientes
                </Link>
                <Link
                  href="/accounts"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cuentas
                </Link>
              </>
            ) : null}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="hidden sm:block">
                  <Button variant="secondary" size="sm" onClick={logout}>
                    Cerrar sesión
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <Link href="/clients" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                  Clientes
                </Link>
                <Link href="/accounts" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                  Cuentas
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  Cerrar sesión
                </button>
              </>
            ) : null}
          </nav>
        )}
      </div>
    </header>
  );
}
