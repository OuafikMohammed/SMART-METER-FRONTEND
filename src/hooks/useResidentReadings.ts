'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface ConsumptionReading {
  id: number;
  meter_id: string;
  timestamp: string;
  consumption_kwh: number;
  cost_estimate: number;
  tariff_type: string;
}

interface UseResidentReadingsResult {
  data: ConsumptionReading[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch resident consumption readings
 * Calls: GET /api/energy/resident/readings/
 * Returns: Array of consumption readings for the current resident
 */
export function useResidentReadings(
  startDate?: string,
  endDate?: string,
  meterId?: string
): UseResidentReadingsResult {
  const { token } = useAuth();
  const [data, setData] = useState<ConsumptionReading[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadings = useCallback(async () => {
    if (!token) {
      setError('Token d\'authentification non trouvé');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const params = new URLSearchParams();

      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (meterId) params.append('meter_id', meterId);

      const url = `${baseUrl}/api/energy/resident/readings/?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        localStorage.removeItem('sm_access_token');
        localStorage.removeItem('sm_refresh_token');
        localStorage.removeItem('sm_user');
        return;
      }

      if (response.status === 403) {
        setError('Vous n\'avez pas les permissions pour accéder à ces données.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `Erreur API: ${response.status}`);
      }

      const responseData = await response.json();
      // Handle both array and object with readings property
      const readings = Array.isArray(responseData) ? responseData : responseData.readings || [];
      setData(readings);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      console.error('Erreur fetch resident readings:', err);
    } finally {
      setLoading(false);
    }
  }, [token, startDate, endDate, meterId]);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  return { data, loading, error, refetch: fetchReadings };
}
