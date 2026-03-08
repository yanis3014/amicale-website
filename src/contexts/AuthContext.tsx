'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ApiUser } from '@/lib/api/types';
import { getToken, setToken, setTokenGetter } from '@/lib/api/client';
import { getMe, login as apiLogin, logout as apiLogout, register as apiRegister } from '@/lib/api/auth';
import type { LoginPayload, RegisterPayload } from '@/lib/api/types';

interface AuthState {
  user: ApiUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAdherent: boolean;
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<ApiUser | undefined>;
  logout: () => void;
  register: (payload: RegisterPayload) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isAdherent(user: ApiUser | null): boolean {
  if (!user?.is_adherent) return false;
  if (!user.adherent_expires_at) return true;
  return new Date(user.adherent_expires_at) > new Date();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenRef = useRef<string | null>(null);

  const refreshUser = useCallback(async () => {
    const t = getToken();
    if (!t) {
      tokenRef.current = null;
      setUser(null);
      setIsLoading(false);
      return;
    }
    tokenRef.current = t;
    try {
      const u = await getMe();
      setUser(u);
    } catch {
      setToken(null);
      tokenRef.current = null;
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    setTokenGetter(() => tokenRef.current);
    return () => setTokenGetter(null);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const res = await apiLogin(payload);
      if (res.token) {
        tokenRef.current = res.token;
        setToken(res.token);
      }
      setUser(res.user);
      return res.user;
    },
    []
  );

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const res = await apiRegister(payload);
      if (res.token) {
        tokenRef.current = res.token;
        setToken(res.token);
      }
      setUser(res.user);
    },
    []
  );

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isAdherent: isAdherent(user),
    login,
    logout,
    register,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
