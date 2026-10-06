// src/components/dashboard/ImportExcelModal/ImportExcelModal.tsx
import { useRef, useState } from 'react';
import { validateSelectedFile } from '../../../utils/importFileValidation';
import { parseImportExcel } from '../../../utils/parseImportExcel';
import { IMPORT_STEP, type ImportStep, type ImportPreviewRow } from '../../../types/importFile';
import { IMPORT_FILE_CONSTRAINTS } from '../../../constants/importFile';
import { importService } from '../../../services/importService';
import ImportPreviewTable from './ImportPreviewTable';
import styles from './ImportExcelModal.module.scss';

type ImportExcelModalProps = {
  classId: string;
  onClose: () => void;
};

function ImportExcelModal({ classId, onClose }: ImportExcelModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [headerError, setHeaderError] = useState<string | null>(null);
  const [step, setStep] = useState<ImportStep>(IMPORT_STEP.CHON_FILE);
  const [rows, setRows] = useState<ImportPreviewRow[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePickFileClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ''; // cho phép chọn lại đúng file cũ sau khi báo lỗi

    if (!file) return;

    const result = validateSelectedFile(file);

    if (!result.valid) {
      setFileError(result.message);
      setSelectedFile(null);
      return;
    }

    setFileError(null);
    setHeaderError(null);
    setSelectedFile(file);
  }

  function handleRemoveSelectedFile() {
    setSelectedFile(null);
    setFileError(null);
    setHeaderError(null);
  }

  async function handleContinue() {
    if (!selectedFile || !classId) return;

    setStep(IMPORT_STEP.DANG_DOC);
    setHeaderError(null);

    try {
      const result = await parseImportExcel(selectedFile);

      if (!result.success) {
        setHeaderError(`Thiếu cột bắt buộc trong file: ${result.missingHeaders.join(', ')}`);
        setStep(IMPORT_STEP.CHON_FILE);
        return;
      }

      if (result.rows.length === 0) {
        setHeaderError('File không có dòng dữ liệu nào');
        setStep(IMPORT_STEP.CHON_FILE);
        return;
      }
      if (result.rows.length > IMPORT_FILE_CONSTRAINTS.maxRows) {
        setHeaderError(`File vượt quá ${IMPORT_FILE_CONSTRAINTS.maxRows} dòng tối đa`);
        setStep(IMPORT_STEP.CHON_FILE);
        return;
      }

      const preview = await importService.preview(classId, result.rows.map((row) => ({
        rowId: row.rowId,
        originalExcelRow: row.originalExcelRow,
        tenThanh: row.tenThanh,
        ho: row.ho,
        ten: row.ten,
        ngaySinh: row.ngaySinh,
        doi: row.doi,
        soDienThoai: row.soDienThoai,
      })));
      setRows(preview.items);
      setStep(IMPORT_STEP.XEM_TRUOC);
    } catch {
      setHeaderError('Không thể đọc file hoặc kiểm tra dữ liệu với máy chủ. Vui lòng thử lại.');
      setStep(IMPORT_STEP.CHON_FILE);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-excel-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="import-excel-title">Import file Excel</h2>

        {step === IMPORT_STEP.CHON_FILE && (
          <div className={styles.pickFileArea}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className={styles.hiddenInput}
              onChange={handleFileChange}
            />

            {!selectedFile && (
              <button type="button" onClick={handlePickFileClick}>
                Chọn file Excel
              </button>
            )}

            {selectedFile && (
              <div className={styles.selectedFile}>
                <span>{selectedFile.name}</span>
                <button type="button" onClick={handleRemoveSelectedFile}>
                  Đổi file khác
                </button>
              </div>
            )}

            {headerError && (
              <p role="alert" className={styles.errorText}>
                {headerError}
              </p>
            )}
            {fileError && (
              <p role="alert" className={styles.errorText}>
                {fileError}
              </p>
            )}

            <p className={styles.hint}>
              Chỉ chấp nhận file {IMPORT_FILE_CONSTRAINTS.allowedExtension}, tối đa{' '}
              {IMPORT_FILE_CONSTRAINTS.maxSizeBytes / (1024 * 1024)}MB.
            </p>

            <div className={styles.actions}>
              <button type="button" onClick={onClose}>
                Hủy
              </button>
              <button type="button" disabled={!selectedFile} onClick={handleContinue}>
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {step === IMPORT_STEP.DANG_DOC && <p>Đang đọc file...</p>}

        {step === IMPORT_STEP.XEM_TRUOC && (
          <ImportPreviewTable
            rows={rows}
            onRowsChange={setRows}
            onCancel={onClose}
            onConfirm={() => {
              // Bước commit chưa triển khai; backend phải validate lại các dòng cuối cùng.
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ImportExcelModal;
