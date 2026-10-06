

import { prisma } from '@/src/lib/prisma';

// Tìm 1 user theo số điện thoại
export async function findUserByPhone(phone: string) {
  return prisma.tai_khoan.findUnique({
    where: { ten_tai_khoan: phone },
    include: {
      nhan_su: true, // lấy kèm thông tin nhân sự liên kết
    },
  });
}
