import type { GioiTinh, TrangThaiFilter, TrangThaiSinhHoat } from '../types/thieuNhi';

export const TRANG_THAI_LABEL: Record<TrangThaiSinhHoat, string> = {
  dang_sinh_hoat: 'Đang sinh hoạt',
  tam_ngung: 'Tạm ngưng',
  chuyen_doan: 'Chuyển đoàn',
  ngung_sinh_hoat: 'Ngưng sinh hoạt',
  ly_do_khac: 'Lý do khác',
};

export type TrangThaiTone = 'success' | 'warning' | 'error' | 'neutral';

export const TRANG_THAI_TONE: Record<TrangThaiSinhHoat, TrangThaiTone> = {
  dang_sinh_hoat: 'success',
  tam_ngung: 'warning',
  chuyen_doan: 'neutral',
  ngung_sinh_hoat: 'error',
  ly_do_khac: 'neutral',
};

export const GIOI_TINH_LABEL: Record<GioiTinh, string> = {
  nam: 'Nam',
  nu: 'Nữ',
};

export const DEFAULT_PAGE_SIZE = 8;
export const DEFAULT_TRANG_THAI_FILTER: TrangThaiSinhHoat = 'dang_sinh_hoat';

export const TRANG_THAI_FILTER_OPTIONS = [
  ...Object.entries(TRANG_THAI_LABEL).map(([value, label]) => ({
    value: value as TrangThaiSinhHoat,
    label,
  })),
  { value: 'tat_ca', label: 'Tất cả' },
] satisfies { value: TrangThaiFilter; label: string }[];
