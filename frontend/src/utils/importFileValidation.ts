

import { IMPORT_FILE_CONSTRAINTS } from '../constants/importFile';

/**
 * Kết quả kiểm tra file. Dùng union type thay vì boolean + message riêng,
 * để TypeScript ép phải check `valid` trước khi đọc `message`
 * (nếu valid = true thì chắc chắn không có message, tránh hiển thị nhầm).
 */
export type FileValidationResult =
  | { valid: true; message: string }
  | { valid: false; message: string };

/**
 * Kiểm tra sơ bộ file người dùng vừa chọn, TRƯỚC khi đọc nội dung
 * hay gửi lên backend. Chỉ là bước lọc nhanh, không thay thế cho
 * việc backend tự validate lại toàn bộ.
 */
export function validateSelectedFile(file: File): FileValidationResult {
  // 1. Kiểm tra đuôi file — dùng tên file, không dùng file.type,
  //    vì đuôi file là thứ người dùng nhìn thấy và hiểu rõ nhất khi có lỗi.
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith(IMPORT_FILE_CONSTRAINTS.allowedExtension)) {
    return {
      valid: false,
      message: `Chỉ chấp nhận file ${IMPORT_FILE_CONSTRAINTS.allowedExtension}`,
    };
  }

  // 2. Kiểm tra dung lượng
  if (file.size > IMPORT_FILE_CONSTRAINTS.maxSizeBytes) {
    const maxMB = IMPORT_FILE_CONSTRAINTS.maxSizeBytes / (1024 * 1024);
    return {
      valid: false,
      message: `File vượt quá dung lượng tối đa ${maxMB}MB`,
    };
  }

  // 3. Kiểm tra file không rỗng (0 byte) — trường hợp hay gặp khi
  //    người dùng lỡ chọn nhầm file rỗng hoặc file bị lỗi khi tải về
  if (file.size === 0) {
    return { valid: false, message: 'File rỗng, vui lòng chọn file khác' };
  }

  // Không chặn cứng theo file.type ở đây (xem giải thích ở constants),
  // việc file có THỰC SỰ đọc được như Excel hay không sẽ lộ ra ở bước
  // đọc bằng thư viện xlsx (nếu đọc lỗi, coi như file sai định dạng).
  return { valid: true, message: '' };
}