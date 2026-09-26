

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ApiError } from '../services/apiClient';
import type { LoginCredentials } from '../types/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await authService.login(credentials);

      console.log(user)
    
      navigate('/dashboard');
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

  return { login, loading, error };
}