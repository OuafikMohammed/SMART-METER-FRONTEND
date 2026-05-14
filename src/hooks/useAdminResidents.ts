'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Foyer {
  id: number;
  numero_foyer: string;
}

interface Resident {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  foyer: Foyer | null;
  consommation_jour: number;
  consommation_semaine: number;
  anomalies_actives: number;
  alertes_non_acquittees: number;
  derniere_mesure: string | null;
}

interface ResidentsResponse {
  count: number;
  page: number;
  page_size: number;
  results: Resident[];
}

interface ResidentDetail extends Resident {
  consommation_mois: number;
  cout_estime_mois: number;
  anomalies_actives: Array<{
    id: number;
    severite: string;
    statut: string;
    consommation__timestamp: string;
  }>;
  alertes_non_acquittees: Array<{
    id: number;
    statut: string;
    created_at: string;
  }>;
  dernieres_consommations: Array<{
    timestamp: string;
    kwh: number;
  }>;
}

export function useAdminResidents(page = 1, pageSize = 20, search = '', foyerId?: number) {
  const { token } = useAuth();
  const [data, setData] = useState<ResidentsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResidents = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search }),
        ...(foyerId && { foyer_id: foyerId.toString() }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/energy/admin/residents/?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des résidents');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [token, page, pageSize, search, foyerId]);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  return { data, loading, error, refetch: fetchResidents };
}

export function useAdminResidentDetail(residentId: number | null) {
  const { token } = useAuth();
  const [data, setData] = useState<ResidentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResidentDetail = useCallback(async () => {
    if (!token || !residentId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/energy/admin/residents/${residentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du détail du résident');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [token, residentId]);

  useEffect(() => {
    fetchResidentDetail();
  }, [fetchResidentDetail]);

  return { data, loading, error, refetch: fetchResidentDetail };
}

export function useAssignFoyer() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignFoyer = useCallback(
    async (residentId: number, foyerId: number) => {
      if (!token) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/energy/admin/residents/${residentId}/assign-foyer/`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ foyer_id: foyerId }),
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de l\'assignation du foyer');
        }

        const result = await response.json();
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { assignFoyer, loading, error };
}
