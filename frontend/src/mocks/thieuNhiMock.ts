import type { LopOption, ThieuNhiListItem } from '../types/thieuNhi';

export const LOP_OPTIONS: LopOption[] = [
  { id: 'lop-1a', ten: 'Thiếu 1A' },
  { id: 'lop-1b', ten: 'Thiếu 1B' },
  { id: 'lop-1c', ten: 'Thiếu 1C' },
  { id: 'lop-1d', ten: 'Thiếu 1D' },
  { id: 'lop-2a', ten: 'Thiếu 2A' },
  { id: 'lop-2b', ten: 'Thiếu 2B' },
  { id: 'lop-3a', ten: 'Thiếu 3A' },
  { id: 'lop-3b', ten: 'Thiếu 3B' },
];

type ChildSeed = Pick<ThieuNhiListItem, 'id' | 'ho' | 'ten'>
  & Partial<Omit<ThieuNhiListItem, 'id' | 'ho' | 'ten' | 'chiDoanId' | 'lopTen'>>;

function createItem(lop: LopOption, seed: ChildSeed): ThieuNhiListItem {
  return {
    id: seed.id,
    ho: seed.ho,
    ten: seed.ten,
    tenThanh: seed.tenThanh ?? null,
    ngaySinh: seed.ngaySinh ?? null,
    gioiTinh: seed.gioiTinh ?? null,
    doiLabel: seed.doiLabel ?? null,
    chiDoanId: lop.id,
    lopTen: lop.ten,
    trangThai: seed.trangThai ?? 'dang_sinh_hoat',
  };
}

function createClassItems(lop: LopOption, seeds: ChildSeed[]): ThieuNhiListItem[] {
  return seeds.map((seed) => createItem(lop, seed));
}

const lop1A = LOP_OPTIONS[0];
const lop1B = LOP_OPTIONS[1];
const lop1C = LOP_OPTIONS[2];
const lop1D = LOP_OPTIONS[3];
const lop2A = LOP_OPTIONS[4];
const lop2B = LOP_OPTIONS[5];
const lop3A = LOP_OPTIONS[6];

