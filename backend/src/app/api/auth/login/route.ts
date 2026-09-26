

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { findUserByPhone } from '@/src/lib/services/authService';
import { resolvePermissions } from '@/src/lib/services/permissionService';
import { createSession } from '@/src/lib/services/sessionService';
import { setSessionCookie } from '@/src/lib/session/sessionCookie';
import { toPublicUser } from '@/src/types/user.model';
import { canAccessDashboard } from '@/src/lib/permissions/dashboard';


export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = await findUserByPhone(username);

  if (!user || !user.mat_khau) {
    return NextResponse.json({ message: 'Sai thông tin đăng nhập' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.mat_khau);
  if (!isMatch) {
    return NextResponse.json({ message: 'Sai thông tin đăng nhập' }, { status: 401 });
  }

  const { roles, assignedClasses } = await resolvePermissions(user.id);

  const token = await createSession(user.id, {
    ip: req.headers.get('x-forwarded-for') ?? undefined,
    userAgent: req.headers.get('user-agent') ?? undefined,
  });

  await setSessionCookie(token);

  return NextResponse.json({
    user: toPublicUser(user, roles, assignedClasses),
    canAccessDashboard: canAccessDashboard({ roles, assignedClasses }),
  });

}