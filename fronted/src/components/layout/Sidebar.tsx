'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Clientes', href: '/clients', icon: '👥' },
    { name: 'Cuentas', href: '/accounts', icon: '🏦' },
    { name: 'Transferencias', href: '/transfers', icon: '💸' },
    { name: 'Historial', href: '/transactions', icon: '📋' },
  ];

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 md:bg-gray-900 md:text-white md:pt-16">
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
