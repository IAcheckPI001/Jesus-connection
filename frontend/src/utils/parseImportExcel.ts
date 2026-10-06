

import * as XLSX from 'xlsx';
import type { ImportPreviewRow, ImportRowFieldError } from '../types/importFile';
import { isValidIsoDate } from './thieuNhi';

/**
 * Tên cột bắt buộc phải có trong file Excel. So khớp không phân biệt
 * hoa thường và khoảng trắng thừa, KHÔNG quan tâm thứ tự cột.
 */
const REQUIRED_HEADERS = ['Tên thánh', 'Họ', 'Tên', 'Ngày sinh'] as const;
// const OPTIONAL_HEADERS = ['Đội', 'SĐT'] as const;

export type ParseExcelResult =
  | { success: true; rows: ImportPreviewRow[], missingHeaders: string[] }
  | { success: false; missingHeaders: string[] };

/**
 * Chuẩn hóa tên cột để so sánh: bỏ khoảng trắng đầu/cuối, viết thường.
 * Tách hàm riêng để dùng nhất quán khi so khớp các header trong file.
 */
function normalizeHeaderName(header: string): string {
  return header.trim().toLowerCase();
}

/**
 * Đọc 1 ô ngày sinh từ Excel. Excel lưu ngày theo 2 dạng phổ biến:
 * - "Serial date": một số (ví dụ 39692) đại diện số ngày kể từ
 *   1899-12-30, xảy ra khi người dùng để Excel tự nhận diện ô là
 *   kiểu Date.
 * - Chuỗi text người dùng tự gõ, ví dụ "18/09/2008" hoặc "2008-09-18".
 * Hàm này xử lý cả 2 trường hợp, luôn trả về dạng chuẩn 'YYYY-MM-DD'
 * để khớp với formatNgaySinh() đã có ở utils/thieuNhi.ts.
 */
function parseExcelDateCell(cellValue: unknown): string | null {
  // Trường hợp 1: cell là số serial date (Excel tự nhận diện kiểu Date)
  if (typeof cellValue === 'number') {
    // XLSX cung cấp sẵn hàm chuyển serial date -> {y, m, d}
    const parsed = XLSX.SSF.parse_date_code(cellValue);
    if (!parsed) return null;
    const { y, m, d } = parsed;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  // Trường hợp 2: cell là chuỗi text người dùng tự gõ
  if (typeof cellValue === 'string') {
    const trimmed = cellValue.trim();

    // Dạng dd/MM/yyyy
    const ddmmyyyy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, dd, mm, yyyy] = ddmmyyyy;
      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }

    // Dạng yyyy-MM-dd (đã đúng chuẩn sẵn)
    const yyyymmdd = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (yyyymmdd) {
      const [, yyyy, mm, dd] = yyyymmdd;
      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
  }

  return null; // không đọc được, coi như thiếu/sai ngày sinh
}

/**
 * Kiểm tra chuỗi 'YYYY-MM-DD' có phải một ngày THẬT SỰ tồn tại không
 * (chặn trường hợp như 2008-02-30 — regex ở trên chỉ kiểm tra ĐÚNG
 * ĐỊNH DẠNG, không kiểm tra ngày đó có thật hay không).
 */
/**
 * Validate các trường bắt buộc của 1 dòng, trả về danh sách lỗi
 * (rỗng nếu dòng hợp lệ). Đây là bản validate PHÍA FRONTEND, chỉ để
 * phản hồi nhanh — backend cũng chạy lại các rule này
 * một lần nữa, không tin kết quả validate của frontend.
 */
export function validateRequiredFieldsForRow(row: {
  tenThanh: string;
  ho: string;
  ten: string;
  ngaySinh: string;
}): ImportRowFieldError[] {
  const errors: ImportRowFieldError[] = [];

  if (!row.tenThanh.trim()) {
    errors.push({ field: 'tenThanh', message: 'Thiếu tên thánh' });
  }
  if (!row.ho.trim()) {
    errors.push({ field: 'ho', message: 'Thiếu họ' });
  }
  if (!row.ten.trim()) {
    errors.push({ field: 'ten', message: 'Thiếu tên' });
  }
  if (!row.ngaySinh) {
    errors.push({ field: 'ngaySinh', message: 'Ngày sinh không hợp lệ' });
  } else if (!isValidIsoDate(row.ngaySinh)) {
    errors.push({ field: 'ngaySinh', message: 'Ngày sinh không hợp lệ' });
  }

  return errors;
}

/**
 * Tìm sớm các dòng trùng NHAU TRONG CÙNG FILE; backend tính lại kết quả
 * preview trước khi trả cho giao diện. Quy tắc trùng: khớp họ
 * VÀ tên (không phân biệt hoa thường/khoảng trắng thừa), HOẶC khớp
 * ngày sinh.
 *
 * Cách làm: duyệt tuần tự, dòng nào khớp với 1 dòng ĐÃ DUYỆT TRƯỚC
 * ĐÓ thì đánh dấu là bản sao của dòng đó (dòng đầu tiên trong nhóm
 * trùng không bị đánh dấu — coi là dòng "gốc").
 */
