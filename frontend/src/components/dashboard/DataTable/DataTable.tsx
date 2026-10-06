import type { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import styles from './DataTable.module.scss';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  group?: { id: string; title: string; expanded: boolean; onToggle: () => void };
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
};

function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  error = null,
  onRetry,
  emptyMessage = 'Không có dữ liệu',
}: DataTableProps<T>) {
  const visibleColumns = columns;
  const columnCount = Math.max(visibleColumns.length, 1);
  const groups = visibleColumns.reduce<{ id: string; title: string; expanded: boolean; onToggle: () => void; count: number }[]>((result, column) => {
    const group = column.group;
    if (!group) return result;
    const last = result[result.length - 1];
    if (last?.id === group.id) last.count += 1;
    else result.push({ ...group, count: 1 });
    return result;
  }, []);
  const hasGroups = groups.length > 0;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          {hasGroups && <tr>{visibleColumns.map((column) => {
            if (!column.group) return <th key={column.key} rowSpan={2} scope="col">{column.header}</th>;
            const first = visibleColumns.find((candidate) => candidate.group?.id === column.group?.id)?.key === column.key;
            if (!first) return null;
            const group = groups.find((candidate) => candidate.id === column.group?.id)!;
            return <th key={group.id} scope="colgroup" colSpan={group.count}>
              <button type="button" onClick={group.onToggle} aria-expanded={group.expanded}>
                {group.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />} {group.title}
              </button>
            </th>;
          })}</tr>}
          <tr>
            {visibleColumns.map((column) => (
              hasGroups && !column.group ? null : <th key={column.key} scope="col">
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
