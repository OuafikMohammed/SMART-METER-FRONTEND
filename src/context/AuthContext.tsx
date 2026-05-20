"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api';


interface User {
  id: number;
  username: string;
  email: string;
  role: 'RESIDENT' | 'ADMIN';
  fullName: string;
  first_name?: string;
  last_name?: string;
  managed_by?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = localStorage.getItem('sm_access_token') || localStorage.getItem('sm_token');
        const savedRefresh = localStorage.getItem('sm_refresh_token') || localStorage.getItem('refresh_token');
        const savedUser = localStorage.getItem('sm_user');

        if (savedToken && savedRefresh && savedUser) {
          setToken(savedToken);
          setRefreshTokenValue(savedRefresh);
          setUser(JSON.parse(savedUser));
        } else if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading auth from localStorage:', error);
        localStorage.removeItem('sm_access_token');
        localStorage.removeItem('sm_refresh_token');
        localStorage.removeItem('sm_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('sm_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((accessToken: string, refreshToken: string, newUser: User) => {
    setToken(accessToken);
    setRefreshTokenValue(refreshToken);
    setUser(newUser);
    localStorage.setItem('sm_access_token', accessToken);
    localStorage.setItem('sm_refresh_token', refreshToken);
    localStorage.setItem('sm_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setRefreshTokenValue(null);
    setUser(null);
    localStorage.removeItem('sm_access_token');
    localStorage.removeItem('sm_refresh_token');
    localStorage.removeItem('sm_user');
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const savedRefresh = localStorage.getItem('sm_refresh_token');
      if (!savedRefresh) {
        logout();
        return;
      }

      const result = await authApi.refreshToken(savedRefresh);

      if (result.status === 200 && result.data) {
        localStorage.setItem('sm_access_token', result.data.access);
        setToken(result.data.access);
        console.log('[AuthContext] Token refreshed successfully');
      } else {
        console.warn('[AuthContext] Token refresh failed with status', result.status);
        logout();
      }
    } catch (error) {
      console.error('[AuthContext] Error refreshing token:', error);
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isLoading, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
