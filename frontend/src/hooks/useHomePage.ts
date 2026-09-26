
import { useEffect, useState, useCallback } from 'react';
import { getHomePage } from '../services/homePageService';
import type { HomePage, UseHomePageResult } from '../types/homePage';


export function useHomePage(): UseHomePageResult {
  const [data, setData] = useState<HomePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
 
  // useCallback để refetch không bị tạo lại mỗi lần render,
  // tránh gây loop nếu component khác dùng refetch trong useEffect
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getHomePage();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    fetchData();
  }, [fetchData]);
 
  return { data, loading, error, refetch: fetchData };
}