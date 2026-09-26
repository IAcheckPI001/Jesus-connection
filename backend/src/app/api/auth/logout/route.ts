

import { NextResponse } from 'next/server';
import { getSessionToken, clearSessionCookie } from '@/src/lib/session/sessionCookie';
import { deleteSession } from '@/src/lib/services/sessionService';

export async function POST() {
  const token = await getSessionToken();
  if (token) {
    await deleteSession(token);
  }
  await clearSessionCookie();

  return NextResponse.json({ message: 'Đã đăng xuất' });
}