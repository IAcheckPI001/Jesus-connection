
import { ADMIN_VIEW_ROLES, ROLES } from '../constants/roles';
import type { ResolvedPermission } from '../services/permissionService';

export function canAccessDashboard({ roles, assignedClasses }: ResolvedPermission): boolean {
  const isAdminRole = roles.some((r) => (ADMIN_VIEW_ROLES as readonly string[]).includes(r));
  if (isAdminRole) return true;

  const isHuynhTruongWithClass =
    roles.includes(ROLES.CHU_NHIEM_LOP || ROLES.PHU_LOP) && assignedClasses.length > 0;

  return isHuynhTruongWithClass;
  // Huynh Trưởng chưa có lớp → false → xử lý như Phụ huynh ở tầng route/frontend
}