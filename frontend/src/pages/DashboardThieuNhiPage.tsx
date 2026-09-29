import { useEffect, useState } from 'react';
import { Mars, Users, Venus } from 'lucide-react';
import ClassPicker from '../components/dashboard/ClassPicker/ClassPicker';
import StatsBar from '../components/dashboard/StatsBar/StatsBar';
import type { StatsBarItem } from '../components/dashboard/StatsBar/StatsBar';
import ThieuNhiRow from '../components/dashboard/ThieuNhiRow/ThieuNhiRow';
import FabMenu from '../components/dashboard/FabMenu/FabMenu';
import type { FabAction } from '../components/dashboard/FabMenu/FabMenu';
import Pagination from '../components/common/Pagination/Pagination';
import SearchInput from '../components/common/SearchInput/SearchInput';
import { DEFAULT_PAGE_SIZE, DEFAULT_TRANG_THAI_FILTER } from '../constants/thieuNhi';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useLopOptions } from '../hooks/useLopOptions';
import { useThieuNhiList } from '../hooks/useThieuNhiList';
import type { TrangThaiFilter } from '../types/thieuNhi';
import { getRowNumber } from '../utils/thieuNhi';
import ImportExcelModal from '../components/dashboard/ImportExcelModal/ImportExcelModal';
import styles from './DashboardThieuNhiPage.module.scss';

function DashboardThieuNhiPage() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 1023px)').matches,
  );
  const { options } = useLopOptions();
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>(
    () => options[0] ? [options[0].id] : [],
  );
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput);
  const [page, setPage] = useState(1);
  const [trangThai] = useState<TrangThaiFilter>(DEFAULT_TRANG_THAI_FILTER);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const updateLayout = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener('change', updateLayout);
    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, []);

  useEffect(() => {
    if (options.length === 0) return undefined;
    const timer = window.setTimeout(() => {
      setSelectedClassIds((currentIds) => currentIds.length > 0 ? currentIds : [options[0].id]);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [options]);

  useEffect(() => {
    const timer = window.setTimeout(() => setPage(1), 0);
    return () => window.clearTimeout(timer);
  }, [selectedClassIds, debouncedSearch, trangThai]);

  const {
    items,
    totalPages,
    page: effectivePage,
    stats,
    isLoading,
    error,
    refetch,
  } = useThieuNhiList({
    classIds: selectedClassIds,
    search: debouncedSearch,
    trangThai,
    page,
  });

  const statItems: StatsBarItem[] = [
    { key: 'si-so', icon: <Users />, value: stats.siSo, label: 'Thiếu nhi', eyebrow: 'Sĩ số' },
    { key: 'nu', icon: <Venus />, value: stats.nu, label: 'Nữ' },
    { key: 'nam', icon: <Mars />, value: stats.nam, label: 'Nam' },
  ];

  const handleEdit = (id: string) => {
    // TODO: Connect this action to the child detail route when that route exists.
    console.log('edit', id);
  };

  const [isImportModalOpen, setImportModalOpen] = useState(false);

  const handleFabAction = (action: FabAction) => {
    switch (action) {
      case 'import-excel':
        // TODO: Implement the Excel import flow.
        setImportModalOpen(true);
        break;
      case 'tao-phieu-diem-danh':
        // TODO: Implement attendance sheet creation.
        console.log(action);
        break;
      case 'xuat-danh-sach':
        // TODO: Implement list export.
        console.log(action);
        break;
      default:
        break;
    }
  };


  return (
    <div className={styles.page}>
      <header className={styles.topline}>
        {/* TODO: Replace the sample greeting with the signed-in user's name. */}
        <p className={styles.greeting}>Xin chào, Đông 👋</p>
        {/* CHỜ XÁC NHẬN: đích đến của nút chi tiết. */}
        <div className={styles.buttonFramme}>
          <button
            className={styles.importButton}
            type="button"
            title="Import Excel"
          >
            <svg viewBox="64 64 896 896" focusable="false" data-icon="upload" width="1.25em" height="1.25em" fill="currentColor" aria-hidden="true"><path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path></svg>
            <span style={{marginLeft: '4px'}}>Import File</span>
          </button>
          <button
            className={styles.detailsButton}
            type="button"
            disabled
            title="Chưa xác định đích đến"
          >
            Xem chi tiết
          </button>
        </div>
      </header>

      <StatsBar items={statItems} isLoading={isLoading} />

      <section className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <div className={styles.tableTitleGroup}>
            <ClassPicker
              options={options}
              selectedIds={selectedClassIds}
              onChange={setSelectedClassIds}
            />
            <p className={styles.tableSubtitle}>Danh sách thiếu nhi</p>
          </div>
          <SearchInput
            className={styles.searchInput}
            value={searchInput}
            onChange={setSearchInput}
            ariaLabel="Tìm kiếm thiếu nhi"
            variant="filled"
          />
        </div>

        <div className={styles.tableFrame}>
          <ThieuNhiRow
            rows={items}
            startIndex={getRowNumber(effectivePage, DEFAULT_PAGE_SIZE, 0)}
            showClassColumn={selectedClassIds.length > 1}
            layout={isMobile ? 'mobile' : 'desktop'}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            onEdit={handleEdit}
          />
        </div>

        <div className={styles.paginationRow}>
          <Pagination page={effectivePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>
      <FabMenu onAction={handleFabAction} />
      {isImportModalOpen && (
        <ImportExcelModal
          // classId thật sẽ lấy từ session.assignedClasses khi nối
          // phân quyền thật — tạm truyền cứng 1 giá trị để test UI
          classId={selectedClassIds[0]}
          onClose={() => setImportModalOpen(false)}
        />
      )}
    </div>
  );
}

export default DashboardThieuNhiPage;
