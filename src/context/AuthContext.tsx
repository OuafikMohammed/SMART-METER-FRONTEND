"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'RESIDENT' | 'ADMIN';
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = localStorage.getItem('sm_token');
        const savedUser = localStorage.getItem('sm_user');
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading auth from localStorage:', error);
        localStorage.removeItem('sm_token');
        localStorage.removeItem('sm_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('sm_token', newToken);
    localStorage.setItem('sm_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sm_token');
    localStorage.removeItem('sm_user');
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const savedToken = localStorage.getItem('sm_token');
      if (!savedToken) {
        logout();
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/auth/refresh/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ refresh: savedToken }),
        credentials: 'include',
      });

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('[AuthContext] Token refresh returned non-JSON response');
        logout();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('sm_token', data.access);
        setToken(data.access);
        console.log('[AuthContext] Token refreshed successfully');
      } else {
        console.warn('[AuthContext] Token refresh failed with status', response.status);
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
