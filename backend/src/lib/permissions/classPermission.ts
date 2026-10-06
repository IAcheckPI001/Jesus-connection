

// lib/permissions/classPermission.ts
import type { ResolvedPermission } from '@/src/lib/services/permissionService';

export function canViewClass(permission: ResolvedPermission, classId: string): boolean {
  return permission.canViewAllChildren || permission.viewableClasses.includes(classId);
}
