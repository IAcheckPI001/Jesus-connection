

import { NextResponse } from 'next/server';
import { requireAuth } from '@/src/lib/session/requireAuth';
import { prisma } from '@/src/lib/prisma';
import { toPublicUser } from '@/src/types/user.model';

export async function GET() {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 });
  }

  const user = await prisma.tai_khoan.findUnique({
    where: { id: session.taiKhoanId },
    include: { nhan_su: true },
  });

  if (!user) {
    return NextResponse.json({ message: 'Phiên không hợp lệ' }, { status: 401 });
  }

  return NextResponse.json({
    user: toPublicUser(user, session.roles, session.assignedClasses),
  });
}