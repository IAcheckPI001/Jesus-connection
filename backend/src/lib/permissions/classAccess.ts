import type { ResolvedPermission } from '@/src/lib/services/permissionService';
import { canViewClass } from '@/src/lib/permissions/classPermission';
import { requireAuth } from '@/src/lib/session/requireAuth';

export type ClassAccessResult =
  | { ok: true; permission: ResolvedPermission & { taiKhoanId: string } }
  | { ok: false; status: 401 | 403; message: string };

export async function requireClassViewAccess(classId: string): Promise<ClassAccessResult> {
  const permission = await requireAuth();
  if (!permission) return { ok: false, status: 401, message: 'Chưa đăng nhập.' };
  if (!canViewClass(permission, classId)) {
    return { ok: false, status: 403, message: 'Không có quyền xem lớp này.' };
  }
  return { ok: true, permission };
}

/** Ghi theo phân công lớp; quyền xem toàn cục không cấp quyền import/sửa. */
export async function requireClassAccess(classId: string): Promise<ClassAccessResult> {
  const permission = await requireAuth();
  if (!permission) return { ok: false, status: 401, message: 'Chưa đăng nhập.' };
  if (!permission.editableClasses.includes(classId)) {
    return { ok: false, status: 403, message: 'Không có quyền chỉnh sửa lớp này.' };
  }
  return { ok: true, permission };
}
