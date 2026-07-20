'use client';

import { useRoles } from '@/hooks/useRoles';
import { UserRole } from '@/types';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[] | UserRole;
  fallback?: React.ReactNode;
}

/**
 * Component for conditional rendering based on user role
 * Does not redirect, just shows/hides content
 */
export function RoleGuard({
  children,
  requiredRoles,
  fallback,
}: RoleGuardProps) {
  const { hasRole } = useRoles();

  if (!requiredRoles) {
    return <>{children}</>;
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  const hasAccess = roles.some((role) => hasRole(role));

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
