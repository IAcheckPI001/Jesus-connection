

import { prisma } from '@/src/lib/prisma';
import {
  BAN_HC_CHILD_MANAGER_ROLES,
  BAN_HC_CODE,
  GLOBAL_READ_ROLES,
  ROLES,
  ROLES_WITHOUT_CLASS_ASSIGNMENTS,
} from '@/src/lib/constants/roles';

export type ResolvedPermission = {
  roles: string[];
  assignedClasses: string[];
  viewableClasses: string[];
  editableClasses: string[];
  canViewAllChildren: boolean;
};

export async function resolvePermissions(taiKhoanId: string): Promise<ResolvedPermission> {
  const nhanSu = await prisma.nhan_su.findUnique({
    where: { id_tai_khoan: taiKhoanId },
    include: {
      phan_cong_nhiem_vu: {
        where: {
          trang_thai: 'dang_phan_cong',
        },
        include: {
          vai_tro: true,
          ban: { select: { ma_ban: true } },
        },
      },
    },
  });

  const emptyPermissions: ResolvedPermission = {
    roles: [],
    assignedClasses: [],
    viewableClasses: [],
    editableClasses: [],
    canViewAllChildren: false,
  };
  if (!nhanSu) return emptyPermissions;

  const assignments = nhanSu.phan_cong_nhiem_vu;
  const assignedRoles = [...new Set(assignments.map((assignment) => assignment.vai_tro.ma_vai_tro))];
  const hasGlobalReadRole = assignedRoles.some((role) =>
    (GLOBAL_READ_ROLES as readonly string[]).includes(role),
  );
  const managesAllChildren = assignments.some((assignment) =>
    assignment.pham_vi === 'ban'
      && assignment.ban?.ma_ban === BAN_HC_CODE
      && (BAN_HC_CHILD_MANAGER_ROLES as readonly string[]).includes(assignment.vai_tro.ma_vai_tro),
  );
  const blocksClassAssignments = assignedRoles.some((role) =>
    (ROLES_WITHOUT_CLASS_ASSIGNMENTS as readonly string[]).includes(role),
  );

  const effectiveAssignments = blocksClassAssignments
    ? assignments.filter((assignment) => assignment.vai_tro.ma_vai_tro !== ROLES.CHU_NHIEM_LOP
      && assignment.vai_tro.ma_vai_tro !== ROLES.PHU_LOP)
    : assignments;
  const roles = [...new Set(effectiveAssignments.map((assignment) => assignment.vai_tro.ma_vai_tro))];

  const assignedClasses = [...new Set(effectiveAssignments
    .filter((assignment) =>
      (assignment.vai_tro.ma_vai_tro === ROLES.CHU_NHIEM_LOP
        || assignment.vai_tro.ma_vai_tro === ROLES.PHU_LOP)
        && assignment.pham_vi === 'chi_doan'
        && assignment.id_chi_doan,
    )
    .map((assignment) => assignment.id_chi_doan as string))];
  const assignedNganhs = [...new Set(assignments
    .filter((assignment) =>
      (assignment.vai_tro.ma_vai_tro === ROLES.TRUONG_NGANH
        || assignment.vai_tro.ma_vai_tro === ROLES.PHO_NGANH)
        && assignment.pham_vi === 'nganh'
        && assignment.id_nganh,
    )
    .map((assignment) => assignment.id_nganh as string))];

  const sectorClasses = assignedNganhs.length > 0
    ? await prisma.chi_doan.findMany({
      where: { id_nganh: { in: assignedNganhs } },
      select: { id: true },
    })
    : [];
  const viewableClasses = [...new Set([
    ...assignedClasses,
    ...sectorClasses.map((chiDoan) => chiDoan.id),
  ])];
  const canViewAllChildren = hasGlobalReadRole || managesAllChildren;

  return {
    roles,
    assignedClasses,
    viewableClasses,
    editableClasses: assignedClasses,
    canViewAllChildren,
  };
}
