

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

// Tìm 1 user theo id
export async function findUserById(id: string) {
  return prisma.tai_khoan.findUnique({
    where: { id },
  });
}

// Lấy danh sách, có thể kèm quan hệ (join) nếu model có liên kết
export async function getAllUsers() {
  return prisma.tai_khoan.findMany({
    orderBy: { ngay_khoi_tao: 'desc' },
  });
}