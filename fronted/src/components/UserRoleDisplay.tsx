'use client';

import { UserRole } from '@/types';

interface UserRoleDisplayProps {
  role: UserRole | string;
  format?: 'label' | 'emoji-label' | 'emoji-only' | 'full';
  className?: string;
}

const roleConfig = {
  [UserRole.ADMIN]: {
    label: 'Administrador',
    emoji: '👑',
    color: '#ef4444',
    bgColor: '#fee2e2',
  },
  [UserRole.MANAGER]: {
    label: 'Gerente',
    emoji: '👔',
    color: '#3b82f6',
    bgColor: '#dbeafe',
  },
  [UserRole.USER]: {
    label: 'Usuario',
    emoji: '👤',
    color: '#10b981',
    bgColor: '#d1fae5',
  },
};

/**
 * Component to display user role in Spanish with different formats
 *
 * @param role - User role (admin, manager, user)
 * @param format - Display format:
 *   - 'label': "Administrador"
 *   - 'emoji-label': "👑 Administrador"
 *   - 'emoji-only': "👑"
 *   - 'full': "👑 Administrador" (colored badge)
 */
export function UserRoleDisplay({
  role,
  format = 'emoji-label',
  className = '',
}: UserRoleDisplayProps) {
  const config = roleConfig[role as UserRole] || roleConfig[UserRole.USER];

  switch (format) {
    case 'emoji-only':
      return <span className={className}>{config.emoji}</span>;

    case 'label':
      return <span className={className}>{config.label}</span>;

    case 'emoji-label':
      return (
        <span className={className}>
          {config.emoji} {config.label}
        </span>
      );

    case 'full':
      return (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${className}`}
          style={{ background: config.bgColor, color: config.color }}
        >
          <span>{config.emoji}</span>
          <span>{config.label}</span>
        </span>
      );

    default:
      return <span className={className}>{config.label}</span>;
  }
}
