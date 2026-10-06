

import type { HomePage } from '../types/homePage';
import { apiClient } from './apiClient';

export function getHomePage(): Promise<HomePage[]> {
  return apiClient.get<HomePage[]>('/home-page');
}