function detectDuplicatesWithinFile(
  rows: Omit<ImportPreviewRow, 'duplicateInFile'>[]
): Map<string, ImportPreviewRow['duplicateInFile']> {
  const result = new Map<string, ImportPreviewRow['duplicateInFile']>();

  // Khóa để so khớp họ tên: viết thường, bỏ khoảng trắng thừa
  const hoTenKey = (r: { ho: string; ten: string }) =>
    `${r.ho.trim().toLowerCase()}|${r.ten.trim().toLowerCase()}`;

  // Nơi lưu "dòng gốc" đã thấy, theo từng loại khóa
  const seenByHoTen = new Map<string, string>(); // khóa họ tên -> rowId gốc
  const seenByNgaySinh = new Map<string, string>(); // ngày sinh -> rowId gốc

  for (const row of rows) {
    // Bỏ qua dòng đã lỗi chặn — dòng lỗi thì chưa đủ dữ liệu để so trùng
    // một cách đáng tin cậy (ví dụ thiếu ngày sinh thì không so được)
    if (row.fieldErrors.length > 0) continue;

    const keyHoTen = hoTenKey(row);
    const matchedByHoTen = seenByHoTen.get(keyHoTen);
    const matchedByNgaySinh = seenByNgaySinh.get(row.ngaySinh);

    if (matchedByHoTen && matchedByNgaySinh) {
      result.set(row.rowId, {
        duplicateOfRowId: matchedByHoTen,
        reason: 'ca_hai',
      });
    } else if (matchedByHoTen) {
      result.set(row.rowId, {
        duplicateOfRowId: matchedByHoTen,
        reason: 'ho_ten',
      });
    } else if (matchedByNgaySinh) {
      result.set(row.rowId, {
        duplicateOfRowId: matchedByNgaySinh,
        reason: 'ngay_sinh',
      });
    }

    // Chỉ ghi nhận "dòng gốc" nếu đây là lần đầu thấy khóa này —
    // để các dòng trùng tiếp theo luôn trỏ về đúng dòng gốc đầu tiên,
    // không trỏ lung tung qua lại giữa các dòng trùng với nhau
    if (!seenByHoTen.has(keyHoTen)) seenByHoTen.set(keyHoTen, row.rowId);
    if (!seenByNgaySinh.has(row.ngaySinh)) seenByNgaySinh.set(row.ngaySinh, row.rowId);
  }

  return result;
}

/**
 * Hàm chính: nhận vào 1 File, trả về kết quả đọc + validate.
 * Đây là hàm async vì đọc file cần chờ (FileReader/ArrayBuffer).
 */
export async function parseImportExcel(file: File): Promise<ParseExcelResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  // Chỉ đọc sheet đầu tiên — file mẫu chỉ nên có 1 sheet dữ liệu
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  // header: 1 nghĩa là lấy dữ liệu dạng mảng-các-mảng (không tự suy
  // luận cột theo dòng đầu), để mình tự kiểm soát việc đọc header
  const raw: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (raw.length === 0) {
    return { success: false, missingHeaders: [...REQUIRED_HEADERS] };
  }

  const headerRow = raw[0].map((h) => normalizeHeaderName(String(h ?? '')));

  // Với mỗi cột cần tìm, xác định nó nằm ở VỊ TRÍ (index) nào trong
  // headerRow — vì người dùng có thể sắp xếp cột theo thứ tự tùy ý
  const findColumnIndex = (headerName: string) =>
    headerRow.indexOf(normalizeHeaderName(headerName));

  const columnIndexes = {
    tenThanh: findColumnIndex('Tên thánh'),
    ho: findColumnIndex('Họ'),
    ten: findColumnIndex('Tên'),
    ngaySinh: findColumnIndex('Ngày sinh'),
    doi: findColumnIndex('Đội'),
    soDienThoai: findColumnIndex('SDT'),
  };

  const missingHeaders = REQUIRED_HEADERS.filter(
    (h) => findColumnIndex(h) === -1
  );

  if (missingHeaders.length > 0) {
    return { success: false, missingHeaders };
  }

  // Đọc từng dòng dữ liệu (bỏ qua dòng 0 vì đó là header)
  const dataRows = raw.slice(1);

  const parsedRows = dataRows
    // Bỏ qua các dòng hoàn toàn trống (Excel hay để lại dòng rỗng thừa
    // ở cuối file khi người dùng xóa dữ liệu nhưng không xóa dòng)
    .filter((r) => r.some((cell) => cell !== undefined && cell !== ''))
    .map((r, index): Omit<ImportPreviewRow, 'duplicateInFile'> => {
      const getCell = (colIndex: number): string => {
        if (colIndex === -1) return '';
        const value = r[colIndex];
        return value === undefined || value === null ? '' : String(value).trim();
      };

      const tenThanh = getCell(columnIndexes.tenThanh);
      const ho = getCell(columnIndexes.ho);
      const ten = getCell(columnIndexes.ten);
      const ngaySinhRaw = columnIndexes.ngaySinh === -1 ? null : r[columnIndexes.ngaySinh];
      const ngaySinh = parseExcelDateCell(ngaySinhRaw) ?? '';

      return {
        rowId: `row-${index}`,
        originalExcelRow: index + 2, // +2 vì: +1 do index bắt đầu từ 0,
                                       // +1 nữa vì dòng 1 là header
        tenThanh,
        ho,
        ten,
        ngaySinh,
        doi: getCell(columnIndexes.doi),
        soDienThoai: getCell(columnIndexes.soDienThoai),
        fieldErrors: validateRequiredFieldsForRow({ tenThanh, ho, ten, ngaySinh }),
        removed: false,
        dbDuplicate: null, // backend preview sẽ điền kết quả đối chiếu trong lớp
      };
    });

  const duplicateMap = detectDuplicatesWithinFile(parsedRows);

  const rows: ImportPreviewRow[] = parsedRows.map((row) => ({
    ...row,
    duplicateInFile: duplicateMap.get(row.rowId) ?? null,
  }));

  return { success: true, rows, missingHeaders: [] };
}
