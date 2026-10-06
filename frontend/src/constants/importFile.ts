

export const IMPORT_FILE_CONSTRAINTS = {
  // Chỉ chấp nhận đuôi .xlsx (không nhận .xls bản cũ, .csv...)
  allowedExtension: '.xlsx',

  // Dung lượng tối đa 2MB — đủ cho vài trăm dòng dữ liệu text,
  // chặn sớm để không phải upload file nặng rồi mới báo lỗi
  maxSizeBytes: 2 * 1024 * 1024,

  // Giới hạn preview đồng nhất với backend để payload và đối chiếu DB có giới hạn.
  maxRows: 500,

  // Kiểu MIME "chuẩn" của file .xlsx. Lưu ý: trình duyệt/hệ điều hành đôi khi
  // báo sai kiểu MIME (ví dụ Windows có lúc báo application/vnd.ms-excel cho
  // cả file .xlsx mới), nên KHÔNG dùng để chặn cứng — chỉ tham khảo, việc
  // xác định "đây có đúng là file Excel không" để chặn thật sự nằm ở việc
  // thử đọc file bằng thư viện xlsx (làm ở bước sau) và ở backend.
  expectedMimeType:
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
} as const;
