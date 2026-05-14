'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useAdminResidentDetail } from '@/hooks/useAdminResidents';
import { ArrowLeft, AlertTriangle, TrendingUp, Zap, Clock } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function AdminResidentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const residentId = parseInt(params.id as string);

  const { data: resident, loading, error } = useAdminResidentDetail(residentId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block mb-4">
            <div className="w-8 h-8 border-2 border-brand-cyan border-t-transparent rounded-full"></div>
          </div>
          <p className="text-slate-400">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !resident) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-brand-cyan hover:text-cyan-300 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>
        <div className="text-center text-red-400">{error || 'Résident non trouvé'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-12">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-brand-cyan hover:text-cyan-300 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {resident.first_name} {resident.last_name}
        </h1>
        <p className="text-slate-400">{resident.email}</p>
      </motion.div>

      {/* KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Conso Jour</p>
              <p className="text-2xl font-bold text-white">{resident.consommation_jour.toFixed(1)} kWh</p>
            </div>
            <Zap className="w-10 h-10 text-brand-cyan opacity-40" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Conso Semaine</p>
              <p className="text-2xl font-bold text-white">{resident.consommation_semaine.toFixed(1)} kWh</p>
            </div>
            <Clock className="w-10 h-10 text-brand-violet opacity-40" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Coût Estimé Mois</p>
              <p className="text-2xl font-bold text-white">{resident.cout_estime_mois.toFixed(2)} DH</p>
            </div>
            <TrendingUp className="w-10 h-10 text-brand-green opacity-40" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Alertes Actives</p>
              <p className="text-2xl font-bold text-white">{resident.alertes_non_acquittees.length}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-amber-400 opacity-40" />
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Foyer Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard>
            <h2 className="text-lg font-bold text-white mb-4">Foyer Associé</h2>
            {resident.foyer ? (
              <div className="space-y-2">
                <div>
                  <p className="text-slate-400 text-sm">Numéro</p>
                  <p className="text-white font-medium">{resident.foyer.numero_foyer}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Adresse</p>
                  <p className="text-white">{resident.foyer.adresse}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Code Postal</p>
                  <p className="text-white">{resident.foyer.code_postal}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Ville</p>
                  <p className="text-white">{resident.foyer.ville}</p>
                </div>
              </div>
            ) : (
              <p className="text-amber-400">Aucun foyer assigné</p>
            )}
          </GlassCard>
        </motion.div>

        {/* Anomalies */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard>
            <h2 className="text-lg font-bold text-white mb-4">Anomalies Actives ({resident.anomalies_actives.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {resident.anomalies_actives.length === 0 ? (
                <p className="text-slate-400">Aucune anomalie</p>
              ) : (
                resident.anomalies_actives.map((anomalie: any) => (
                  <div key={anomalie.id} className="bg-slate-800 rounded p-2">
                    <p className="text-sm text-white">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          anomalie.severite === 'HAUTE' || anomalie.severite === 'CRITIQUE'
                            ? 'bg-red-500/20 text-red-300'
                            : anomalie.severite === 'MOYENNE'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}
                      >
                        {anomalie.severite}
                      </span>
                      <span className="ml-2 text-slate-400 text-xs">{anomalie.statut}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Alertes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard>
            <h2 className="text-lg font-bold text-white mb-4">Alertes Non Acquittées ({resident.alertes_non_acquittees.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {resident.alertes_non_acquittees.length === 0 ? (
                <p className="text-slate-400">Aucune alerte</p>
              ) : (
                resident.alertes_non_acquittees.map((alerte: any) => (
                  <div key={alerte.id} className="bg-slate-800 rounded p-2">
                    <p className="text-sm text-white">
                      <span className="text-red-400">#{alerte.id}</span>
                      <span className="ml-2 text-slate-400 text-xs">{alerte.statut}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Dernières Consommations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <GlassCard>
          <h2 className="text-lg font-bold text-white mb-4">Dernières Consommations (48h)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Timestamp</th>
                  <th className="text-right py-2 px-3 text-slate-400 font-medium">kWh</th>
                </tr>
              </thead>
              <tbody>
                {resident.dernieres_consommations.map((c: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-white">{new Date(c.timestamp).toLocaleString('fr-FR')}</td>
                    <td className="py-2 px-3 text-right text-brand-cyan">{c.kwh.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
