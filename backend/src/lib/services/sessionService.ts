

import crypto from 'crypto';
import { prisma } from '@/src/lib/prisma';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 ngày

export async function createSession(taiKhoanId: string, meta: { ip?: string; userAgent?: string }) {
  const token = crypto.randomBytes(32).toString('hex'); // token ngẫu nhiên, không đoán được

  await prisma.phien_dang_nhap.create({
    data: {
      ma_phien: token,
      tai_khoan_id: taiKhoanId,
      dia_chi_ip: meta.ip,
      ngay_het_han: new Date(Date.now() + SESSION_DURATION_MS),
    },
  });

  return token;
}

export async function getSessionByToken(token: string) {
  const session = await prisma.phien_dang_nhap.findUnique({
    where: { ma_phien: token },
  });

  if (!session || session.ngay_het_han < new Date()) {
    if (session) {
      // dọn luôn session hết hạn này khi phát hiện ra
      await prisma.phien_dang_nhap.delete({ where: { id: session.id } }).catch(() => {});
    }
    return null;
  }

  // cập nhật last_active_at (không cần await, không chặn response)
  prisma.phien_dang_nhap
    .update({ where: { id: session.id }, data: { truy_cap_cuoi: new Date() } })
    .catch(() => {});

  return session;
}

export async function deleteSession(token: string) {
  await prisma.phien_dang_nhap.deleteMany({ where: { ma_phien: token } });
}

// Đăng xuất khỏi TẤT CẢ thiết bị — tính năng chỉ có được nhờ lưu server-side
export async function deleteAllSessionsForUser(taiKhoanId: string) {
  await prisma.phien_dang_nhap.deleteMany({ where: { tai_khoan_id: taiKhoanId } });
}
