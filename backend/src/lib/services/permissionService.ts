

import { prisma } from '@/src/lib/prisma';

export type ResolvedPermission = {
  roles: string[];
  assignedClasses: string[]; // id các lớp mà user này là Huynh Trưởng phụ trách
};

export async function resolvePermissions(taiKhoanId: string): Promise<ResolvedPermission> {
  const nhanSu = await prisma.nhan_su.findUnique({
    where: { id_tai_khoan: taiKhoanId },
    include: {
      phan_cong_nhiem_vu: {
        where: {
          trang_thai: 'dang_phan_cong' // chỉ lấy phân công của niên khóa hiện tại
        },
        include: { vai_tro: true },
      },
    },
  });

  if (!nhanSu) return { roles: [], assignedClasses: [] };

  const roles = [...new Set(nhanSu.phan_cong_nhiem_vu.map((pc) => pc.vai_tro.ma_vai_tro))];

  // Chỉ lấy pham_vi (lớp) của những phân công có vai trò Huynh Trưởng
  const assignedClasses = nhanSu.phan_cong_nhiem_vu
    .filter((pc) => (pc.vai_tro.ma_vai_tro === 'CHU_NHIEM_LOP' || pc.vai_tro.ma_vai_tro === 'PHU_LOP') && pc.pham_vi === 'chi_doan')
    .map((pc) => pc.id_chi_doan as string);

  return { roles, assignedClasses };
}