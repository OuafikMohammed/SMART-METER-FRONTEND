/**
 * Hook React pour gérer les anomalies détectées
 * RG7, RG8, RG9: Anomalies avec score Hugging Face et statuts
 */
import { useState, useEffect, useCallback } from 'react';

export interface Anomalie {
  id: number;
  consommation: {
    foyer_numero: string;
    foyer_id: number;
    timestamp_consommation: string;
    kwh: number;
    temperature?: number;
  };
  score_confiance: number;
  severite: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
  statut: 'NOUVELLE' | 'CONSULTEE' | 'ACQUITTEE';
  consultee_at?: string;
  acquittee_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UseAnomaliesResult {
  anomalies: Anomalie[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  acquitter: (id: number) => Promise<void>;
  stats: {
    nouvelles: number;
    consultees: number;
    acquittees: number;
    critical: number;
  };
}

interface AnomalieFilters {
  statut?: 'NOUVELLE' | 'CONSULTEE' | 'ACQUITTEE';
  severite?: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
}

/**
 * Hook pour récupérer et gérer les anomalies
 */
export function useAnomalies(filters?: AnomalieFilters): UseAnomaliesResult {
  const [anomalies, setAnomalies] = useState<Anomalie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère les anomalies depuis l'API
   */
  const fetchAnomalies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construire les paramètres de requête
      const params = new URLSearchParams();
      if (filters?.statut) params.append('statut', filters.statut);
      if (filters?.severite) params.append('severite', filters.severite);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const url = `${baseUrl}/api/energy/anomalies/?${params.toString()}`;
      const token = localStorage.getItem('sm_token') || localStorage.getItem('access_token');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      // Gérer la pagination
      const results = data.results || data;
      setAnomalies(Array.isArray(results) ? results : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      console.error('Erreur fetch anomalies:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Marquer une anomalie comme acquittée
   */
  const acquitter = useCallback(async (id: number) => {
    try {
      const token = localStorage.getItem('sm_token') || localStorage.getItem('access_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${baseUrl}/api/energy/anomalies/${id}/marquer_acquittee/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur acquittement: ${response.status}`);
      }

      const updated = await response.json();
      
      // Mise à jour optimiste locale
      setAnomalies(prev =>
        prev.map(a => (a.id === id ? updated : a))
      );
    } catch (err) {
      console.error('Erreur acquittement anomalie:', err);
      throw err;
    }
  }, []);

  // Récupérer les anomalies au chargement et quand les filtres changent
  useEffect(() => {
    fetchAnomalies();
  }, [fetchAnomalies]);

  /**
   * Calculer les statistiques
   */
  const stats = {
    nouvelles: anomalies.filter(a => a.statut === 'NOUVELLE').length,
    consultees: anomalies.filter(a => a.statut === 'CONSULTEE').length,
    acquittees: anomalies.filter(a => a.statut === 'ACQUITTEE').length,
    critical: anomalies.filter(a => a.severite === 'HAUTE' || a.severite === 'CRITIQUE').length,
  };

  return {
    anomalies,
    loading,
    error,
    refetch: fetchAnomalies,
    acquitter,
    stats,
  };
}
