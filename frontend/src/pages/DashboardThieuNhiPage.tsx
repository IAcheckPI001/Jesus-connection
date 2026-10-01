import { useEffect, useState } from 'react';
import { Eye, Mars, Users, Venus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClassPicker from '../components/dashboard/ClassPicker/ClassPicker';
import StatsBar from '../components/dashboard/StatsBar/StatsBar';
import type { StatsBarItem } from '../components/dashboard/StatsBar/StatsBar';
import ThieuNhiRow from '../components/dashboard/ThieuNhiRow/ThieuNhiRow';
import Pagination from '../components/common/Pagination/Pagination';
import SearchInput from '../components/common/SearchInput/SearchInput';
import { DEFAULT_PAGE_SIZE, DEFAULT_TRANG_THAI_FILTER } from '../constants/thieuNhi';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useLopOptions } from '../hooks/useLopOptions';
import { useThieuNhiList } from '../hooks/useThieuNhiList';
import { useAuthContext } from '../contexts/AuthContext';
import { getRowNumber } from '../utils/thieuNhi';
import styles from './DashboardThieuNhiPage.module.scss';

function DashboardThieuNhiPage() {
  const { user } = useAuthContext();
  const { options, isLoading: classesLoading, error: classesError } = useLopOptions();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [searchInput, setSearchInput] = useState(() => sessionStorage.getItem(`children-search:${user?.id ?? 'anon'}`) ?? '');
  const search = useDebouncedValue(searchInput);
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (options.length && !options.some((option) => option.id === selectedClassId)) setSelectedClassId(options[0].id);
  }, [options, selectedClassId]);
  useEffect(() => { sessionStorage.setItem(`children-search:${user?.id ?? 'anon'}`, searchInput); }, [searchInput, user?.id]);
  useEffect(() => { setPage(1); }, [selectedClassId, search]);

  const list = useThieuNhiList({ classId: selectedClassId, search, trangThai: DEFAULT_TRANG_THAI_FILTER, page });
  const statItems: StatsBarItem[] = [
    { key: 'si-so', icon: <Users />, value: list.stats.siSo, label: 'Thiếu nhi', eyebrow: 'Sĩ số' },
    { key: 'nu', icon: <Venus />, value: list.stats.nu, label: 'Nữ' },
    { key: 'nam', icon: <Mars />, value: list.stats.nam, label: 'Nam' },
  ];
  const handleEdit = () => undefined;
  return <div className={styles.page}>
    <header className={styles.topline}><p className={styles.greeting}>Xin chào, {user?.ten_thanh || user?.ho_ten || ''} 👋</p></header>
    <StatsBar items={statItems} isLoading={list.isLoading} />
    <section className={styles.tableCard}>
      <div className={styles.tableToolbar}>
        <div className={styles.tableTitleGroup}>
          <div className={styles.classHeading}>
            <ClassPicker options={options} selectedId={selectedClassId} onChange={setSelectedClassId} isLoading={classesLoading} />
            {selectedClassId && <Link className={styles.viewClassButton} to={`/doan-sinh/lop/${selectedClassId}`} aria-label="Xem chi tiết lớp" title="Xem chi tiết lớp"><Eye aria-hidden="true" /></Link>}
          </div>
          <p className={styles.tableSubtitle}>Danh sách thiếu nhi</p>
        </div>
        <SearchInput className={styles.searchInput} value={searchInput} onChange={setSearchInput} ariaLabel="Tìm kiếm thiếu nhi" variant="filled" />
      </div>
      {(classesError || list.error) && <p role="alert">{classesError ?? list.error}</p>}
      <div className={styles.tableFrame}>
        <ThieuNhiRow rows={list.items} startIndex={getRowNumber(list.page, DEFAULT_PAGE_SIZE, 0)} showClassColumn={false} layout="desktop" isLoading={classesLoading || list.isLoading} error={list.error} onRetry={list.refetch} onEdit={handleEdit} canEdit={() => false} />
      </div>
      <div className={styles.paginationRow}><Pagination page={list.page} totalPages={list.totalPages} onPageChange={setPage} /></div>
    </section>
  </div>;
}

export default DashboardThieuNhiPage;
