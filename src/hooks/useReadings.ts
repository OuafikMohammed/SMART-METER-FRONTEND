'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ConsumptionReading,
  ConsumptionReadingInput,
  residentApi,
  adminApi,
} from '@/lib/api';

interface UseReadingsResult {
  readings: ConsumptionReading[];
  loading: boolean;
  error: string | null;
  success: string | null;
  
  // Resident operations
  fetchResidentReadings: (params?: any) => Promise<void>;
  createReading: (data: ConsumptionReadingInput) => Promise<ConsumptionReading | null>;
  updateReading: (id: number, data: Partial<ConsumptionReadingInput>) => Promise<ConsumptionReading | null>;
  deleteReading: (id: number) => Promise<boolean>;
  
  // Admin operations
  fetchAdminResidentReadings: (residentId: number, params?: any) => Promise<void>;
  createAdminReading: (residentId: number, data: ConsumptionReadingInput) => Promise<ConsumptionReading | null>;
  updateAdminReading: (residentId: number, readingId: number, data: Partial<ConsumptionReadingInput>) => Promise<ConsumptionReading | null>;
  deleteAdminReading: (residentId: number, readingId: number) => Promise<boolean>;
  
  clearSuccess: () => void;
}

/**
 * Hook to manage consumption readings with CRUD operations
 * Can be used by both residents and admins
 */
export function useReadings(isAdmin: boolean = false): UseReadingsResult {
  const { token, user } = useAuth();
  const [readings, setReadings] = useState<ConsumptionReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ==================== RESIDENT OPERATIONS ====================

  const fetchResidentReadings = useCallback(async (params?: any) => {
    if (!token) {
      setError('Authentification requise');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await residentApi.getReadings(token, params);
      if (response.data) {
        setReadings(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement des lectures');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createReading = useCallback(async (data: ConsumptionReadingInput): Promise<ConsumptionReading | null> => {
    if (!token) {
      setError('Authentification requise');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await residentApi.createReading(token, data);
      if (response.data) {
        setReadings([...readings, response.data]);
        setSuccess('Lecture créée avec succès');
        setTimeout(() => setSuccess(null), 3000);
        return response.data;
      } else {
        setError(response.error || 'Erreur lors de la création');
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, readings]);

  const updateReading = useCallback(async (id: number, data: Partial<ConsumptionReadingInput>): Promise<ConsumptionReading | null> => {
    if (!token) {
      setError('Authentification requise');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await residentApi.updateReading(token, id, data);
      if (response.data) {
        setReadings(readings.map(r => r.id === id ? response.data! : r));
        setSuccess('Lecture mise à jour avec succès');
        setTimeout(() => setSuccess(null), 3000);
        return response.data;
      } else {
        setError(response.error || 'Erreur lors de la mise à jour');
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, readings]);

  const deleteReading = useCallback(async (id: number): Promise<boolean> => {
    if (!token) {
      setError('Authentification requise');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await residentApi.deleteReading(token, id);
      if (response.status === 204 || response.status === 200) {
        setReadings(readings.filter(r => r.id !== id));
        setSuccess('Lecture supprimée avec succès');
        setTimeout(() => setSuccess(null), 3000);
        return true;
      } else {
        setError(response.error || 'Erreur lors de la suppression');
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, readings]);

  // ==================== ADMIN OPERATIONS ====================

  const fetchAdminResidentReadings = useCallback(async (residentId: number, params?: any) => {
    if (!token) {
      setError('Authentification requise');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.getResidentReadings(token, residentId, params);
      if (response.data) {
        setReadings(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement des lectures');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createAdminReading = useCallback(async (residentId: number, data: ConsumptionReadingInput): Promise<ConsumptionReading | null> => {
    if (!token) {
      setError('Authentification requise');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.createResidentReading(token, residentId, data);
      if (response.data) {
        setReadings([...readings, response.data]);
        setSuccess('Lecture créée avec succès');
        setTimeout(() => setSuccess(null), 3000);
        return response.data;
      } else {
        setError(response.error || 'Erreur lors de la création');
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, readings]);

  const updateAdminReading = useCallback(async (residentId: number, readingId: number, data: Partial<ConsumptionReadingInput>): Promise<ConsumptionReading | null> => {
    if (!token) {
      setError('Authentification requise');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.updateResidentReading(token, residentId, readingId, data);
      if (response.data) {
        setReadings(readings.map(r => r.id === readingId ? response.data! : r));
        setSuccess('Lecture mise à jour avec succès');
        setTimeout(() => setSuccess(null), 3000);
        return response.data;
      } else {
        setError(response.error || 'Erreur lors de la mise à jour');
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, readings]);

  const deleteAdminReading = useCallback(async (residentId: number, readingId: number): Promise<boolean> => {
    if (!token) {
      setError('Authentification requise');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.deleteResidentReading(token, residentId, readingId);
      if (response.status === 204 || response.status === 200) {
        setReadings(readings.filter(r => r.id !== readingId));
        setSuccess('Lecture supprimée avec succès');
        setTimeout(() => setSuccess(null), 3000);
        return true;
      } else {
        setError(response.error || 'Erreur lors de la suppression');
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, readings]);

  const clearSuccess = useCallback(() => setSuccess(null), []);

  return {
    readings,
    loading,
    error,
    success,
    fetchResidentReadings,
    createReading,
    updateReading,
    deleteReading,
    fetchAdminResidentReadings,
    createAdminReading,
    updateAdminReading,
    deleteAdminReading,
    clearSuccess,
  };
}

export default useReadings;
