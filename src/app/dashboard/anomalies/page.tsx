/**
 * Page Dashboard pour les Anomalies détectées
 * RG7, RG8, RG9: Affichage, filtrage et gestion des anomalies
 */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { useAnomalies, Anomalie } from '@/hooks/useAnomalies';
import AnomalyBadge from '@/components/anomalies/AnomalyBadge';
import ScoreBar from '@/components/anomalies/ScoreBar';

type StatusFilter = 'toutes' | 'NOUVELLE' | 'CONSULTEE' | 'ACQUITTEE';
type SeveriteFilter = 'toutes' | 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';

export default function AnomaliesPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('toutes');
  const [severiteFilter, setSeveriteFilter] = useState<SeveriteFilter>('toutes');

  // Construire les filtres pour le hook
  const filters = {
    statut: statusFilter !== 'toutes' ? (statusFilter as any) : undefined,
    severite: severiteFilter !== 'toutes' ? (severiteFilter as any) : undefined,
  };

  const { anomalies, loading, error, acquitter, stats } = useAnomalies(filters);

  /**
   * Formater une date en format français
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Mapper les statuts à des libellés
   */
  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'NOUVELLE':
        return '🆕 Nouvelle';
      case 'CONSULTEE':
        return '👁️ Consultée';
      case 'ACQUITTEE':
        return '✓ Acquittée';
      default:
        return statut;
    }
  };

  /**
   * Obtenir la couleur du statut
   */
  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'NOUVELLE':
        return 'text-cyan-400 bg-cyan-500/10';
      case 'CONSULTEE':
        return 'text-blue-400 bg-blue-500/10';
      case 'ACQUITTEE':
        return 'text-gray-500 bg-gray-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  /**
   * Traiter l'acquittement d'une anomalie
   */
  const handleAcquitter = async (id: number) => {
    try {
      await acquitter(id);
      toast.success('Anomalie acquittée', {
        description: 'L\'anomalie a été marquée comme acquittée.',
      });
    } catch (err) {
      toast.error('Erreur', {
        description: 'Impossible d\'acquitter l\'anomalie.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <Toaster theme="dark" richColors />

      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🚨 Anomalies Détectées</h1>
        <p className="text-gray-400">Gestion des anomalies de consommation avec scores Hugging Face</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Nouvelles anomalies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 * 0.1 }}
          className="bg-gradient-to-br from-cyan-900/20 to-cyan-900/5 border border-cyan-500/20 rounded-lg p-4"
        >
          <div className="text-cyan-400/70 text-sm mb-2">Nouvelles</div>
          <div className="text-3xl font-bold text-cyan-400 font-mono">{stats.nouvelles}</div>
        </motion.div>

        {/* Anomalies critiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 * 0.1 }}
          className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-500/20 rounded-lg p-4"
        >
          <div className="text-red-400/70 text-sm mb-2">Critiques</div>
          <div className="text-3xl font-bold text-red-400 font-mono">{stats.critical}</div>
        </motion.div>

        {/* Consultées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 * 0.1 }}
          className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-lg p-4"
        >
          <div className="text-blue-400/70 text-sm mb-2">Consultées</div>
          <div className="text-3xl font-bold text-blue-400 font-mono">{stats.consultees}</div>
        </motion.div>

        {/* Acquittées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 * 0.1 }}
          className="bg-gradient-to-br from-gray-700/20 to-gray-700/5 border border-gray-500/20 rounded-lg p-4"
        >
          <div className="text-gray-400/70 text-sm mb-2">Acquittées</div>
          <div className="text-3xl font-bold text-gray-400 font-mono">{stats.acquittees}</div>
        </motion.div>
      </div>

      {/* Filtres */}
      <div className="mb-8 bg-slate-900/50 backdrop-blur border border-slate-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtre Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
            <div className="flex flex-wrap gap-2">
              {(['toutes', 'NOUVELLE', 'CONSULTEE', 'ACQUITTEE'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                  }`}
                >
                  {status === 'toutes' ? 'Tous' : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Filtre Sévérité */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sévérité</label>
            <div className="flex flex-wrap gap-2">
              {(['toutes', 'BASSE', 'MOYENNE', 'HAUTE', 'CRITIQUE'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeveriteFilter(sev)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    severiteFilter === sev
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                  }`}
                >
                  {sev === 'toutes' ? 'Tous' : sev.charAt(0) + sev.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* État de chargement */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border border-cyan-500 border-t-transparent" />
        </div>
      )}

      {/* Erreur */}
      {error && !loading && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Table des anomalies */}
      {!loading && anomalies.length > 0 && (
        <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* En-tête */}
              <thead>
                <tr className="bg-slate-900 border-b border-slate-700">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Foyer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Consommation</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Score HF</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Sévérité</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Action</th>
                </tr>
              </thead>

              {/* Corps */}
              <tbody>
                <AnimatePresence>
                  {anomalies.map((anomalie, index) => (
                    <motion.tr
                      key={anomalie.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: index * 0.03 }}
                      className={`border-b border-slate-700 hover:bg-slate-800/50 transition ${
                        index % 2 === 0 ? 'bg-slate-900/50' : 'bg-slate-800/30'
                      }`}
                    >
                      {/* Foyer */}
                      <td className="px-6 py-4">
                        <div className="font-mono text-cyan-400 font-semibold">
                          {anomalie.consommation.foyer_numero}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400">
                          {formatDate(anomalie.consommation.timestamp_consommation)}
                        </div>
                      </td>

                      {/* Consommation */}
                      <td className="px-6 py-4">
                        <div className="font-mono text-white font-semibold">
                          {anomalie.consommation.kwh.toFixed(2)} kWh
                        </div>
                      </td>

                      {/* Score Hugging Face */}
                      <td className="px-6 py-4">
                        <ScoreBar score={anomalie.score_confiance} showPercent={true} />
                      </td>

                      {/* Sévérité */}
                      <td className="px-6 py-4">
                        <AnomalyBadge severite={anomalie.severite} />
                      </td>

                      {/* Statut */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(
                            anomalie.statut
                          )}`}
                        >
                          {getStatutLabel(anomalie.statut)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        {anomalie.statut !== 'ACQUITTEE' && (
                          <button
                            onClick={() => handleAcquitter(anomalie.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg text-sm font-medium transition"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Acquitter
                          </button>
                        )}
                        {anomalie.statut === 'ACQUITTEE' && (
                          <div className="text-gray-500 text-sm">Acquittée</div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aucune anomalie */}
      {!loading && anomalies.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-xl font-semibold text-white mb-2">Aucune anomalie</h3>
          <p className="text-gray-400">Aucune anomalie détectée pour les filtres sélectionnés.</p>
        </div>
      )}
    </div>
  );
}
