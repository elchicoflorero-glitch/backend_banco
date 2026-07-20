'use client';

import { UserRole } from '@/types';

interface RoleBadgeProps {
  role: UserRole | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const roleConfig = {
  [UserRole.ADMIN]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Administrador',
    emoji: '👑',
  },
  [UserRole.MANAGER]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Gerente',
    emoji: '👔',
  },
  [UserRole.USER]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Usuario',
    emoji: '👤',
  },
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function RoleBadge({
  role,
  size = 'md',
  showLabel = true,
}: RoleBadgeProps) {
  const config = roleConfig[role as UserRole] || roleConfig[UserRole.USER];
  const sizeClass = sizeConfig[size];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-medium ${config.bg} ${config.text} ${sizeClass}`}
    >
      <span>{config.emoji}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
