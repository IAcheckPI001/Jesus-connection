import { NextResponse } from 'next/server';
import { canPerformClassAction } from '@/src/lib/permissions/classPermission';
import { requireAuth } from '@/src/lib/session/requireAuth';
import { listChiDoanOptions } from '@/src/lib/services/doanSinhService';

export async function GET() {
  try {
    const permission = await requireAuth();
    if (!permission) return NextResponse.json({ message: 'Chưa đăng nhập.' }, { status: 401 });
    if (!permission.canViewAllChildren && permission.viewableClasses.length === 0) {
      return NextResponse.json({ items: [] });
    }
    const items = await listChiDoanOptions(permission.canViewAllChildren ? null : permission.viewableClasses);
    const authorized = items.filter((item) => canPerformClassAction(permission, item.id, 'view'));
    return NextResponse.json({ items: authorized });
  } catch (error) {
    console.error('GET /api/chi-doan failed', error);
    return NextResponse.json({ message: 'Không thể tải danh sách lớp.' }, { status: 500 });
  }
}
