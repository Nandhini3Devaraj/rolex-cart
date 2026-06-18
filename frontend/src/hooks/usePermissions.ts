import { useAuth } from '@/hooks/useAuth';
import { Permission, Role } from '@/types';
import { ROLE_PERMISSIONS } from '@/constants';

export function usePermissions() {
  const { user, hasPermission, hasRole } = useAuth();

  const can = (permission: Permission) => hasPermission(permission);
  const isRole = (roles: Role[]) => hasRole(roles);

  const permissions = user ? ROLE_PERMISSIONS[user.role] ?? [] : [];

  return { user, permissions, can, isRole };
}
