

// lib/permissions/classPermission.ts
import type { ResolvedPermission } from '../services/permissionService';

export type ClassAction = 'view' | 'create' | 'update' | 'delete';

export function canPerformClassAction(
  permission: ResolvedPermission,
  classId: string,
  action: ClassAction
): boolean {
  if (action === 'view') {
    return permission.canViewAllChildren || permission.viewableClasses.includes(classId);
  }

  if (action === 'update') {
    return permission.canManageAllChildren || permission.editableClasses.includes(classId);
  }

  // Chỉ Ban Hành Chánh (BAN_HC) được thêm hoặc xóa thiếu nhi.
  return permission.canManageAllChildren;
}

export function canViewPersonnel(permission: ResolvedPermission): boolean {
  return permission.canViewPersonnel;
}
