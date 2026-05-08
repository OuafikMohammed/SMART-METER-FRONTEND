/**
 * Page Admin Anomalies - Sprint 3
 * Affiche et permet de gérer les anomalies Hugging Face
 * RG7, RG8, RG9: Anomalies avec score HF, statuts (NOUVELLE→CONSULTEE→ACQUITTEE)
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
import PremiumButton from '@/components/ui/PremiumButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Anomalie {
  id: number;
  foyer_numero: string;
  foyer_id: number;
  timestamp_consommation: string;
  consommation_kwh: number;
  temperature?: number;
  score_confiance: number;
  severite: string;
  statut: string;
  description?: string;
  created_at: string;
  consultee_at?: string;
  acquittee_at?: string;
}

export default function AdminAnomaliesPage() {
  const [anomalies, setAnomalies] = useState<Anomalie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    statut: 'all',
    severite: 'all',
  });

  useEffect(() => {
    fetchAnomalies();
  }, [filter]);

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.statut && filter.statut !== 'all') params.append('statut', filter.statut);
      if (filter.severite && filter.severite !== 'all') params.append('severite', filter.severite);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('sm_token') || localStorage.getItem('access_token');
      const response = await fetch(
        `${baseUrl}/api/energy/anomalies/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      // Handle paginated responses
      const results = data.results || data;
      setAnomalies(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const marquerConsultee = async (anomalieId: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('sm_token') || localStorage.getItem('access_token');
      const response = await fetch(
        `${baseUrl}/api/energy/anomalies/${anomalieId}/marquer_consultee/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Erreur');
      fetchAnomalies();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const marquerAcquittee = async (anomalieId: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('sm_token') || localStorage.getItem('access_token');
      const response = await fetch(
        `${baseUrl}/api/energy/anomalies/${anomalieId}/marquer_acquittee/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Erreur');
      fetchAnomalies();
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
          Gestion des Anomalies
        </h1>
        <p className="text-gray-400">
          Score Hugging Face • Statuts: NOUVELLE → CONSULTEE → ACQUITTEE
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
            Sévérité
          </label>
          <Select
            value={filter.severite}
            onValueChange={(value) =>
              setFilter({ ...filter, severite: value })
            }
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">Toutes les sévérités</SelectItem>
              <SelectItem value="BASSE">BASSE</SelectItem>
              <SelectItem value="MOYENNE">MOYENNE</SelectItem>
              <SelectItem value="HAUTE">HAUTE</SelectItem>
              <SelectItem value="CRITIQUE">CRITIQUE</SelectItem>
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
                <TableHead className="text-gray-300">Score HF</TableHead>
                <TableHead className="text-gray-300">Sévérité</TableHead>
                <TableHead className="text-gray-300">Statut</TableHead>
                <TableHead className="text-gray-300">kWh</TableHead>
                <TableHead className="text-gray-300">Temp.</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anomalies.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-400"
                  >
                    Aucune anomalie
                  </TableCell>
                </TableRow>
              ) : (
                anomalies.map((anomalie) => (
                  <TableRow key={anomalie.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">
                      {anomalie.foyer_numero}
                    </TableCell>
                    <TableCell className="text-white">
                      {anomalie.score_confiance ? (anomalie.score_confiance * 100).toFixed(0) : '0'}%
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeveriteBadgeColor(anomalie.severite)}>
                        {anomalie.severite}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatutBadgeColor(anomalie.statut)}>
                        {anomalie.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {anomalie.consommation_kwh ? anomalie.consommation_kwh.toFixed(2) : '0'} kWh
                    </TableCell>
                    <TableCell className="text-white">
                      {anomalie.temperature ? anomalie.temperature.toFixed(1) : '—'}°C
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {anomalie.statut === 'NOUVELLE' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => marquerConsultee(anomalie.id)}
                          >
                            Consulter
                          </Button>
                        )}
                        {anomalie.statut !== 'ACQUITTEE' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => marquerAcquittee(anomalie.id)}
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
    </div>
  );
}
