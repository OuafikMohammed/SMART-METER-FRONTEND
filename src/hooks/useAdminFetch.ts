import { useState, useCallback } from 'react';
import { useSecureApi } from './useSecureApi';

interface UseAdminFetchOptions {
  timeout?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useAdminFetch = (options: UseAdminFetchOptions = {}) => {
  const { timeout = 10000 } = options;
  const { secureFetch } = useSecureApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown, statusCode?: number): string => {
    if (statusCode === 401) {
      return "Votre session a expiré. Veuillez vous reconnecter.";
    }
    
    if (statusCode === 403) {
      return "Vous n'avez pas les permissions pour accéder à ces données.";
    }
    
    if (statusCode === 404) {
      return "Ressource non trouvée.";
    }
    
    if (err instanceof Error && (err.message.includes("Failed to fetch") || err.message.includes("fetch failed") || err.message.includes("NetworkError"))) {
      return "Impossible de se connecter au serveur. Assurez-vous que le backend est en cours d'exécution.";
    }
    
    // Also catch plain TypeError without message checking just in case
    if (err instanceof TypeError) {
      return "Impossible de se connecter au serveur. Assurez-vous que le backend est en cours d'exécution.";
    }
    
    if (err instanceof SyntaxError) {
      return "Erreur de format de réponse du serveur.";
    }
    
    if (err instanceof Error && err.name === 'AbortError') {
      return "Délai d'attente dépassé. Le serveur met trop de temps à répondre.";
    }
    
    return err instanceof Error ? err.message : 'Erreur inconnue lors du chargement des données.';
  };

  const fetchData = useCallback(
    async (url: string) => {
      try {
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await secureFetch(url, { 
            signal: controller.signal 
          });
          clearTimeout(timeoutId);

          const data = await response.json();
          options.onSuccess?.(data);
          return data;
        } catch (fetchErr) {
          clearTimeout(timeoutId);
          throw fetchErr;
        }
      } catch (err) {
        const statusCode = (err as any)?.status || null;
        const message = getErrorMessage(err, statusCode);
        setError(message);
        options.onError?.(message);
        // Silently throw to avoid console clutter
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [secureFetch, timeout, options]
  );

  const retry = useCallback(
    async (url: string) => {
      return fetchData(url);
    },
    [fetchData]
  );

  return {
    loading,
    error,
    fetchData,
    retry,
    setError,
  };
};
