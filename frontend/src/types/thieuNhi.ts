export const GIOI_TINH_VALUES = ['nam', 'nu'] as const;
export type GioiTinh = (typeof GIOI_TINH_VALUES)[number];

export const TRANG_THAI_SINH_HOAT_VALUES = [
  'dang_sinh_hoat',
  'tam_ngung',
  'chuyen_doan',
  'ngung_sinh_hoat',
  'ly_do_khac',
] as const;
export type TrangThaiSinhHoat = (typeof TRANG_THAI_SINH_HOAT_VALUES)[number];

export type ThieuNhiListItem = {
  id: string;
  tenThanh: string | null;
  ho: string;
  ten: string;
  ngaySinh: string | null;
  gioiTinh: GioiTinh | null;
  doiLabel: string | null;
  chiDoanId: string;
  lopTen: string;
  trangThai: TrangThaiSinhHoat;
};

export type LopOption = { id: string; ten: string };
export type ThieuNhiStats = { siSo: number; nu: number; nam: number };
export type TrangThaiFilter = TrangThaiSinhHoat | 'tat_ca';
