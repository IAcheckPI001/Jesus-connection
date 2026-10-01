import { Pencil } from 'lucide-react';
import DataTable from '../DataTable/DataTable';
import type { DataTableColumn } from '../DataTable/DataTable';
import type { ThieuNhiListItem } from '../../../types/thieuNhi';
import { formatNgaySinh, getFullName, getRowNumber } from '../../../utils/thieuNhi';
import styles from './ThieuNhiRow.module.scss';

type ThieuNhiRowProps<T extends ThieuNhiListItem & { attendance?: Record<string, string | null>; scores?: Record<string, number | null> }> = {
  rows: T[];
  startIndex: number;
  showClassColumn: boolean;
  canEdit?: (row: ThieuNhiListItem) => boolean;
  onEdit: (id: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  layout?: 'desktop' | 'mobile';
  extraColumns?: DataTableColumn<T & { rowNumber: number }>[];
};

function ThieuNhiRow<T extends ThieuNhiListItem & { attendance?: Record<string, string | null>; scores?: Record<string, number | null> }>({
  rows,
  startIndex,
  showClassColumn,
  canEdit,
  onEdit,
  isLoading,
  error,
  onRetry,
  layout = 'desktop',
  extraColumns = [],
}: ThieuNhiRowProps<T>) {
  const canEditRow = canEdit ?? (() => true);
  type IndexedThieuNhi = T & { rowNumber: number };
  const indexedRows: IndexedThieuNhi[] = rows.map((row, index) => ({
    ...row,
    rowNumber: getRowNumber(1, 1, startIndex + index - 1),
  }));
  const desktopColumns: DataTableColumn<IndexedThieuNhi>[] = [
    {
      key: 'stt',
      header: 'STT',
      render: (row) => row.rowNumber,
    },
    {
      key: 'ten-thanh',
      header: 'Tên thánh',
      render: (row) => row.tenThanh ?? '',
    },
    {
      key: 'ho',
      header: 'Họ',
      render: (row) => row.ho,
    },
    {
      key: 'ten',
      header: 'Tên',
      render: (row) => row.ten,
    },
    {
      key: 'ngay-sinh',
      header: 'Ngày sinh',
      render: (row) => formatNgaySinh(row.ngaySinh),
    },
    {
      key: 'lop',
      header: 'Lớp',
      hideWhenSingleClass: true,
      render: (row) => row.lopTen,
    },
    {
      key: 'doi',
      header: 'Đội',
      render: (row) => row.doiLabel ?? '',
    },
    {
      key: 'edit',
      header: '',
      render: (row) => canEditRow(row) ? (
        <button
          className={styles.editButton}
          type="button"
          aria-label={`Chỉnh sửa ${getFullName(row.ho, row.ten)}`}
          onClick={() => onEdit(row.id)}
        >
          <Pencil aria-hidden="true" />
        </button>
      ) : null,
    },
  ];

  const mobileColumns: DataTableColumn<IndexedThieuNhi>[] = [
    {
      key: 'stt',
      header: 'STT',
      render: (row) => row.rowNumber,
    },
    {
      key: 'ten-thanh',
      header: 'Tên thánh',
      render: (row) => row.tenThanh ?? '',
    },
    {
      key: 'ho-ten',
      header: 'Họ và tên',
      render: (row) => getFullName(row.ho, row.ten),
    },
    {
      key: 'ngay-sinh',
      header: 'Ngày sinh',
      render: (row) => formatNgaySinh(row.ngaySinh),
    },
    {
      key: 'doi',
      header: 'Đội',
      render: (row) => row.doiLabel ?? '',
    },
    {
      key: 'edit',
      header: '',
      render: (row) => canEditRow(row) ? (
        <button
          className={styles.editButton}
          type="button"
          aria-label={`Chỉnh sửa ${getFullName(row.ho, row.ten)}`}
          onClick={() => onEdit(row.id)}
        >
          <Pencil aria-hidden="true" />
        </button>
      ) : null,
    },
  ];

  return (
    <DataTable
      columns={layout === 'mobile' ? mobileColumns : [...desktopColumns.slice(0, -1), ...extraColumns, desktopColumns[desktopColumns.length - 1]]}
      rows={indexedRows}
      rowKey={(row) => row.id}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      showClassColumn={showClassColumn}
    />
  );
}

export default ThieuNhiRow;
