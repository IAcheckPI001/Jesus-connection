
import type { ResolvedPermission } from '../services/permissionService';

export function canAccessDashboard(permission: ResolvedPermission): boolean {
  return permission.canViewAllChildren || permission.viewableClasses.length > 0;
}
