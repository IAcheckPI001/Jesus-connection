import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../contexts/AuthContext';
import { apiClient } from '../services/apiClient';
import type { LopOption } from '../types/thieuNhi';

export type UseLopOptionsResult = {
  options: LopOption[];
  isLoading: boolean;
  error: string | null;
};

export function useLopOptions(): UseLopOptionsResult {
  const { user } = useAuthContext();
  const query = useQuery({
    queryKey: ['chi-doan', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => apiClient.get<{ items: LopOption[] }>('/chi-doan').then((response) => response.items),
  });
  return {
    options: query.data ?? [],
    isLoading: query.isPending,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
