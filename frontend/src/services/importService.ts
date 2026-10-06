import { apiClient } from './apiClient';
import type { ImportPreviewRequestRow, ImportPreviewResponse } from '../types/importFile';

export const importService = {
  preview: (classId: string, rows: ImportPreviewRequestRow[]) =>
    apiClient.post<ImportPreviewResponse>('/thieu-nhi/import/preview', { classId, rows }),
};
