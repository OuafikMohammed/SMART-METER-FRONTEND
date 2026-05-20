'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminDashboardService, AdminDashboardResponse } from '@/lib/services/adminDashboardService';

interface UseAdminDashboardResult {
  data: AdminDashboardResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch admin dashboard data
 * Returns: Data-driven dashboard data derived from DB seeding
 */
export function useAdminDashboard(): UseAdminDashboardResult {
  const { token } = useAuth();
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
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
      
      // The backend endpoint is actually /api/energy/admin/dashboard/
      // based on backend/urls.py and energy/urls.py
      const dashboardData = await adminDashboardService.getDashboardData(token);
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

