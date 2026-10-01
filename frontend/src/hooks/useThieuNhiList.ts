import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../contexts/AuthContext';
import { DEFAULT_PAGE_SIZE } from '../constants/thieuNhi';
import { apiClient } from '../services/apiClient';
import type { ThieuNhiListItem, ThieuNhiStats, TrangThaiFilter } from '../types/thieuNhi';

export type AttendanceColumn = { id: string; date: string; isUpcoming: boolean };
export type DoanSinhPage = {
  items: (ThieuNhiListItem & {
    attendance: Record<string, string | null>;
    scores: { behavior: number | null; campaignExam: number | null; catechismExam: number | null; average: number | null };
  })[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  stats: ThieuNhiStats;
  attendanceColumns: AttendanceColumn[];
};

export type UseThieuNhiListParams = {
  classId: string;
  search: string;
  trangThai: TrangThaiFilter;
  page: number;
  includeAttendance?: boolean;
};

export function useThieuNhiList({ classId, search, trangThai, page, includeAttendance = false }: UseThieuNhiListParams) {
  const { user } = useAuthContext();
  const query = useQuery({
    queryKey: ['doan-sinh', user?.id, classId, page, DEFAULT_PAGE_SIZE, search, trangThai, includeAttendance],
    enabled: Boolean(user?.id && classId),
    queryFn: () => {
      const params = new URLSearchParams({
        classId, page: String(page), pageSize: String(DEFAULT_PAGE_SIZE), search,
        trangThai: trangThai === 'tat_ca' ? '' : trangThai,
        includeAttendance: String(includeAttendance),
      });
      return apiClient.get<DoanSinhPage>(`/doan-sinh?${params.toString()}`);
    },
    placeholderData: (previous) => previous,
  });
  return {
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    page: query.data?.page ?? page,
    pageSize: query.data?.pageSize ?? DEFAULT_PAGE_SIZE,
    stats: query.data?.stats ?? { siSo: 0, nu: 0, nam: 0 },
    attendanceColumns: query.data?.attendanceColumns ?? [],
    isLoading: query.isPending,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: () => { void query.refetch(); },
  };
}
