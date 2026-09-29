import type { ReactNode } from 'react';
import styles from './DataTable.module.scss';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  hideWhenSingleClass?: boolean;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  showClassColumn?: boolean;
};

function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  error = null,
  onRetry,
  emptyMessage = 'Không có dữ liệu',
  showClassColumn = true,
}: DataTableProps<T>) {
  const visibleColumns = columns.filter(
    (column) => !column.hideWhenSingleClass || showClassColumn,
  );
  const columnCount = Math.max(visibleColumns.length, 1);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {visibleColumns.map((column) => (
              <th key={column.key} scope="col">
                {column.header && <span>{column.header}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }, (_, rowIndex) => (
              <tr className={styles.skeletonRow} key={`skeleton-${rowIndex}`} aria-hidden="true">
                {visibleColumns.map((column, columnIndex) => (
                  <td key={column.key}>
                    <span className={`${styles.skeleton} ${styles[`skeletonWidth${columnIndex % 3}`]}`} />
                  </td>
                ))}
              </tr>
            ))
          ) : error ? (
            <tr>
              <td className={styles.stateCell} colSpan={columnCount}>
                <div className={styles.errorState} role="alert">
                  <span>{error}</span>
                  {onRetry && (
                    <button className={styles.retryButton} type="button" onClick={onRetry}>
                      Thử lại
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td className={styles.stateCell} colSpan={columnCount}>
                <div className={styles.emptyState}>{emptyMessage}</div>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr className={styles.dataRow} key={rowKey(row)}>
                {visibleColumns.map((column) => (
                  <td key={column.key}>{column.render(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
