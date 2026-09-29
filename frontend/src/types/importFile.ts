

/**
 * Các trạng thái của luồng import, dùng mảng `as const` thay vì `enum`
 * vì tsconfig đang bật erasableSyntaxOnly (không cho phép enum thật).
 */
export const IMPORT_STEP = {
  CHON_FILE: 'chon-file',       // đang ở bước chọn file (bước này)
  DANG_DOC: 'dang-doc',         // đã gửi backend, đang chờ preview (bước sau)
  XEM_TRUOC: 'xem-truoc',       // đã có bảng dữ liệu để xem/sửa (bước sau)
  DANG_IMPORT: 'dang-import',   // đang gọi commit (bước sau)
  THANH_CONG: 'thanh-cong',
  THAT_BAI: 'that-bai',
} as const;

// Lấy kiểu union 'chon-file' | 'dang-doc' | ... từ object trên,
// để không phải viết tay lại chuỗi các giá trị
export type ImportStep = (typeof IMPORT_STEP)[keyof typeof IMPORT_STEP];

export type ImportRowFieldError = {
  field: 'tenThanh' | 'ho' | 'ten' | 'ngaySinh';
  message: string;
};

export type ImportRowDuplicateInFile = {
  // Trỏ tới rowId của dòng bị trùng đầu tiên trong file (dòng "gốc"),
  // để hiển thị kiểu "Trùng với dòng 2"
  duplicateOfRowId: string;
  reason: 'ho_ten' | 'ngay_sinh' | 'ca_hai';
};

/**
 * Một dòng dữ liệu trong bảng xem trước. Đây là dữ liệu ĐÃ ĐƯỢC PARSE
 * và có thể bị người dùng CHỈNH SỬA ngay trên UI — khác với dữ liệu
 * thô đọc trực tiếp từ file Excel.
 */
export type ImportPreviewRow = {
  // id tạm sinh ở frontend (không phải id thật trong DB), dùng để
  // React key và để tham chiếu qua lại giữa các dòng (duplicateOfRowId)
  rowId: string;

  // Số dòng gốc trong file Excel (để người dùng đối chiếu lại file
  // gốc nếu cần), KHÁC với STT hiển thị (STT tự sinh theo thứ tự
  // hiện tại trong bảng, sẽ đổi nếu có dòng bị xóa)
  originalExcelRow: number;

  tenThanh: string;
  ho: string;
  ten: string;
  ngaySinh: string; // giữ dạng chuỗi 'YYYY-MM-DD' để nhất quán với
                     // toàn bộ phần còn lại của dự án (formatNgaySinh...)
  doi: string;       // giữ dạng chuỗi để người dùng gõ tự do trong ô sửa,
                      // ép kiểu số khi thật sự cần dùng
  soDienThoai: string;

  fieldErrors: ImportRowFieldError[];  // rỗng nghĩa là không lỗi chặn
  duplicateInFile: ImportRowDuplicateInFile | null;

  // Đánh dấu người dùng đã bấm "xóa" dòng này (ẩn khỏi bảng, không
  // đưa vào bước import) — KHÔNG xóa khỏi mảng để còn giữ lại cho
  // trường hợp người dùng muốn "hoàn tác" (chưa làm ở bước này,
  // nhưng để sẵn cấu trúc)
  removed: boolean;

  // Sẽ được điền ở bước sau (gọi API backend), tạm để null —
  // đại diện cho việc dòng này trùng với dữ liệu ĐÃ CÓ trong DB
  dbDuplicate: { existingId: string; existingLabel: string; reason: string } | null;
};