

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ApiError } from '../services/apiClient';
import type { LoginCredentials } from '../types/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthContext();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      await auth.login(credentials);
      const from = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
      const destination = from?.pathname
        ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
        : '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Số điện thoại hoặc mật khẩu không đúng');
      } else {
        setError('Không thể kết nối tới máy chủ, vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch {
      // Local auth state is cleared before the request; keep the user out of protected routes.
    } finally {
      navigate('/dang-nhap', { replace: true });
    }
  };

  return { login, logout, loading, error, user: auth.user, status: auth.status };
}
