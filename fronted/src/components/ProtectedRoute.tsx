'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[] | UserRole;
  fallback?: React.ReactNode;
}

/**
 * Component to protect routes based on user roles
 * Redirects to login if not authenticated
 * Shows fallback or redirects to dashboard if insufficient permissions
 */
export function ProtectedRoute({
  children,
  requiredRoles,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRoles) {
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      const hasRequiredRole = roles.includes(user?.role as UserRole);

      if (!hasRequiredRole) {
        if (fallback) {
          return;
        }
        router.push('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, loading, user?.role, requiredRoles, router, fallback]);

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

  if (requiredRoles) {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const hasRequiredRole = roles.includes(user?.role as UserRole);

    if (!hasRequiredRole) {
      return fallback ? (
        <>{fallback}</>
      ) : null;
    }
  }

  return <>{children}</>;
}
