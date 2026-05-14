/**
 * Page Admin Alertes - Sprint 3
 * L'administrateur consulte et traite les alertes
 * RG10, RG11, RG12: Alertes visibles dans l'app, gérées par admin, archivées (jamais supprimées)
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSecureApi } from '@/hooks/useSecureApi';

interface Alerte {
  id: number;
  anomalie: number;
  foyer_numero: string;
  anomalie_severite: string;
  anomalie_score: number;
  statut: string;
  acquittee: boolean;
  created_at: string;
  acquittee_at?: string;
}

export default function AdminAlertsPage() {
  const { secureFetch } = useSecureApi();
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    statut: 'all',
    acquittee: 'all',
  });

  useEffect(() => {
    fetchAlertes();
  }, [filter]);

  const getErrorMessage = (err: unknown, statusCode?: number): string => {
    if (statusCode === 401 || statusCode === 403) {
      return "Vous n'avez pas les permissions pour accéder à ces données.";
    }
    
    if (statusCode === 404) {
      return "Endpoint API non trouvé.";
    }
    
    if (err instanceof Error && (err.message.includes("Failed to fetch") || err.message.includes("fetch failed") || err.message.includes("NetworkError"))) {
      return "Impossible de se connecter au serveur. Assurez-vous que le backend est en cours d'exécution.";
    }
    
    // Also catch plain TypeError without message checking just in case
    if (err instanceof TypeError) {
      return "Impossible de se connecter au serveur. Assurez-vous que le backend est en cours d'exécution.";
    }
    
    if (err instanceof Error && err.name === 'AbortError') {
      return "Délai d'attente dépassé. Le serveur met trop de temps à répondre.";
    }
    
    return "Erreur lors du chargement des alertes.";
  };

  const fetchAlertes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filter.statut && filter.statut !== 'all') params.append('statut', filter.statut);
      if (filter.acquittee && filter.acquittee !== 'all') params.append('acquittee', filter.acquittee);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await secureFetch(
          `${baseUrl}/api/energy/alertes/?${params.toString()}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        const data = await response.json();
        setAlertes(Array.isArray(data) ? data : data.results || []);
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err) {
      const statusCode = (err as any)?.status || null;
      const message = getErrorMessage(err, statusCode);
      setError(message);
      // console.error removed
    } finally {
      setLoading(false);
    }
  };

  const marquerConsultee = async (alerteId: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await secureFetch(
        `${baseUrl}/api/energy/alertes/${alerteId}/marquer_consultee/`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        fetchAlertes();
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la mise à jour de l\'alerte');
    }
  };

  const acquitterAlerte = async (alerteId: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await secureFetch(
        `${baseUrl}/api/energy/alertes/${alerteId}/acquitter/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Erreur');
      fetchAlertes();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getSeveriteBadgeColor = (severite: string) => {
    switch (severite) {
      case 'CRITIQUE':
        return 'bg-red-600';
      case 'HAUTE':
        return 'bg-orange-600';
      case 'MOYENNE':
        return 'bg-yellow-600';
      default:
        return 'bg-green-600';
    }
  };

  const getStatutBadgeColor = (statut: string) => {
    switch (statut) {
      case 'NOUVELLE':
        return 'bg-blue-600';
      case 'CONSULTEE':
        return 'bg-purple-600';
      case 'ACQUITTEE':
        return 'bg-gray-600';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Gestion des Alertes
        </h1>
        <p className="text-gray-400">
          L'administrateur consulte et traite les alertes • Archivage: jamais supprimées
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-300 block mb-2">
            Statut
          </label>
          <Select
            value={filter.statut}
            onValueChange={(value) =>
              setFilter({ ...filter, statut: value })
            }
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="NOUVELLE">NOUVELLE</SelectItem>
              <SelectItem value="CONSULTEE">CONSULTEE</SelectItem>
              <SelectItem value="ACQUITTEE">ACQUITTEE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-300 block mb-2">
            Statut Acquittement
          </label>
          <Select
            value={filter.acquittee}
            onValueChange={(value) =>
              setFilter({ ...filter, acquittee: value })
            }
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="false">Non acquittées</SelectItem>
              <SelectItem value="true">Acquittées (archivées)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="text-center text-gray-400 py-8">Chargement...</div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-gray-300">Foyer</TableHead>
                <TableHead className="text-gray-300">Sévérité</TableHead>
                <TableHead className="text-gray-300">Score HF</TableHead>
                <TableHead className="text-gray-300">Statut</TableHead>
                <TableHead className="text-gray-300">Archivée</TableHead>
                <TableHead className="text-gray-300">Créée le</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-400"
                  >
                    Aucune alerte
                  </TableCell>
                </TableRow>
              ) : (
                alertes.map((alerte) => (
                  <TableRow key={alerte.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">
                      {alerte.foyer_numero}
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeveriteBadgeColor(alerte.anomalie_severite)}>
                        {alerte.anomalie_severite}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {(alerte.anomalie_score * 100).toFixed(0)}%
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatutBadgeColor(alerte.statut)}>
                        {alerte.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          alerte.acquittee
                            ? 'bg-gray-600'
                            : 'bg-yellow-600'
                        }
                      >
                        {alerte.acquittee ? 'Archivée' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(alerte.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {alerte.statut === 'NOUVELLE' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => marquerConsultee(alerte.id)}
                          >
                            Consulter
                          </Button>
                        )}
                        {!alerte.acquittee && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => acquitterAlerte(alerte.id)}
                          >
                            Acquitter
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Infos archivage */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          ℹ️ <strong>RG12 - Archivage:</strong> Les alertes acquittées restent en base de données
          et ne sont jamais supprimées. Elles sont archivées et visibles dans la section
          "Acquittées (archivées)".
        </p>
      </div>
    </div>
  );
}
