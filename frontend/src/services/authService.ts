

import { apiClient } from './apiClient';
import type { CurrentUserResponse, LoginCredentials, LoginResponse } from '../types/auth';

export const authService = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<LoginResponse>('/auth/login', credentials),

  logout: () => apiClient.post<void>('/auth/logout', {}),

  getCurrentUser: () => apiClient.get<CurrentUserResponse>('/auth/me'),
};
