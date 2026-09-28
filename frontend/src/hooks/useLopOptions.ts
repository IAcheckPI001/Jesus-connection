import { LOP_OPTIONS } from '../mocks/thieuNhiMock';
import type { LopOption } from '../types/thieuNhi';

export type UseLopOptionsResult = {
  options: LopOption[];
  isLoading: boolean;
  error: string | null;
};

export function useLopOptions(): UseLopOptionsResult {
  return { options: LOP_OPTIONS, isLoading: false, error: null };
}
