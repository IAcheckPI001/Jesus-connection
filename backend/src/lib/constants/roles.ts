

export const ROLES = {
  CHA_TUYEN_UY: 'CHA_TUYEN_UY',
  XU_DOAN_TRUONG: 'XU_DOAN_TRUONG',
  TRO_UY_XU_DOAN: 'TRO_UY_XU_DOAN',
  PHO_NOI_VU: 'PHO_NOI_VU',
  PHO_NGOAI_VU: 'PHO_NGOAI_VU',
  THU_KY: 'THU_KY',
  THU_QUY: 'THU_QUY',
  TRUONG_NGANH: 'TRUONG_NGANH',
  PHO_NGANH: 'PHO_NGANH',
  TRUONG_BAN: 'TRUONG_BAN',
  PHO_BAN: 'PHO_BAN',
  THANH_VIEN_BAN: 'THANH_VIEN_BAN',
  CHU_NHIEM_LOP: 'CHU_NHIEM_LOP',
  PHU_LOP: 'PHU_LOP'
} as const;

// Nhóm có quyền xem toàn bộ thiếu nhi và thông tin nhân sự, không tự cấp quyền sửa.
export const GLOBAL_READ_ROLES = [
  ROLES.CHA_TUYEN_UY,
  ROLES.XU_DOAN_TRUONG,
  ROLES.TRO_UY_XU_DOAN,
  ROLES.PHO_NOI_VU,
  ROLES.PHO_NGOAI_VU,
  ROLES.THU_KY,
] as const;

// Các vai trò này không được đồng thời nhận quyền phụ trách lớp.
export const ROLES_WITHOUT_CLASS_ASSIGNMENTS = [
  ROLES.XU_DOAN_TRUONG,
  ROLES.TRO_UY_XU_DOAN,
  ROLES.PHO_NOI_VU,
  ROLES.PHO_NGOAI_VU,
  ROLES.THU_KY,
  ROLES.THU_QUY,
] as const;

export const BAN_HC_CODE = 'BAN_HC';

export const BAN_HC_CHILD_MANAGER_ROLES = [
  ROLES.TRUONG_BAN,
  ROLES.PHO_BAN,
  ROLES.THANH_VIEN_BAN,
] as const;
