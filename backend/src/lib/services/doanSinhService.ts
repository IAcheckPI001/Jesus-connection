import { Prisma } from '@/src/generated/prisma/client';
import { prisma } from '@/src/lib/prisma';
import type { ChiDoanOption, DoanSinhListParams, DoanSinhListResponse } from '@/src/types/thieu-nhi';

function folded(value: string) {
  return `translate(regexp_replace(normalize(lower(${value}), NFD), '[' || chr(768) || '-' || chr(879) || ']', '', 'g'), 'đ', 'd')`;
}

function foldSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

function upcomingSunday(from = new Date()) {
  const date = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const daysUntilSunday = (7 - date.getUTCDay()) % 7 || 7;
  date.setUTCDate(date.getUTCDate() + daysUntilSunday);
  return date;
}

export async function listChiDoanOptions(allowedIds: string[] | null): Promise<ChiDoanOption[]> {
  const classes = await prisma.chi_doan.findMany({
    where: allowedIds ? { id: { in: allowedIds } } : undefined,
    orderBy: [{ ten_chi_doan: 'asc' }, { id: 'asc' }],
    select: { id: true, ten_chi_doan: true },
  });
  return classes.map((item) => ({ id: item.id, ten: item.ten_chi_doan }));
}

export async function listDoanSinh({
  classId, page, pageSize, search, status, includeAttendance,
}: DoanSinhListParams): Promise<DoanSinhListResponse> {
  const searchTokens = search.trim().toLocaleLowerCase('vi').split(/\s+/).filter(Boolean).map(foldSearch);
  const baseWhere = { id_chi_doan: classId, ...(status ? { trang_thai: status as never } : {}) };
  let matchingIds: string[] | null = null;
  let total: number;
  let effectivePage: number;

  if (searchTokens.length) {
    const conditions = searchTokens.map((token) => Prisma.sql`(
      ${folded("concat_ws(' ', ds.ten_thanh, ds.ho, ds.ten)")} LIKE ${`%${token}%`}
    )`);
    const query = conditions.reduce((merged, condition) => Prisma.sql`${merged} AND ${condition}`);
    const where = Prisma.sql`ds.id_chi_doan = ${classId}::uuid
      AND (${status ? Prisma.sql`ds.trang_thai::text = ${status}` : Prisma.sql`TRUE`}) AND ${query}`;
    const countRows = await prisma.$queryRaw<Array<{ total: number }>>(Prisma.sql`
      SELECT count(*)::int AS total FROM doan_sinh ds WHERE ${where}
    `);
    total = countRows[0]?.total ?? 0;
    const totalPages = Math.ceil(total / pageSize);
    effectivePage = Math.min(Math.max(1, page), Math.max(1, totalPages));
    const found = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT ds.id::text AS id FROM doan_sinh ds
      WHERE ${where}
      ORDER BY ds.ho ASC, ds.ten ASC, ds.id ASC
      LIMIT ${pageSize} OFFSET ${(effectivePage - 1) * pageSize}
    `);
    matchingIds = found.map(({ id }) => id);
  } else {
    total = await prisma.thieu_nhi.count({ where: baseWhere });
    const totalPages = Math.ceil(total / pageSize);
    effectivePage = Math.min(Math.max(1, page), Math.max(1, totalPages));
  }

  const totalPages = Math.ceil(total / pageSize);
  const ids = matchingIds
    ? matchingIds
    : (await prisma.thieu_nhi.findMany({
      where: baseWhere,
      orderBy: [{ ho: 'asc' }, { ten: 'asc' }, { id: 'asc' }],
      skip: (effectivePage - 1) * pageSize,
      take: pageSize,
      select: { id: true },
    })).map(({ id }) => id);

  const [rows, siSo, nu, nam, latestSessions] = await Promise.all([
    prisma.thieu_nhi.findMany({
      where: { id: { in: ids } },
      include: {
        doi_nhom_thieu_nhi_id_doi_nhomTodoi_nhom: { select: { ten_doi: true } },
        diem_danh: { include: { buoi_sinh_hoat: { select: { id: true, ngay_sinh_hoat: true } } } },
      },
    }),
    prisma.thieu_nhi.count({ where: { id_chi_doan: classId, trang_thai: 'dang_sinh_hoat' } }),
    prisma.thieu_nhi.count({ where: { id_chi_doan: classId, trang_thai: 'dang_sinh_hoat', gioi_tinh: 'nu' } }),
    prisma.thieu_nhi.count({ where: { id_chi_doan: classId, trang_thai: 'dang_sinh_hoat', gioi_tinh: 'nam' } }),
    includeAttendance ? prisma.buoi_sinh_hoat.findMany({
      where: { id_chi_doan: classId, ngay_sinh_hoat: { lte: new Date() }, diem_danh: { some: {} } },
      orderBy: { ngay_sinh_hoat: 'desc' }, take: 52,
      select: { id: true, ngay_sinh_hoat: true },
    }) : Promise.resolve([]),
  ]);
  const orderedRows = [...rows].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  const columns = latestSessions.reverse().map((session) => ({
    id: session.id,
    date: session.ngay_sinh_hoat.toISOString().slice(0, 10),
    isUpcoming: false,
  }));
  if (includeAttendance) columns.push({ id: 'upcoming', date: upcomingSunday().toISOString().slice(0, 10), isUpcoming: true });
  const sessionIds = new Set(columns.map(({ id }) => id));

  return {
    items: orderedRows.map((row) => ({
      id: row.id,
      tenThanh: row.ten_thanh,
      ho: row.ho,
      ten: row.ten,
      ngaySinh: row.ngay_sinh.toISOString().slice(0, 10),
      gioiTinh: row.gioi_tinh,
      trangThai: row.trang_thai,
      doiLabel: row.doi_nhom_thieu_nhi_id_doi_nhomTodoi_nhom?.ten_doi ?? null,
      chiDoanId: classId,
      attendance: Object.fromEntries(columns.map(({ id }) => [id,
        sessionIds.has(row.diem_danh?.id_buoi_sinh_hoat ?? '') && row.diem_danh?.id_buoi_sinh_hoat === id
          ? row.diem_danh.trang_thai ?? null
          : null])),
      scores: { behavior: null, campaignExam: null, catechismExam: null, average: null },
    })),
    page: effectivePage, pageSize, total, totalPages, stats: { siSo, nu, nam },
    attendanceColumns: columns,
  };
}
