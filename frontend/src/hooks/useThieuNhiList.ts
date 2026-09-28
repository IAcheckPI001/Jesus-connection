import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants/thieuNhi';
import { thieuNhiMock } from '../mocks/thieuNhiMock';
import type {
  ThieuNhiListItem,
  ThieuNhiStats,
  TrangThaiFilter,
} from '../types/thieuNhi';
import { normalizeSearchText } from '../utils/thieuNhi';

export type UseThieuNhiListParams = {
  classIds: string[];
  search: string;
  trangThai: TrangThaiFilter;
  page: number;
  pageSize?: number;
};

export type UseThieuNhiListResult = {
  items: ThieuNhiListItem[];
  total: number;
  totalPages: number;
  page: number;
  stats: ThieuNhiStats;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

type ListData = Pick<UseThieuNhiListResult, 'items' | 'total' | 'totalPages' | 'page' | 'stats'>;

function calculateList(
  classIds: string[],
  search: string,
  trangThai: TrangThaiFilter,
  requestedPage: number,
  pageSize: number,
): ListData {
  const selectedClassIds = new Set(classIds);
  const classItems = thieuNhiMock.filter((item) => selectedClassIds.has(item.chiDoanId));
  const activeItems = classItems.filter((item) => item.trangThai === 'dang_sinh_hoat');
  const stats: ThieuNhiStats = {
    siSo: activeItems.length,
    nu: activeItems.filter((item) => item.gioiTinh === 'nu').length,
    nam: activeItems.filter((item) => item.gioiTinh === 'nam').length,
  };

  // Filtering order is class, status, search, then pagination.
  const statusItems = trangThai === 'tat_ca'
    ? classItems
    : classItems.filter((item) => item.trangThai === trangThai);
  const searchTokens = normalizeSearchText(search).split(' ').filter(Boolean);
  const filteredItems = searchTokens.length === 0
    ? statusItems
    : statusItems.filter((item) => {
        const searchableText = normalizeSearchText(
          [item.tenThanh ?? '', item.ho, item.ten].join(' '),
        );
        return searchTokens.every((token) => searchableText.includes(token));
      });

  const total = filteredItems.length;
  const totalPages = Math.ceil(total / pageSize);
  const normalizedPage = Number.isFinite(requestedPage)
    ? Math.max(1, Math.trunc(requestedPage))
    : 1;
  const page = Math.min(normalizedPage, Math.max(totalPages, 1));
  const offset = (page - 1) * pageSize;

  return {
    items: filteredItems.slice(offset, offset + pageSize),
    total,
    totalPages,
    page,
    stats,
  };
}

export function useThieuNhiList({
  classIds,
  search,
  trangThai,
  page,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseThieuNhiListParams): UseThieuNhiListResult {
  const safePageSize = Number.isFinite(pageSize) ? Math.max(1, Math.trunc(pageSize)) : DEFAULT_PAGE_SIZE;
  const classIdsKey = JSON.stringify(classIds);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [listData, setListData] = useState(() =>
    calculateList(classIds, search, trangThai, page, safePageSize),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refetch = useCallback(() => setRefreshVersion((version) => version + 1), []);

  useEffect(() => {
    let cancelled = false;
    let requestTimer: number | undefined;
    const classIdsSnapshot = JSON.parse(classIdsKey) as string[];
    const startTimer = window.setTimeout(() => {
      if (cancelled) return;
      setIsLoading(true);
      requestTimer = window.setTimeout(() => {
        if (cancelled) return;
        setListData(calculateList(
          classIdsSnapshot,
          search,
          trangThai,
          page,
          safePageSize,
        ));
        setError(null);
        setIsLoading(false);
      }, 300);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      if (requestTimer !== undefined) window.clearTimeout(requestTimer);
    };
  }, [classIdsKey, search, trangThai, page, safePageSize, refreshVersion]);

  return { ...listData, isLoading, error, refetch };
}
