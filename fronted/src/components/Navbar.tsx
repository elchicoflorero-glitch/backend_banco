'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRoles } from '@/hooks/useRoles';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Navbar.module.css';

// Mapeo de roles a nombres en español
const roleNames: Record<string, { label: string; emoji: string }> = {
  admin: { label: 'Administrador', emoji: '👑' },
  manager: { label: 'Gerente', emoji: '👔' },
  user: { label: 'Usuario', emoji: '👤' },
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
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link href="/dashboard" className={styles.logo}>
          <span className={styles.bankIcon}>🏦</span>
          <span className={styles.bankName}>BancoPeru</span>
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          {/* Nav Links */}
          <div className={styles.navLinks}>
            {(isAdmin() || isManager()) && (
              <>
                <Link href="/clients" className={styles.navLink}>
                  👥 Clientes
                </Link>
                <Link href="/accounts" className={styles.navLink}>
                  💳 Cuentas
                </Link>
              </>
            )}

            <Link href="/transfers" className={styles.navLink}>
              💸 Transferencias
            </Link>
            <Link href="/transactions" className={styles.navLink}>
              📊 Historial
            </Link>

            {isAdmin() && (
              <Link href="/audit-logs" className={styles.navLink}>
                🔍 Auditoría
              </Link>
            )}
          </div>

          {/* User Section */}
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <p className={styles.username}>{user.username}</p>
              <div className={styles.roleBadge}>
                <span className={styles.roleEmoji}>{roleInfo.emoji}</span>
                <span className={styles.roleLabel}>{roleInfo.label}</span>
              </div>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Salir
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.mobileMenuBtn}
          aria-expanded={isOpen}
        >
          <svg
            className={styles.menuIcon}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          {/* Mobile User Info */}
          <div className={styles.mobileUserInfo}>
            <p className={styles.mobileUsername}>{user.username}</p>
            <div className={styles.mobileRoleBadge}>
              <span>{roleInfo.emoji} {roleInfo.label}</span>
            </div>
          </div>

          {/* Mobile Links */}
          <div className={styles.mobileLinks}>
            {(isAdmin() || isManager()) && (
              <>
                <Link
                  href="/clients"
                  onClick={() => setIsOpen(false)}
                  className={styles.mobileLink}
                >
                  👥 Clientes
                </Link>
                <Link
                  href="/accounts"
                  onClick={() => setIsOpen(false)}
                  className={styles.mobileLink}
                >
                  💳 Cuentas
                </Link>
              </>
            )}

            <Link
              href="/transfers"
              onClick={() => setIsOpen(false)}
              className={styles.mobileLink}
            >
              💸 Transferencias
            </Link>
            <Link
              href="/transactions"
              onClick={() => setIsOpen(false)}
              className={styles.mobileLink}
            >
              📊 Historial
            </Link>

            {isAdmin() && (
              <Link
                href="/audit-logs"
                onClick={() => setIsOpen(false)}
                className={styles.mobileLink}
              >
                🔍 Auditoría
              </Link>
            )}
          </div>

          {/* Mobile Logout Button */}
          <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}
