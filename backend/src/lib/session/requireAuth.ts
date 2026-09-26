
import { getSessionToken } from './sessionCookie';
import { getSessionByToken } from '../services/sessionService';
import { resolvePermissions } from '../services/permissionService';

export async function requireAuth() {
  const token = await getSessionToken();
  if (!token) return null;

  const session = await getSessionByToken(token);
  if (!session) return null;

  const { roles, assignedClasses } = await resolvePermissions(session.tai_khoan_id);

  return {
    taiKhoanId: session.tai_khoan_id,
    roles,
    assignedClasses,
  };
}