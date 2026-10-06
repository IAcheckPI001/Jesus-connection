
import type { ResolvedPermission } from '@/src/lib/services/permissionService';

export function canAccessDashboard(permission: ResolvedPermission): boolean {
  return permission.canViewAllChildren || permission.viewableClasses.length > 0;
}
