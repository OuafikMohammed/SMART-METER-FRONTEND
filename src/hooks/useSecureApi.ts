import { useAuth } from '@/context/AuthContext';
import { useCallback } from 'react';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export const useSecureApi = () => {
  const { token, logout, refreshToken } = useAuth();

  const secureFetch = useCallback(
    async (url: string, options: FetchOptions = {}) => {
      const { skipAuth = false, ...fetchOptions } = options;
      
      const headers = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      } as Record<string, string>;

      if (!skipAuth && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        let response = await fetch(url, {
          ...fetchOptions,
          headers,
        });

        // Handle token expiration (401 Unauthorized)
        if (response.status === 401 && !skipAuth && token) {
          console.log('Token expired, attempting refresh...');
          try {
            await refreshToken();
            
            // Retry the request with new token
            const newHeaders = {
              ...headers,
              'Authorization': `Bearer ${localStorage.getItem('sm_token')}`,
            };
            
            response = await fetch(url, {
              ...fetchOptions,
              headers: newHeaders,
            });
          } catch (error) {
            console.error('Token refresh failed, logging out');
            logout();
            throw error;
          }
        }

        // Handle other HTTP errors
        if (!response.ok) {
          const error = new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
          (error as any).status = response.status;
          throw error;
        }

        return response;
      } catch (error) {
        // Silently throw to avoid console clutter
        throw error;
      }
    },
    [token, logout, refreshToken]
  );

  return { secureFetch };
};
