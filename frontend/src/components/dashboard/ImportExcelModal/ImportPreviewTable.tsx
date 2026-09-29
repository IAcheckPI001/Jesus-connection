

// src/components/dashboard/ImportExcelModal/ImportPreviewTable.tsx
import type { ImportPreviewRow } from '../../../types/importFile';
import { validateRequiredFieldsForRow } from '../../../utils/parseImportExcel';
import styles from './ImportPreviewTable.module.css';

type ImportPreviewTableProps = {
  rows: ImportPreviewRow[];
  onRowsChange: (rows: ImportPreviewRow[]) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

function ImportPreviewTable({
  rows,
  onRowsChange,
  onCancel,
  onConfirm,
}: ImportPreviewTableProps) {
  // Chỉ các dòng chưa bị xóa mới hiển thị và mới được đánh STT
  const visibleRows = rows.filter((r) => !r.removed);

  // Có ít nhất 1 dòng lỗi chặn trong số các dòng đang hiển thị không —
  // dùng để disable nút "Xác nhận" (theo yêu cầu: dòng lỗi vẫn hiện
  // trong bảng và cho sửa, nhưng phải hết lỗi mới xác nhận được)
  const hasBlockingError = visibleRows.some((r) => r.fieldErrors.length > 0);

  /**
   * Cập nhật 1 field của 1 dòng cụ thể. Sau khi sửa, phải chạy lại
   * validateRequiredFields cho đúng dòng đó — nếu không, sửa xong
   * lỗi vẫn còn hiện đỏ dù dữ liệu đã đúng.
   */
  function handleFieldChange(
    rowId: string,
    field: 'tenThanh' | 'ho' | 'ten' | 'ngaySinh' | 'doi' | 'soDienThoai',
    value: string
  ) {
    onRowsChange(
      rows.map((row) => {
        if (row.rowId !== rowId) return row;

        const updated = { ...row, [field]: value };

        // Chỉ 4 field bắt buộc mới cần validate lại
        if (
            field === 'tenThanh' ||
            field === 'ho' ||
            field === 'ten' ||
            field === 'ngaySinh'
        ) {
            updated.fieldErrors = validateRequiredFieldsForRow(updated);
        }

        return updated;
      })
    );
  }

  function handleRemoveRow(rowId: string) {
    onRowsChange(
      rows.map((row) => (row.rowId === rowId ? { ...row, removed: true } : row))
    );
  }

  function getFieldError(row: ImportPreviewRow, field: string) {
    return row.fieldErrors.find((e) => e.field === field)?.message;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableScroll}>
        <table>
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên thánh</th>
              <th scope="col">Họ</th>
              <th scope="col">Tên</th>
              <th scope="col">Ngày sinh</th>
              <th scope="col">Đội</th>
              <th scope="col">SĐT</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">
                <span className={styles.srOnly}>Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, index) => (
              <tr
                key={row.rowId}
                className={
                  row.fieldErrors.length > 0
                    ? styles.rowError
                    : row.duplicateInFile
                      ? styles.rowDuplicate
                      : undefined
                }
              >
                <td>{index + 1}</td>

                {/* Mỗi ô bắt buộc là 1 input, sửa trực tiếp tại chỗ */}
                <td>
                  <input
                    value={row.tenThanh}
                    aria-label={`Tên thánh dòng ${index + 1}`}
                    aria-invalid={!!getFieldError(row, 'tenThanh')}
                    onChange={(e) =>
                      handleFieldChange(row.rowId, 'tenThanh', e.target.value)
                    }
                  />
                  {getFieldError(row, 'tenThanh') && (
                    <span className={styles.cellError}>
                      {getFieldError(row, 'tenThanh')}
                    </span>
                  )}
                </td>

                <td>
                  <input
                    value={row.ho}
                    aria-label={`Họ dòng ${index + 1}`}
                    aria-invalid={!!getFieldError(row, 'ho')}
                    onChange={(e) => handleFieldChange(row.rowId, 'ho', e.target.value)}
                  />
                  {getFieldError(row, 'ho') && (
                    <span className={styles.cellError}>{getFieldError(row, 'ho')}</span>
                  )}
                </td>

                <td>
                  <input
                    value={row.ten}
                    aria-label={`Tên dòng ${index + 1}`}
                    aria-invalid={!!getFieldError(row, 'ten')}
                    onChange={(e) => handleFieldChange(row.rowId, 'ten', e.target.value)}
                  />
                  {getFieldError(row, 'ten') && (
                    <span className={styles.cellError}>{getFieldError(row, 'ten')}</span>
                  )}
                </td>

                <td>
                  {/* input type="date" để tránh người dùng gõ sai định
                      dạng khi tự sửa — trình duyệt tự hiện lịch chọn */}
                  <input
                    type="date"
                    value={row.ngaySinh}
                    aria-label={`Ngày sinh dòng ${index + 1}`}
                    aria-invalid={!!getFieldError(row, 'ngaySinh')}
                    onChange={(e) =>
                      handleFieldChange(row.rowId, 'ngaySinh', e.target.value)
                    }
                  />
                  {getFieldError(row, 'ngaySinh') && (
                    <span className={styles.cellError}>
                      {getFieldError(row, 'ngaySinh')}
                    </span>
                  )}
                </td>

                <td>
                  <input
                    value={row.doi}
                    aria-label={`Đội dòng ${index + 1}`}
                    onChange={(e) => handleFieldChange(row.rowId, 'doi', e.target.value)}
                  />
                </td>

                <td>
                  <input
                    value={row.soDienThoai}
                    aria-label={`Số điện thoại dòng ${index + 1}`}
                    onChange={(e) =>
                      handleFieldChange(row.rowId, 'soDienThoai', e.target.value)
                    }
                  />
                </td>

                <td>
                  {row.fieldErrors.length > 0 && (
                    <span className={styles.badgeError}>Thiếu thông tin</span>
                  )}
                  {row.fieldErrors.length === 0 && row.duplicateInFile && (
                    <span className={styles.badgeWarning}>
                      Trùng với dòng{' '}
                      {rows.findIndex(
                        (r) => r.rowId === row.duplicateInFile?.duplicateOfRowId
                      ) + 1}
                    </span>
                  )}
                  {row.fieldErrors.length === 0 && !row.duplicateInFile && (
                    <span className={styles.badgeOk}>Hợp lệ</span>
                  )}
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(row.rowId)}
                    aria-label={`Xóa dòng ${index + 1}`}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.summary}>
        {visibleRows.length} dòng sẽ được import
        {hasBlockingError && ' — vui lòng sửa các dòng còn thiếu thông tin'}
      </p>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel}>
          Hủy
        </button>
        <button type="button" disabled={hasBlockingError} onClick={onConfirm}>
          Xác nhận
        </button>
      </div>
    </div>
  );
}

export default ImportPreviewTable;