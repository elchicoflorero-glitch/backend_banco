import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

export function useRoles() {
  const { user } = useAuth();

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role as UserRole);
  };

  const isAdmin = (): boolean => hasRole(UserRole.ADMIN);
  const isManager = (): boolean => hasRole(UserRole.MANAGER);
  const isUser = (): boolean => hasRole(UserRole.USER);

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role as UserRole);
  };

  const hasAllRoles = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role as UserRole);
  };

  const canManageClients = (): boolean => {
    return hasRole([UserRole.ADMIN, UserRole.MANAGER]);
  };

  const canManageAccounts = (): boolean => {
    return hasRole([UserRole.ADMIN, UserRole.MANAGER]);
  };

  const canTransfer = (): boolean => {
    return true; // Todos pueden hacer transferencias
  };

  const canViewAuditLogs = (): boolean => {
    return hasRole(UserRole.ADMIN);
  };

  const canDeleteClient = (): boolean => {
    return hasRole(UserRole.ADMIN);
  };

  const canDeleteAccount = (): boolean => {
    return hasRole(UserRole.ADMIN);
  };

  return {
    hasRole,
    isAdmin,
    isManager,
    isUser,
    hasAnyRole,
    hasAllRoles,
    canManageClients,
    canManageAccounts,
    canTransfer,
    canViewAuditLogs,
    canDeleteClient,
    canDeleteAccount,
    userRole: user?.role,
  };
}
