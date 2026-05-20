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
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Eye, Check, Info } from 'lucide-react';

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
  const { secureFetch } = useSecureApi();
  const [anomalies, setAnomalies] = useState<Anomalie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    statut: 'all',
    severite: 'all',
  });

  // State for modals
  const [selectedAnomalie, setSelectedAnomalie] = useState<Anomalie | null>(null);
  const [anomalieToAcquitter, setAnomalieToAcquitter] = useState<Anomalie | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchAnomalies();
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
    
    if (err instanceof TypeError) {
      return "Impossible de se connecter au serveur. Assurez-vous que le backend est en cours d'exécution.";
    }
    
    if (err instanceof Error && err.name === 'AbortError') {
      return "Délai d'attente dépassé. Le serveur met trop de temps à répondre.";
    }
    
    return "Erreur lors du chargement des anomalies.";
  };

  const fetchAnomalies = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filter.statut && filter.statut !== 'all') params.append('statut', filter.statut);
      if (filter.severite && filter.severite !== 'all') params.append('severite', filter.severite);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await secureFetch(
          `${baseUrl}/energy/anomalies/?${params.toString()}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        const data = await response.json();
        const results = data.results || data;
        setAnomalies(Array.isArray(results) ? results : []);
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err) {
      const statusCode = (err as any)?.status || null;
      const message = getErrorMessage(err, statusCode);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleConsulter = async (anomalie: Anomalie) => {
    setSelectedAnomalie(anomalie);
    
    if (anomalie.statut === 'NOUVELLE') {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        await secureFetch(
          `${baseUrl}/energy/anomalies/${anomalie.id}/marquer_consultee/`,
          { method: 'POST' }
        );
        fetchAnomalies();
      } catch (e) {
        console.error("Erreur lors du marquage comme consulté:", e);
      }
    }
  };

  const confirmAcquitter = async () => {
    if (!anomalieToAcquitter) return;
    
    setIsProcessing(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await secureFetch(
        `${baseUrl}/energy/anomalies/${anomalieToAcquitter.id}/marquer_acquittee/`,
        { method: 'POST' }
      );

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setAnomalieToAcquitter(null);
          fetchAnomalies();
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de l\'acquittement de l\'anomalie');
    } finally {
      setIsProcessing(false);
    }
  };

  const getSeveriteBadgeColor = (severite: string) => {
    switch (severite) {
      case 'CRITIQUE':
        return 'bg-red-600/20 text-red-400 border-red-600/50';
      case 'HAUTE':
        return 'bg-orange-600/20 text-orange-400 border-orange-600/50';
      case 'MOYENNE':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50';
      default:
        return 'bg-green-600/20 text-green-400 border-green-600/50';
    }
  };

  const getStatutBadgeColor = (statut: string) => {
    switch (statut) {
      case 'NOUVELLE':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/50';
      case 'CONSULTEE':
        return 'bg-purple-600/20 text-purple-400 border-purple-600/50';
      case 'ACQUITTEE':
        return 'bg-gray-600/20 text-gray-400 border-gray-600/50';
      default:
        return 'bg-gray-400/20 text-gray-300 border-gray-400/50';
    }
  };

  return (
    <div className="space-y-6 relative min-h-[80vh] pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Gestion des Anomalies
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Surveillance en temps réel via Intelligence Artificielle API NVIDIA 
          </p>
        </div>
        <div className="text-right">
          <Badge className="bg-gray-800 text-gray-300 border-gray-700">
            {anomalies.length} Anomalies détectées
          </Badge>
        </div>
      </div>

      <ErrorAlert 
        error={error} 
        onRetry={fetchAnomalies}
        loading={loading}
      />

      {/* Filtres Premium */}
      <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex gap-6 flex-wrap shadow-2xl">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2 ml-1">
            Statut du flux
          </label>
          <Select
            value={filter.statut}
            onValueChange={(value) =>
              setFilter({ ...filter, statut: value })
            }
          >
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white rounded-xl h-11 focus:ring-blue-500/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="NOUVELLE">NOUVELLE</SelectItem>
              <SelectItem value="CONSULTEE">CONSULTEE</SelectItem>
              <SelectItem value="ACQUITTEE">ACQUITTEE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2 ml-1">
            Niveau de sévérité
          </label>
          <Select
            value={filter.severite}
            onValueChange={(value) =>
              setFilter({ ...filter, severite: value })
            }
          >
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white rounded-xl h-11 focus:ring-blue-500/50">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">Toutes les sévérités</SelectItem>
              <SelectItem value="BASSE">BASSE</SelectItem>
              <SelectItem value="MOYENNE">MOYENNE</SelectItem>
              <SelectItem value="HAUTE">HAUTE</SelectItem>
              <SelectItem value="CRITIQUE">CRITIQUE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tableau Premium */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">Analyse des données en cours...</p>
        </div>
      ) : (
        <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent bg-gray-800/30">
                <TableHead className="text-gray-400 font-bold py-4">FOYER</TableHead>
                <TableHead className="text-gray-400 font-bold">SCORE HF</TableHead>
                <TableHead className="text-gray-400 font-bold">SÉVÉRITÉ</TableHead>
                <TableHead className="text-gray-400 font-bold">STATUT</TableHead>
                <TableHead className="text-gray-400 font-bold">CONSOMMATION</TableHead>
                <TableHead className="text-gray-400 font-bold text-right pr-8">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anomalies.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-20 text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-12 h-12 text-gray-700" />
                      <p className="text-lg">Aucune anomalie détectée pour le moment</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                anomalies.map((anomalie, index) => (
                  <motion.tr 
                    key={anomalie.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-gray-800 hover:bg-white/[0.02] group transition-colors"
                  >
                    <TableCell className="text-white font-semibold py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-10 rounded-full ${anomalie.severite === 'CRITIQUE' ? 'bg-red-500' : 'bg-gray-700'}`}></div>
                        <span>{anomalie.foyer_numero}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${anomalie.score_confiance > 0.8 ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${(anomalie.score_confiance * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm font-medium">
                          {(anomalie.score_confiance * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getSeveriteBadgeColor(anomalie.severite)} border px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider`}>
                        {anomalie.severite}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatutBadgeColor(anomalie.statut)} border px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider`}>
                        {anomalie.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300 font-medium">
                      {anomalie.consommation_kwh ? anomalie.consommation_kwh.toFixed(2) : '0'} <span className="text-gray-500 text-xs">kWh</span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                          onClick={() => handleConsulter(anomalie)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Consulter
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all"
                          onClick={() => setAnomalieToAcquitter(anomalie)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Acquitter
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal CONSULTER */}
      <AnimatePresence>
        {selectedAnomalie && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedAnomalie(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getSeveriteBadgeColor(selectedAnomalie.severite)}>
                        {selectedAnomalie.severite}
                      </Badge>
                      <Badge className={getStatutBadgeColor(selectedAnomalie.statut)}>
                        {selectedAnomalie.statut}
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Détails de l'anomalie</h2>
                    <p className="text-gray-400">Foyer n° {selectedAnomalie.foyer_numero}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedAnomalie(null)}
                    className="p-2 hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Consommation</p>
                    <p className="text-2xl font-bold text-white">{selectedAnomalie.consommation_kwh.toFixed(2)} kWh</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Température</p>
                    <p className="text-2xl font-bold text-white">{selectedAnomalie.temperature ? `${selectedAnomalie.temperature.toFixed(1)}°C` : 'N/A'}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Score IA</p>
                    <p className="text-2xl font-bold text-blue-400">{(selectedAnomalie.score_confiance * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Date détection</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(selectedAnomalie.timestamp_consommation).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl mb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Analyse de l'IA</p>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedAnomalie.description || "L'algorithme de détection a identifié un comportement atypique de consommation par rapport aux patterns historiques de ce foyer. Une vérification manuelle est recommandée."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    className="bg-white text-black hover:bg-gray-200 rounded-xl px-8 h-12 font-bold"
                    onClick={() => setSelectedAnomalie(null)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal ACQUITTER */}
      <AnimatePresence>
        {anomalieToAcquitter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !showSuccess && !isProcessing && setAnomalieToAcquitter(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 text-center">
                {showSuccess ? (
                  <div className="py-8 flex flex-col items-center">
                    <motion.img 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src="https://cdn.pixabay.com/animation/2022/12/05/10/47/10-47-58-930_512.gif" 
                      alt="Success" 
                      className="w-32 h-32 mb-6"
                    />
                    <h3 className="text-2xl font-bold text-white mb-2">Anomalie acquittée !</h3>
                    <p className="text-gray-400">Le statut a été mis à jour avec succès.</p>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Confirmation</h3>
                    <p className="text-gray-400 mb-8 text-lg">
                      Êtes-vous sûr de vouloir acquitter cette anomalie pour le foyer <span className="text-white font-bold">{anomalieToAcquitter.foyer_numero}</span> ?
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="ghost"
                        className="h-12 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 font-bold"
                        onClick={() => setAnomalieToAcquitter(null)}
                        disabled={isProcessing}
                      >
                        Non, annuler
                      </Button>
                      <Button 
                        className="h-12 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg shadow-green-900/20"
                        onClick={confirmAcquitter}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Traitement...' : 'Oui, acquitter'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
