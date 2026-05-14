'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

interface ResidentData {
  email: string;
  meter_id: string;
  total_consumption_kwh: number;
  total_cost_estimate: number;
}

interface ConsumptionByDay {
  date: string;
  total_consumption_kwh: number;
}

interface AdminDashboardData {
  admin_email: string;
  total_residents: number;
  total_consumption_kwh: number;
  total_cost_estimate: number;
  average_consumption_per_resident: number;
  residents: ResidentData[];
  consumption_by_day: ConsumptionByDay[];
}

interface UseAdminDashboardResult {
  data: AdminDashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch admin dashboard data
 * Calls: GET /api/energy/admin/dashboard/
 * Returns: Aggregated consumption data for all managed residents
 */
export function useAdminDashboard(): UseAdminDashboardResult {
  const { token } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!token) {
      setError('Token d\'authentification non trouvé');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const url = `${baseUrl}/api/energy/admin/dashboard/`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        localStorage.removeItem('sm_token');
        localStorage.removeItem('sm_user');
        return;
      }

      if (response.status === 403) {
        setError('Vous n\'avez pas les permissions pour accéder à ce dashboard.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `Erreur API: ${response.status}`);
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      console.error('Erreur fetch admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { data, loading, error, refetch: fetchDashboardData };
}
