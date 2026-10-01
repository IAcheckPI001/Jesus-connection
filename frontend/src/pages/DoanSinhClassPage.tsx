import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { DataTableColumn } from '../components/dashboard/DataTable/DataTable';
import ClassPicker from '../components/dashboard/ClassPicker/ClassPicker';
import Pagination from '../components/common/Pagination/Pagination';
import SearchInput from '../components/common/SearchInput/SearchInput';
import ThieuNhiRow from '../components/dashboard/ThieuNhiRow/ThieuNhiRow';
import { DEFAULT_PAGE_SIZE } from '../constants/thieuNhi';
import { useAuthContext } from '../contexts/AuthContext';
import { useLopOptions } from '../hooks/useLopOptions';
import { useThieuNhiList } from '../hooks/useThieuNhiList';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type { ThieuNhiListItem } from '../types/thieuNhi';
import { getRowNumber } from '../utils/thieuNhi';
import styles from './DashboardThieuNhiPage.module.scss';

type IndexedChild = ThieuNhiListItem & { rowNumber: number; attendance: Record<string, string | null>; scores: { behavior: number | null; campaignExam: number | null; catechismExam: number | null; average: number | null } };
type Preferences = { attendanceExpanded: boolean; gradesExpanded: boolean };
const dateLabel = (date: string) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(`${date}T00:00:00`));
const attendanceLabel = (value: string | null) => ({
  co_mat: 'Có mặt', khong_phep: 'Vắng KP', co_phep: 'Vắng CP',
} as Record<string, string>)[value ?? ''] ?? '';

function DoanSinhClassPage() {
  const { classId = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { options, isLoading: classesLoading } = useLopOptions();
  const searchStorageKey = `children-search:${user?.id ?? 'anon'}`;
  const preferenceKey = `children-table:${user?.id ?? 'anon'}`;
  const [searchInput, setSearchInput] = useState(() => sessionStorage.getItem(searchStorageKey) ?? '');
  const search = useDebouncedValue(searchInput);
  const [page, setPage] = useState(1);
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try { return { attendanceExpanded: false, gradesExpanded: false, ...JSON.parse(sessionStorage.getItem(preferenceKey) ?? '{}') }; }
    catch { return { attendanceExpanded: false, gradesExpanded: false }; }
  });
  useEffect(() => { sessionStorage.setItem(searchStorageKey, searchInput); }, [searchInput, searchStorageKey]);
  useEffect(() => { sessionStorage.setItem(preferenceKey, JSON.stringify(preferences)); }, [preferences, preferenceKey]);
  useEffect(() => { setPage(1); }, [classId, search]);

  const list = useThieuNhiList({ classId, search, trangThai: 'tat_ca', page, includeAttendance: true });
  const rows: IndexedChild[] = list.items.map((row, index) => ({ ...row, rowNumber: getRowNumber(list.page, DEFAULT_PAGE_SIZE, index) }));
  const past = list.attendanceColumns.filter((column) => !column.isUpcoming);
  const upcoming = list.attendanceColumns.find((column) => column.isUpcoming);
  const visibleAttendance = preferences.attendanceExpanded ? past : past.slice(-1);
  const attendanceGroup = { id: 'attendance', title: 'Điểm danh', expanded: preferences.attendanceExpanded, onToggle: () => setPreferences((value) => ({ ...value, attendanceExpanded: !value.attendanceExpanded })) };
  const scoreGroup = { id: 'grades', title: 'Học kỳ 1', expanded: preferences.gradesExpanded, onToggle: () => setPreferences((value) => ({ ...value, gradesExpanded: !value.gradesExpanded })) };
  const columns: DataTableColumn<IndexedChild>[] = [
    ...visibleAttendance.map((column) => ({ key: `att-${column.id}`, header: dateLabel(column.date), group: attendanceGroup, render: (row: IndexedChild) => attendanceLabel(row.attendance[column.id]) })),
    ...(upcoming ? [{ key: `att-${upcoming.id}`, header: `${dateLabel(upcoming.date)} (sắp tới)`, group: attendanceGroup, render: (row: IndexedChild) => attendanceLabel(row.attendance[upcoming.id]) }] : []),
    ...(preferences.gradesExpanded ? [
      { key: 'behavior', header: 'Đạo đức', group: scoreGroup, render: (row: IndexedChild) => row.scores.behavior ?? '' },
      { key: 'campaign', header: 'Phong trào kỳ 1', group: scoreGroup, render: (row: IndexedChild) => row.scores.campaignExam ?? '' },
      { key: 'catechism', header: 'Giáo lý kỳ 1', group: scoreGroup, render: (row: IndexedChild) => row.scores.catechismExam ?? '' },
      { key: 'average', header: 'Trung bình', group: scoreGroup, render: (row: IndexedChild) => row.scores.average ?? '' },
    ] : [{ key: 'semester', header: 'Học kỳ 1', group: scoreGroup, render: () => '' }]),
  ];

  return <div className={styles.page}>
    <header className={styles.topline}><p className={styles.greeting}>Danh sách thiếu nhi · {options.find((item) => item.id === classId)?.ten ?? ''}</p></header>
    <section className={styles.tableCard}>
      <div className={styles.tableToolbar}>
        <div className={styles.tableTitleGroup}>
          <div className={styles.classHeading}>
            <ClassPicker options={options} selectedId={classId} onChange={(id) => navigate(`/doan-sinh/lop/${id}`)} isLoading={classesLoading} />
          </div>
          <p className={styles.tableSubtitle}>Thông tin thiếu nhi trong lớp</p>
        </div>
        <SearchInput className={styles.searchInput} value={searchInput} onChange={setSearchInput} ariaLabel="Tìm kiếm thiếu nhi" variant="filled" />
      </div>
      <div className={styles.tableFrame}>
        <ThieuNhiRow rows={rows} startIndex={getRowNumber(list.page, DEFAULT_PAGE_SIZE, 0)} showClassColumn={false} layout="desktop" isLoading={list.isLoading} error={list.error} onRetry={list.refetch} onEdit={() => undefined} canEdit={() => false} extraColumns={columns} />
      </div>
      <div className={styles.paginationRow}><Pagination page={list.page} totalPages={list.totalPages} onPageChange={setPage} /></div>
    </section>
  </div>;
}

export default DoanSinhClassPage;
