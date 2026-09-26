

// lib/permissions/classPermission.ts
import { ADMIN_VIEW_ROLES, ROLES } from '../constants/roles';
import type { ResolvedPermission } from '../services/permissionService';

export type ClassAction = 'view' | 'create' | 'update' | 'delete';

export function canPerformClassAction(
  permission: ResolvedPermission,
  classId: string,
  action: ClassAction
): boolean {
  const isAdminRole = permission.roles.some((r) =>
    (ADMIN_VIEW_ROLES as readonly string[]).includes(r)
  );

  // Ban Hành Chánh / Xứ đoàn trưởng / Cha: chỉ được "view", trên MỌI lớp
  if (isAdminRole) {
    return action === 'view';
  }

  // Huynh Trưởng: full CRUD nhưng CHỈ trên đúng lớp mình phụ trách
  const isAssignedHuynhTruong =
    permission.roles.includes(ROLES.CHU_NHIEM_LOP || ROLES.PHU_LOP) &&
    permission.assignedClasses.includes(classId);

  if (isAssignedHuynhTruong) {
    return true; // được cả view/create/update/delete
  }

  return false;
}