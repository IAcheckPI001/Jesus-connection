import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ApiError } from '../services/apiClient';
import { authService } from '../services/authService';
import type { AuthUser, LoginCredentials } from '../types/auth';
import { useQueryClient } from '@tanstack/react-query';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'error';

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const requestVersion = useRef(0);

  const refreshSession = useCallback(async () => {
    const currentVersion = ++requestVersion.current;
    setStatus('loading');
    try {
      const response = await authService.getCurrentUser();
      if (currentVersion !== requestVersion.current) return;
      setUser(response.user);
      setStatus('authenticated');
    } catch (error) {
      if (currentVersion !== requestVersion.current) return;
      setUser(null);
      setStatus(error instanceof ApiError && error.status === 401 ? 'anonymous' : 'error');
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const currentVersion = ++requestVersion.current;
    const response = await authService.login(credentials);
    if (currentVersion !== requestVersion.current) return response.user;
    setUser(response.user);
    setStatus('authenticated');
    return response.user;
  }, []);

  const logout = useCallback(async () => {
    ++requestVersion.current;
    // Clear local auth first so protected routes close without waiting for the network.
    setUser(null);
    setStatus('anonymous');
    queryClient.clear();
    await authService.logout();
  }, [queryClient]);

  const value = useMemo(
    () => ({ status, user, login, logout, refreshSession }),
    [status, user, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext phải được dùng bên trong AuthProvider.');
  }
  return context;
}
