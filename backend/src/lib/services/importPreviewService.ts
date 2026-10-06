import { prisma } from '@/src/lib/prisma';

export type ImportPreviewInputRow = {
  rowId: string;
  originalExcelRow: number;
  tenThanh: string;
  ho: string;
  ten: string;
  ngaySinh: string;
  doi: string;
  soDienThoai: string;
};

type FieldError = { field: 'tenThanh' | 'ho' | 'ten' | 'ngaySinh'; message: string };
type DuplicateReason = 'ho_ten' | 'ngay_sinh' | 'ca_hai';

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('vi').replace(/[đ]/g, 'd')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
}

function isIsoCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function validate(row: ImportPreviewInputRow): FieldError[] {
  const errors: FieldError[] = [];
  if (!row.tenThanh.trim()) errors.push({ field: 'tenThanh', message: 'Thiếu tên thánh' });
  if (!row.ho.trim()) errors.push({ field: 'ho', message: 'Thiếu họ' });
  if (!row.ten.trim()) errors.push({ field: 'ten', message: 'Thiếu tên' });
  if (!isIsoCalendarDate(row.ngaySinh)) errors.push({ field: 'ngaySinh', message: 'Ngày sinh không hợp lệ' });
  return errors;
}

function duplicateReason(nameMatch: boolean, birthMatch: boolean): DuplicateReason | null {
  if (nameMatch && birthMatch) return 'ca_hai';
  if (nameMatch) return 'ho_ten';
  if (birthMatch) return 'ngay_sinh';
  return null;
}

export async function buildImportPreview(classId: string, inputRows: ImportPreviewInputRow[]) {
  const rows = inputRows.map((row) => ({ ...row, removed: false, fieldErrors: validate(row) }));
  const seenNames = new Map<string, string>();
  const seenBirthdays = new Map<string, string>();

  const rowsWithFileDuplicates = rows.map((row) => {
    let duplicateInFile: { duplicateOfRowId: string; reason: DuplicateReason } | null = null;
    if (row.fieldErrors.length === 0) {
      const nameKey = `${normalize(row.ho)}|${normalize(row.ten)}`;
      const matchedName = seenNames.get(nameKey);
      const matchedBirthday = seenBirthdays.get(row.ngaySinh);
      const reason = duplicateReason(Boolean(matchedName), Boolean(matchedBirthday));
      const duplicateOfRowId = matchedName ?? matchedBirthday;
      if (reason && duplicateOfRowId) duplicateInFile = { duplicateOfRowId, reason };
      if (!seenNames.has(nameKey)) seenNames.set(nameKey, row.rowId);
      if (!seenBirthdays.has(row.ngaySinh)) seenBirthdays.set(row.ngaySinh, row.rowId);
    }
    return { ...row, duplicateInFile };
  });

  // Chỉ đọc đoàn sinh thuộc đúng lớp đã được guard cho phép.
  const existingChildren = await prisma.thieu_nhi.findMany({
    where: { id_chi_doan: classId },
    select: { id: true, ho: true, ten: true, ngay_sinh: true },
  });
  const existingByName = new Map<string, typeof existingChildren[number]>();
  const existingByBirthday = new Map<string, typeof existingChildren[number]>();
  for (const child of existingChildren) {
    const date = child.ngay_sinh.toISOString().slice(0, 10);
    const nameKey = `${normalize(child.ho)}|${normalize(child.ten)}`;
    if (!existingByName.has(nameKey)) existingByName.set(nameKey, child);
    if (!existingByBirthday.has(date)) existingByBirthday.set(date, child);
  }

  return {
    items: rowsWithFileDuplicates.map((row) => {
      if (row.fieldErrors.length > 0) return { ...row, dbDuplicate: null };
      const byName = existingByName.get(`${normalize(row.ho)}|${normalize(row.ten)}`);
      const byBirthday = existingByBirthday.get(row.ngaySinh);
      const reason = duplicateReason(Boolean(byName), Boolean(byBirthday));
      const existing = byName ?? byBirthday;
      return {
        ...row,
        dbDuplicate: reason && existing
          ? { existingId: existing.id, existingLabel: `${existing.ho} ${existing.ten}`.trim(), reason }
          : null,
      };
    }),
  };
}
