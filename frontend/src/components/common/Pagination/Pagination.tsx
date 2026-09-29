import styles from './Pagination.module.scss';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageEntry = number | 'ellipsis';

function getPageEntries(page: number, totalPages: number): PageEntry[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pageNumbers = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
    .sort((a, b) => a - b);
  const entries: PageEntry[] = [];

  pageNumbers.forEach((pageNumber, index) => {
    const previousPage = pageNumbers[index - 1];
    if (previousPage !== undefined) {
      if (pageNumber - previousPage === 2) entries.push(previousPage + 1);
      if (pageNumber - previousPage > 2) entries.push('ellipsis');
    }
    entries.push(pageNumber);
  });

  return entries;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const currentPage = Math.min(Math.max(Math.trunc(page), 1), totalPages);
  const entries = getPageEntries(currentPage, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Phân trang">
      <button
        className={styles.arrowButton}
        type="button"
        aria-label="Trang trước"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>
      {entries.map((entry, index) => entry === 'ellipsis' ? (
        <span className={styles.ellipsis} key={`ellipsis-${index}`} aria-hidden="true">…</span>
      ) : (
        <button
          className={`${styles.pageButton} ${entry === currentPage ? styles.currentPage : ''}`}
          key={entry}
          type="button"
          aria-label={`Trang ${entry}`}
          aria-current={entry === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(entry)}
        >
          {entry}
        </button>
      ))}
      <button
        className={styles.arrowButton}
        type="button"
        aria-label="Trang sau"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;
