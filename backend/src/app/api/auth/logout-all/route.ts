

import { NextResponse } from 'next/server';
import { requireAuth } from '@/src/lib/session/requireAuth';
import { deleteAllSessionsForUser } from '@/src/lib/services/sessionService';
import { clearSessionCookie } from '@/src/lib/session/sessionCookie';

export async function POST() {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 });
  }

  await deleteAllSessionsForUser(session.taiKhoanId);
  await clearSessionCookie();

  return NextResponse.json({ message: 'Đã đăng xuất khỏi tất cả thiết bị' });
}