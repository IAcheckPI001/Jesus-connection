

import type { tai_khoanModel, nhan_suModel } from '@/src/generated/prisma/models';

// Type dữ liệu trả ra ngoài API — không chứa mat_khau_hash hay field nhạy cảm khác
export type PublicUser = {
  id: string;
  soDienThoai: string;
  tenThanh: string;
  hoTen: string | null;
  roles: string[];
  assignedClasses: string[];
};

// Type input: bản ghi tai_khoan có kèm theo nhan_su (lấy từ Prisma include)
type UserWithProfile = tai_khoanModel & {
  nhan_su: nhan_suModel | null;
};

export function toPublicUser(
  user: UserWithProfile,
  roles: string[] = [],
  assignedClasses: string[] = []
): PublicUser {
  return {
    id: user.id,
    soDienThoai: user.ten_tai_khoan ?? '',
    tenThanh: user.nhan_su?.ten_thanh ?? '',
    hoTen: user.nhan_su?.ho_ten ?? '',
    roles,
    assignedClasses,
  };
}
