'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Foyer {
  id: number;
  numero_foyer: string;
  adresse: string;
  code_postal: string;
  ville: string;
  puissance_souscrite: number;
  is_active: boolean;
  residents_count: number;
  consommations_count: number;
  created_at: string;
  updated_at: string;
}

interface FoyersResponse {
  count: number;
  page: number;
  page_size: number;
  results: Foyer[];
}

export function useAdminFoyers(page = 1, pageSize = 20, search = '') {
  const { token } = useAuth();
  const [data, setData] = useState<FoyersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFoyers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/energy/admin/foyers/?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des foyers');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [token, page, pageSize, search]);

  useEffect(() => {
    fetchFoyers();
  }, [fetchFoyers]);

  return { data, loading, error, refetch: fetchFoyers };
}
