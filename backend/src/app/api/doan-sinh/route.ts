import { NextRequest, NextResponse } from 'next/server';
import { canPerformClassAction } from '@/src/lib/permissions/classPermission';
import { requireAuth } from '@/src/lib/session/requireAuth';
import { listDoanSinh } from '@/src/lib/services/doanSinhService';
import { TRANG_THAI_SINH_HOAT_VALUES } from '@/src/types/doan-sinh';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  try {
    const permission = await requireAuth();
    if (!permission) return NextResponse.json({ message: 'Chưa đăng nhập.' }, { status: 401 });
    const params = request.nextUrl.searchParams;
    const classId = params.get('classId') ?? '';
    if (!UUID_PATTERN.test(classId)) return NextResponse.json({ message: 'classId không hợp lệ.' }, { status: 400 });
    if (!canPerformClassAction(permission, classId, 'view')) return NextResponse.json({ message: 'Không có quyền xem lớp này.' }, { status: 403 });

    const page = Number(params.get('page') ?? 1);
    if (!Number.isInteger(page) || page < 1 || page > 1_000_000) return NextResponse.json({ message: 'page không hợp lệ.' }, { status: 400 });
    const search = params.get('search') ?? '';
    if (search.length > 100) return NextResponse.json({ message: 'Từ khóa tìm kiếm quá dài.' }, { status: 400 });
    const status = params.get('trangThai');
    if (status && !(TRANG_THAI_SINH_HOAT_VALUES as readonly string[]).includes(status)) {
      return NextResponse.json({ message: 'trangThai không hợp lệ.' }, { status: 400 });
    }
    const result = await listDoanSinh({
      classId, page, search, status,
      includeAttendance: params.get('includeAttendance') === 'true',
    });
    return NextResponse.json(result, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('GET /api/doan-sinh failed', error);
    return NextResponse.json({ message: 'Không thể tải danh sách thiếu nhi.' }, { status: 500 });
  }
}
