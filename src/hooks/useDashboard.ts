/**
 * Hook React pour récupérer les données du dashboard résident
 * Appelle GET /api/energy/resident/dashboard/
 */
import { useState, useEffect, useCallback } from 'react';
import { residentApi } from '@/lib/api';

export interface DashboardData {
  consommation_actuelle: number;
  consommation_jour: number;
  consommation_semaine: number;
  cout_estime_mois: number;
  alertes_actives: number;
  variation_jour: number;
  points_graphique: GraphPoint[];
  conseil_ia?: string;
}

export interface GraphPoint {
  timestamp: string;
  kwh: number;
  anomaly_label: number;
}

export interface UseDashboardResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer les données du dashboard
 */
export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère les données du dashboard depuis l'API
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('sm_access_token') || localStorage.getItem('sm_token');

      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const { data: dashboardData, error: apiError, status } = await residentApi.getDashboard(token);

      if (status === 401) {
        // Token expiré - rediriger vers login
        localStorage.removeItem('sm_access_token');
        localStorage.removeItem('sm_refresh_token');
        localStorage.removeItem('sm_token');
        window.location.href = '/auth/login';
        return;
      }

      if (apiError || !dashboardData) {
        throw new Error(apiError || `Erreur API: ${status}`);
      }

      setData(dashboardData as any);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      console.error('Erreur fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer les données au chargement
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}
