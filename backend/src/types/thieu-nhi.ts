import type { gioi_tinh_enum, trang_thai_sinh_hoat_enum } from '@/src/generated/prisma/enums';

export const TRANG_THAI_SINH_HOAT_VALUES = [
  'dang_sinh_hoat', 'tam_ngung', 'chuyen_doan', 'ngung_sinh_hoat', 'ly_do_khac',
] as const;

export type ChiDoanOption = {
  id: string;
  ten: string;
};

export type DoanSinhAttendanceColumn = {
  id: string;
  date: string;
  isUpcoming: boolean;
};

export type DoanSinhListItem = {
  id: string;
  tenThanh: string | null;
  ho: string;
  ten: string;
  ngaySinh: string;
  gioiTinh: gioi_tinh_enum;
  trangThai: trang_thai_sinh_hoat_enum;
  doiLabel: string | null;
  chiDoanId: string;
  attendance: Record<string, string | null>;
  scores: {
    behavior: number | null;
    campaignExam: number | null;
    catechismExam: number | null;
    average: number | null;
  };
};

export type DoanSinhListResponse = {
  items: DoanSinhListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  stats: {
    siSo: number;
    nu: number;
    nam: number;
  };
  attendanceColumns: DoanSinhAttendanceColumn[];
};

export type DoanSinhListParams = {
  classId: string;
  page: number;
  pageSize: number;
  search: string;
  status: string | null;
  includeAttendance: boolean;
};
