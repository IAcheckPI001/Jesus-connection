import { NextRequest, NextResponse } from 'next/server';
import { requireClassViewAccess } from '@/src/lib/permissions/classAccess';
import { listDoanSinh } from '@/src/lib/services/doanSinhService';
import { TRANG_THAI_SINH_HOAT_VALUES } from '@/src/types/thieu-nhi';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const classId = params.get('classId') ?? '';
    if (!UUID_PATTERN.test(classId)) return NextResponse.json({ message: 'classId không hợp lệ.' }, { status: 400 });
    const access = await requireClassViewAccess(classId);
    if (!access.ok) return NextResponse.json({ message: access.message }, { status: access.status });

    const page = Number(params.get('page') ?? 1);
    if (!Number.isInteger(page) || page < 1 || page > 1_000_000) return NextResponse.json({ message: 'page không hợp lệ.' }, { status: 400 });
    const pageSize = Number(params.get('pageSize') ?? 8);
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) return NextResponse.json({ message: 'pageSize không hợp lệ.' }, { status: 400 });
    const search = params.get('search') ?? '';
    if (search.length > 100) return NextResponse.json({ message: 'Từ khóa tìm kiếm quá dài.' }, { status: 400 });
    const status = params.get('trangThai');
    if (status && !(TRANG_THAI_SINH_HOAT_VALUES as readonly string[]).includes(status)) {
      return NextResponse.json({ message: 'trangThai không hợp lệ.' }, { status: 400 });
    }
    const result = await listDoanSinh({
      classId, page, pageSize, search, status,
      includeAttendance: params.get('includeAttendance') === 'true',
    });
    return NextResponse.json(result, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('GET /api/thieu-nhi failed', error);
    return NextResponse.json({ message: 'Không thể tải danh sách thiếu nhi.' }, { status: 500 });
  }
}
