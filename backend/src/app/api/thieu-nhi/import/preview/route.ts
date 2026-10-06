import { NextRequest, NextResponse } from 'next/server';
import { requireClassAccess } from '@/src/lib/permissions/classAccess';
import { buildImportPreview, type ImportPreviewInputRow } from '@/src/lib/services/importPreviewService';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_PREVIEW_ROWS = 500;
const MAX_TEXT_LENGTH = 200;
const MAX_REQUEST_BYTES = 3_000_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseRows(value: unknown): ImportPreviewInputRow[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_PREVIEW_ROWS) return null;

  console.log('aaaaa:');
  const rows: ImportPreviewInputRow[] = [];
  const rowIds = new Set<string>();
  for (const valueRow of value) {
    if (!isRecord(valueRow)) return null;
    const fields = ['tenThanh', 'ho', 'ten', 'ngaySinh', 'doi', 'soDienThoai'] as const;
    if (!fields.every((field) => typeof valueRow[field] === 'string' && valueRow[field].length <= MAX_TEXT_LENGTH)) return null;
    if (typeof valueRow.rowId !== 'string' || !valueRow.rowId || valueRow.rowId.length > 100 || rowIds.has(valueRow.rowId)) return null;
    rowIds.add(valueRow.rowId);
    if (typeof valueRow.originalExcelRow !== 'number' || !Number.isInteger(valueRow.originalExcelRow) || valueRow.originalExcelRow < 2) return null;
    rows.push({
      rowId: valueRow.rowId,
      originalExcelRow: Number(valueRow.originalExcelRow),
      tenThanh: valueRow.tenThanh as string,
      ho: valueRow.ho as string,
      ten: valueRow.ten as string,
      ngaySinh: valueRow.ngaySinh as string,
      doi: valueRow.doi as string,
      soDienThoai: valueRow.soDienThoai as string,
    });
    console.log('Parsed row:', rows[rows.length - 1]);
  }
  return rows;
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ message: 'Dữ liệu preview vượt quá giới hạn.' }, { status: 413 });
    }
    const body: unknown = await request.json();
    if (!isRecord(body) || typeof body.classId !== 'string' || !UUID_PATTERN.test(body.classId)) {
      return NextResponse.json({ message: 'classId không hợp lệ.' }, { status: 400 });
    }
    const access = await requireClassAccess(body.classId);
    if (!access.ok) return NextResponse.json({ message: access.message }, { status: access.status });

    const rows = parseRows(body.rows);
    if (!rows) return NextResponse.json({ message: 'Danh sách dòng preview không hợp lệ.' }, { status: 400 });
    console.log('bbbbbb:');

    const result = await buildImportPreview(body.classId, rows);
    return NextResponse.json(result, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('POST /api/thieu-nhi/import/preview failed', error);
    return NextResponse.json({ message: 'Không thể kiểm tra dữ liệu import.' }, { status: 500 });
  }
}
