/**
 * Hook React pour récupérer les données du dashboard résident
 * Appelle GET /api/energy/resident/dashboard/
 */
import { useState, useEffect, useCallback } from 'react';

export interface DashboardData {
  consommation_actuelle: number;
  consommation_jour: number;
  consommation_semaine: number;
  cout_estime_mois: number;
  alertes_actives: number;
  variation_jour: number;
  points_graphique: GraphPoint[];
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

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const url = `${baseUrl}/api/energy/resident/dashboard/`;
      const token = localStorage.getItem('sm_token') || localStorage.getItem('access_token');

      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token expiré - rediriger vers login
        localStorage.removeItem('sm_token');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `Erreur API: ${response.status}`);
      }

      const dashboardData = await response.json();
      setData(dashboardData);
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
