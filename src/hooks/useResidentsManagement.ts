'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Resident, AdminResidentsListResponse, adminApi } from '@/lib/api';

interface UseAdminResidentsResult {
  residents: Resident[];
  loading: boolean;
  error: string | null;
  success: string | null;
  fetchResidents: () => Promise<void>;
  createResident: (residentData: { email: string; first_name: string; last_name: string; password: string }) => Promise<Resident | null>;
  updateResident: (residentId: number, residentData: Partial<{ email: string; first_name: string; last_name: string; password: string }>) => Promise<Resident | null>;
  deleteResident: (residentId: number) => Promise<boolean>;
  clearSuccess: () => void;
}

/**
 * Hook to manage admin residents list and CRUD operations
 * Fetches, creates, updates, and deletes residents managed by the current admin
 */
export function useAdminResidents(): UseAdminResidentsResult {
  const { token, user } = useAuth();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchResidents = useCallback(async () => {
    if (!token) {
      setError('Authentification requise');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.getResidents(token);
      if (response.data) {
        setResidents(response.data.residents || []);
      } else {
        setError(response.error || 'Erreur lors du chargement des résidents');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createResident = useCallback(
    async (residentData: { email: string; first_name: string; last_name: string; password: string }) => {
      if (!token) {
        setError('Authentification requise');
        return null;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await adminApi.createResident(token, residentData);
        if (response.data) {
          setSuccess('Résident créé avec succès');
          setResidents([...residents, response.data]);
          return response.data;
        } else {
          setError(response.error || 'Erreur lors de la création du résident');
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, residents]
  );

  const updateResident = useCallback(
    async (residentId: number, residentData: Partial<{ email: string; first_name: string; last_name: string; password: string }>) => {
      if (!token) {
        setError('Authentification requise');
        return null;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await adminApi.updateResident(token, residentId, residentData);
        if (response.data) {
          setSuccess('Résident modifié avec succès');
          setResidents(residents.map(r => r.id === residentId ? response.data! : r));
          return response.data;
        } else {
          setError(response.error || 'Erreur lors de la modification du résident');
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, residents]
  );

  const deleteResident = useCallback(
    async (residentId: number) => {
      if (!token) {
        setError('Authentification requise');
        return false;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await adminApi.deleteResident(token, residentId);
        if (response.status === 200 || response.status === 204) {
          setSuccess('Résident supprimé avec succès');
          setResidents(residents.filter(r => r.id !== residentId));
          return true;
        } else {
          setError(response.error || 'Erreur lors de la suppression du résident');
          return false;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, residents]
  );

  const clearSuccess = useCallback(() => setSuccess(null), []);

  return {
    residents,
    loading,
    error,
    success,
    fetchResidents,
    createResident,
    updateResident,
    deleteResident,
    clearSuccess,
  };
}

export default useAdminResidents;
