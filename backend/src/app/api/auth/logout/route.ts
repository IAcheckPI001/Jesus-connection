

import { NextResponse } from 'next/server';
import { getSessionToken, clearSessionCookie } from '@/src/lib/session/sessionCookie';
import { deleteSession } from '@/src/lib/services/sessionService';
import { requireAuth } from '@/src/lib/session/requireAuth';

export async function POST() {
  const session = await requireAuth();
  if (!session) {
    await clearSessionCookie();
    return NextResponse.json({ message: 'Chưa đăng nhập.' }, { status: 401 });
  }
  const token = await getSessionToken();
  if (token) {
    await deleteSession(token);
  }
  await clearSessionCookie();

  return NextResponse.json({ message: 'Đã đăng xuất' });
}