export const thieuNhiMock: ThieuNhiListItem[] = [
  ...createClassItems(lop1A, [
    { id: 'tn-1a-001', tenThanh: 'Gioan', ho: 'Nguyễn Kim', ten: 'Anh', ngaySinh: '2008-09-18', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-002', tenThanh: 'Toma', ho: 'Cao Văn', ten: 'Đông', ngaySinh: '2008-09-20', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-003', tenThanh: 'Anna', ho: 'Nguyễn Thị Kim', ten: 'Tuyến', ngaySinh: '2008-10-01', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-1a-004', tenThanh: 'Philipphe', ho: 'Đặng Văn', ten: 'Vui', ngaySinh: '2008-04-16', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-005', tenThanh: 'Giuse', ho: 'Nguyễn Bá', ten: 'Quát', ngaySinh: '2008-03-06', gioiTinh: 'nam', doiLabel: '2' },
    { id: 'tn-1a-006', tenThanh: 'Phero', ho: 'Trần Đình', ten: 'Đăng', ngaySinh: '2008-12-09', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-007', tenThanh: 'Martino', ho: 'Nguyễn Văn', ten: 'Thuận', ngaySinh: '2008-09-18', gioiTinh: 'nam', doiLabel: '3' },
    { id: 'tn-1a-008', tenThanh: 'Maria', ho: 'Nguyễn Thị Hồng', ten: 'Dung', ngaySinh: '2008-09-18', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1a-009', tenThanh: 'Minh', ho: 'Lê Văn', ten: 'Minh', ngaySinh: '2008-05-14', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-010', tenThanh: 'Chi', ho: 'Phạm Thị Lan', ten: 'Chi', ngaySinh: '2008-06-23', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1a-011', tenThanh: 'Long', ho: 'Võ Văn', ten: 'Long', ngaySinh: '2008-02-11', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-012', tenThanh: 'Hân', ho: 'Bùi Thị Ngọc', ten: 'Hân', ngaySinh: '2008-11-02', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1a-013', tenThanh: 'Khánh', ho: 'Đỗ Văn', ten: 'Khánh', ngaySinh: '2008-01-19', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-014', tenThanh: 'Mai', ho: 'Hoàng Thị Mai', ten: 'Anh', ngaySinh: '2008-07-08', gioiTinh: 'nu', doiLabel: '3' },
    { id: 'tn-1a-015', tenThanh: 'Hải', ho: 'Phan Văn', ten: 'Hải', ngaySinh: '2008-03-29', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-016', tenThanh: 'Trúc', ho: 'Vũ Thị Thanh', ten: 'Trúc', ngaySinh: '2008-08-15', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1a-017', tenThanh: 'Phúc', ho: 'Đặng Văn', ten: 'Phúc', ngaySinh: '2008-04-05', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-018', tenThanh: 'Linh', ho: 'Huỳnh Thị Mỹ', ten: 'Linh', ngaySinh: '2008-12-21', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1a-019', tenThanh: 'Quân', ho: 'Nguyễn Hoàng', ten: 'Quân', ngaySinh: '2008-05-02', gioiTinh: 'nam', doiLabel: '3' },
    { id: 'tn-1a-020', tenThanh: 'Ngọc', ho: 'Trần Thị', ten: 'Bảo Ngọc', ngaySinh: '2008-10-13', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-1a-021', tenThanh: 'Khang', ho: 'Lý Văn', ten: 'Khang', ngaySinh: '2008-06-04', gioiTinh: 'nam', doiLabel: '2' },
    { id: 'tn-1a-022', tenThanh: 'Phương', ho: 'Mai Thị', ten: 'Phương', ngaySinh: '2008-09-26', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-1a-023', tenThanh: 'Triết', ho: 'Cao Minh', ten: 'Triết', ngaySinh: '2008-02-17', gioiTinh: 'nam', doiLabel: '3' },
    { id: 'tn-1a-024', tenThanh: 'Thảo', ho: 'Lâm Thị', ten: 'Thảo', ngaySinh: '2008-04-30', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1a-025', tenThanh: 'Tuấn', ho: 'Tạ Văn', ten: 'Tuấn', ngaySinh: '2008-07-01', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-026', tenThanh: 'Yến', ho: 'Dương Thị', ten: 'Yến', ngaySinh: '2008-03-13', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1a-027', tenThanh: 'Nam', ho: 'Hồ Văn', ten: 'Nam', ngaySinh: '2008-11-28', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-028', tenThanh: 'Hà', ho: 'Nguyễn Ngọc', ten: 'Hà', ngaySinh: '2008-01-07', gioiTinh: 'nu', doiLabel: '3' },
    { id: 'tn-1a-029', tenThanh: 'Bảo', ho: 'Trương Văn', ten: 'Bảo', ngaySinh: '2008-05-22', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-030', tenThanh: 'My', ho: 'Phạm Thị', ten: 'Diễm My', ngaySinh: '2008-08-06', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1a-031', tenThanh: 'Hiếu', ho: 'Đinh Văn', ten: 'Hiếu', ngaySinh: '2008-12-03', gioiTinh: 'nam', doiLabel: '3' },
    { id: 'tn-1a-032', tenThanh: 'Ánh', ho: 'Lê Thị', ten: 'Ánh', ngaySinh: '2008-06-17', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-1a-033', tenThanh: 'Khôi', ho: 'Vương Văn', ten: 'Khôi', ngaySinh: '2008-02-25', gioiTinh: 'nam', doiLabel: '2' },
    { id: 'tn-1a-034', tenThanh: 'Quỳnh', ho: 'Châu Thị', ten: 'Quỳnh', ngaySinh: '2008-10-09', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-1a-035', tenThanh: 'Duy', ho: 'Đoàn Văn', ten: 'Duy', ngaySinh: '2008-09-03', gioiTinh: 'nam', doiLabel: '3' },
    { id: 'tn-1a-036', tenThanh: 'Châu', ho: 'Nguyễn Thị', ten: 'Minh Châu', ngaySinh: '2008-07-19', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1a-037', tenThanh: 'Tín', ho: 'Tôn Văn', ten: 'Tín', ngaySinh: '2008-03-08', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1a-038', tenThanh: 'Thu', ho: 'Phùng Thị', ten: 'Thu', ngaySinh: '2008-11-14', gioiTinh: 'nu', doiLabel: '3' },
    { id: 'tn-1a-039', tenThanh: 'Kiệt', ho: 'Trịnh Văn', ten: 'Kiệt', ngaySinh: '2008-04-22', gioiTinh: 'nam', doiLabel: '2' },
    { id: 'tn-1a-040', tenThanh: 'Ngân', ho: 'Bạch Thị', ten: 'Ngân', ngaySinh: '2008-01-31', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-1a-041', tenThanh: 'Đạt', ho: 'Hà Văn', ten: 'Đạt', ngaySinh: '2008-08-27', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1a-042', tenThanh: 'Ngọc', ho: 'Đào Thị', ten: 'Ngọc', ngaySinh: '2008-12-12', gioiTinh: 'nu', doiLabel: '3' },
    { id: 'tn-1a-043', tenThanh: 'Giuse', ho: 'Nguyễn Văn', ten: 'Bình', ngaySinh: '2008-06-05', gioiTinh: 'nam', doiLabel: '1', trangThai: 'tam_ngung' },
    { id: 'tn-1a-044', tenThanh: 'Maria', ho: 'Trần Thị', ten: 'Lan', ngaySinh: '2008-05-16', gioiTinh: 'nu', doiLabel: '2', trangThai: 'tam_ngung' },
    { id: 'tn-1a-045', tenThanh: 'Phaolo', ho: 'Lê Văn', ten: 'Cường', ngaySinh: '2008-07-24', gioiTinh: 'nam', doiLabel: '1', trangThai: 'chuyen_doan' },
    { id: 'tn-1a-046', tenThanh: 'Têrêsa', ho: 'Nguyễn Thị', ten: 'Hoa', ngaySinh: '2008-02-08', gioiTinh: 'nu', doiLabel: '3', trangThai: 'ngung_sinh_hoat' },
    { id: 'tn-1a-047', tenThanh: 'Đaminh', ho: 'Phạm Văn', ten: 'Sơn', ngaySinh: '2008-10-25', gioiTinh: 'nam', doiLabel: '2', trangThai: 'ly_do_khac' },
  ]),
  ...createClassItems(lop1B, [
    { id: 'tn-1b-001', ho: '', ten: 'An', tenThanh: null, ngaySinh: null, gioiTinh: null, doiLabel: null },
    { id: 'tn-1b-002', ho: 'Phạm Văn', ten: 'Đức', tenThanh: 'Giuse', ngaySinh: '2009-01-10', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1b-003', ho: 'Nguyễn Thị Bích Phương Hoàng Minh', ten: 'Khánh Linh Phương Thảo', tenThanh: 'Maria', ngaySinh: '2009-03-21', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1b-004', ho: '  Cao   Văn ', ten: 'Đông', tenThanh: 'Toma', ngaySinh: '2009-06-16', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1b-005', ho: 'Nguyễn Thị Kim', ten: 'Tuyến', tenThanh: 'Anna', ngaySinh: '2009-08-12', gioiTinh: 'nu', doiLabel: '3' },
    { id: 'tn-1b-006', ho: 'Trần Quốc', ten: 'Bảo', tenThanh: 'Phêrô', ngaySinh: '2009-11-04', gioiTinh: 'nam', doiLabel: '2' },
  ]),
  ...createClassItems(lop1C, [
    { id: 'tn-1c-001', ho: 'Đặng Thị', ten: 'Hồng', tenThanh: 'Anna', ngaySinh: '2009-04-12', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-1c-002', ho: 'Nguyễn Văn', ten: 'Thành', tenThanh: 'Gioan', ngaySinh: '2009-09-22', gioiTinh: 'nam', doiLabel: '2' },
    { id: 'tn-1c-003', ho: 'Võ Thị', ten: 'Hạnh', tenThanh: 'Maria', ngaySinh: '2009-02-19', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-1c-004', ho: 'Phan Minh', ten: 'Tâm', tenThanh: 'Giuse', ngaySinh: '2009-07-07', gioiTinh: 'nam', doiLabel: '3' },
    { id: 'tn-1c-005', ho: 'Lê Ngọc', ten: 'Trâm', tenThanh: 'Têrêsa', ngaySinh: '2009-10-28', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1c-006', ho: 'Bùi Văn', ten: 'Phát', tenThanh: 'Toma', ngaySinh: '2009-12-06', gioiTinh: 'nam', doiLabel: '1' },
  ]),
  ...createClassItems(lop1D, [
    { id: 'tn-1d-001', ho: 'Trương Thị', ten: 'Uyên', tenThanh: 'Maria', ngaySinh: '2009-05-09', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-1d-002', ho: 'Hồ Minh', ten: 'Đức', tenThanh: 'Phaolo', ngaySinh: '2009-08-31', gioiTinh: 'nam', doiLabel: '2' },
    { id: 'tn-1d-003', ho: 'Đỗ Thị', ten: 'Thùy', tenThanh: 'Anna', ngaySinh: '2009-03-17', gioiTinh: 'nu', doiLabel: '3' },
    { id: 'tn-1d-004', ho: 'Nguyễn Hoàng', ten: 'Duy', tenThanh: 'Gioan', ngaySinh: '2009-11-11', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-1d-005', ho: 'Phạm Thị', ten: 'Vân', tenThanh: 'Têrêsa', ngaySinh: '2009-06-25', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-1d-006', ho: 'Cao Văn', ten: 'Huy', tenThanh: 'Giuse', ngaySinh: '2009-01-28', gioiTinh: 'nam', doiLabel: '1' },
  ]),
  ...createClassItems(lop2A, [
    { id: 'tn-2a-001', ho: 'Nguyễn Thị', ten: 'Thảo Vy', tenThanh: 'Maria', ngaySinh: '2010-02-14', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-2a-002', ho: 'Trần Văn', ten: 'Quốc', tenThanh: 'Toma', ngaySinh: '2010-09-03', gioiTinh: 'nam', doiLabel: '2' },
    { id: 'tn-2a-003', ho: 'Lý Thị', ten: 'Như', tenThanh: 'Anna', ngaySinh: '2010-06-18', gioiTinh: 'nu', doiLabel: '3' },
    { id: 'tn-2a-004', ho: 'Đinh Văn', ten: 'Hào', tenThanh: 'Gioan', ngaySinh: '2010-12-02', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-2a-005', ho: 'Phan Thị', ten: 'Ngọc', tenThanh: 'Têrêsa', ngaySinh: '2010-04-26', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-2a-006', ho: 'Đoàn Minh', ten: 'Đạt', tenThanh: 'Giuse', ngaySinh: '2010-10-07', gioiTinh: 'nam', doiLabel: '1' },
  ]),
  ...createClassItems(lop2B, [
    { id: 'tn-2b-001', ho: 'Nguyễn Thị', ten: 'Yến Nhi', tenThanh: 'Maria', ngaySinh: '2010-03-05', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-2b-002', ho: 'Vũ Văn', ten: 'Đăng', tenThanh: 'Phaolo', ngaySinh: '2010-07-29', gioiTinh: 'nam', doiLabel: '2' },
    { id: 'tn-2b-003', ho: 'Phạm Thị', ten: 'Kim Anh', tenThanh: 'Anna', ngaySinh: '2010-11-17', gioiTinh: 'nu', doiLabel: '3' },
    { id: 'tn-2b-004', ho: 'Bùi Quốc', ten: 'Bảo', tenThanh: 'Gioan', ngaySinh: '2010-01-23', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-2b-005', ho: 'Hoàng Thị', ten: 'Minh Châu', tenThanh: 'Têrêsa', ngaySinh: '2010-08-08', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-2b-006', ho: 'Tạ Văn', ten: 'Phú', tenThanh: 'Giuse', ngaySinh: '2010-05-12', gioiTinh: 'nam', doiLabel: '1' },
  ]),
  ...createClassItems(lop3A, [
    { id: 'tn-3a-001', ho: 'Trần Thị', ten: 'Bảo Trân', tenThanh: 'Maria', ngaySinh: '2011-04-06', gioiTinh: 'nu', doiLabel: '1' },
    { id: 'tn-3a-002', ho: 'Nguyễn Văn', ten: 'Hưng', tenThanh: 'Gioan', ngaySinh: '2011-10-19', gioiTinh: 'nam', doiLabel: '2' },
    { id: 'tn-3a-003', ho: 'Lê Thị', ten: 'Khánh An', tenThanh: 'Anna', ngaySinh: '2011-06-27', gioiTinh: 'nu', doiLabel: '3' },
    { id: 'tn-3a-004', ho: 'Đặng Văn', ten: 'Phước', tenThanh: 'Giuse', ngaySinh: '2011-12-11', gioiTinh: 'nam', doiLabel: '1' },
    { id: 'tn-3a-005', ho: 'Mai Thị', ten: 'Hồng Nhung', tenThanh: 'Têrêsa', ngaySinh: '2011-02-24', gioiTinh: 'nu', doiLabel: '2' },
    { id: 'tn-3a-006', ho: 'Võ Minh', ten: 'Đạt', tenThanh: 'Toma', ngaySinh: '2011-09-15', gioiTinh: 'nam', doiLabel: '1' },
  ]),
];
