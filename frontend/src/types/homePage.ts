
export interface HomePage {
  id: number;
  week: number;
  title: string;
  totalChildren: number;
}

export interface UseHomePageResult {
  data: HomePage[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}