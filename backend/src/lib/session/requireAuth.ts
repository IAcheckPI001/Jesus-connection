
import { getSessionToken } from '@/src/lib/session/sessionCookie';
import { getSessionByToken } from '@/src/lib/services/sessionService';
import { resolvePermissions } from '@/src/lib/services/permissionService';

export async function requireAuth() {
  const token = await getSessionToken();
  if (!token) return null;

  const session = await getSessionByToken(token);
  if (!session) return null;

  const permissions = await resolvePermissions(session.tai_khoan_id);

  return {
    taiKhoanId: session.tai_khoan_id,
    ...permissions,
  };
}
