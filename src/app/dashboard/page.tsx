"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/hooks/useDashboard";
import GlassCard from "@/components/ui/GlassCard";
import { Zap, TrendingUp, AlertTriangle, Cpu, Loader } from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  raw?: number;
}

export default function ResidentDashboard() {
  const { user } = useAuth();
  const { data: dashboardData, loading, error, refetch } = useDashboard();

  // Construire les stats à partir des données de l'API
  const stats: StatCard[] = dashboardData
    ? [
        {
          label: "Consommation Actuelle",
          value: `${dashboardData.consommation_actuelle.toFixed(1)} kWh`,
          icon: <Zap className="text-brand-cyan" />,
          change: `${dashboardData.variation_jour > 0 ? '+' : ''}${dashboardData.variation_jour}%`,
          raw: dashboardData.consommation_actuelle,
        },
        {
          label: "Coût Estimé (Mois)",
          value: `${dashboardData.cout_estime_mois.toFixed(0)} DH`,
          icon: <TrendingUp className="text-brand-violet" />,
          change: "Estimation",
          raw: dashboardData.cout_estime_mois,
        },
        {
          label: "Consommation Jour",
          value: `${dashboardData.consommation_jour.toFixed(1)} kWh`,
          icon: <Cpu className="text-emerald-400" />,
          change: "Aujourd'hui",
          raw: dashboardData.consommation_jour,
        },
        {
          label: "Alertes",
          value: dashboardData.alertes_actives.toString(),
          icon: <AlertTriangle className="text-amber-400" />,
          change: dashboardData.alertes_actives > 0 ? "Active" : "Aucune",
          raw: dashboardData.alertes_actives,
        },
      ]
    : [
        { label: "Consommation Actuelle", value: "--", icon: <Zap className="text-brand-cyan" />, change: "--" },
        { label: "Coût Estimé (Mois)", value: "--", icon: <TrendingUp className="text-brand-violet" />, change: "--" },
        { label: "Appareils Actifs", value: "--", icon: <Cpu className="text-emerald-400" />, change: "--" },
        { label: "Alertes", value: "--", icon: <AlertTriangle className="text-amber-400" />, change: "--" },
      ];

  // Fonction pour déterminer la couleur du changement
  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'bg-red-500/10 text-red-400';
    if (change.startsWith('-')) return 'bg-emerald-500/10 text-emerald-400';
    return 'bg-white/5 text-slate-500';
  };

  // Données pour le graphique
  const graphPoints = dashboardData?.points_graphique || [];

  // Trouver min/max pour normaliser l'affichage
  const kwhs = graphPoints.map(p => p.kwh);
  const maxKwh = kwhs.length > 0 ? Math.max(...kwhs) : 1;
  const minKwh = kwhs.length > 0 ? Math.min(...kwhs) : 0;
  const rangeKwh = maxKwh - minKwh || 1;

  // Formater le timestamp pour affichage
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Bienvenue, <span className="text-brand-cyan">{user?.fullName || user?.username}</span>
        </h1>
        <p className="text-slate-500 mt-2">Voici un aperçu de votre consommation énergétique en temps réel.</p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: loading ? 0 : idx * 0.1 }}
          >
            <GlassCard className="p-6 relative overflow-hidden">
              {loading && (
                <div className="absolute inset-0 bg-white/5 flex items-center justify-center rounded-xl">
                  <Loader size={20} className="text-brand-cyan animate-spin" />
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  {stat.icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${getChangeColor(stat.change)}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Graphique et Conseil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique de consommation */}
        <GlassCard className="lg:col-span-2 p-8 min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">Consommation Dernières 48h</h3>

          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader size={24} className="text-brand-cyan animate-spin" />
            </div>
          ) : graphPoints.length > 0 ? (
            <div className="h-[300px] flex items-end justify-between gap-1 relative">
              {/* Ligne de référence */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-t border-white/10 w-full"></div>
                <div className="border-t border-white/10 w-full"></div>
                <div className="border-t border-white/10 w-full"></div>
              </div>

              {/* Points */}
              {graphPoints.map((point, idx) => {
                const normalizedHeight = rangeKwh > 0 ? ((point.kwh - minKwh) / rangeKwh) * 100 : 50;
                const isAnomaly = point.anomaly_label !== 0;

                return (
                  <motion.div
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(5, normalizedHeight)}%` }}
                    transition={{ delay: idx * 0.02 }}
                    className="flex-1 group relative"
                  >
                    <div
                      className={`w-full h-full rounded-t transition-all ${
                        isAnomaly
                          ? 'bg-gradient-to-t from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300'
                          : 'bg-gradient-to-t from-brand-cyan to-brand-cyan/60 hover:from-brand-cyan hover:to-brand-cyan'
                      } opacity-80 hover:opacity-100`}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-white/20">
                        <div>{point.kwh.toFixed(2)} kWh</div>
                        <div className="text-slate-400">{formatTime(point.timestamp)}</div>
                        {isAnomaly && <div className="text-amber-400">⚠️ Anomalie</div>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-600">
              Pas de données de consommation disponibles
            </div>
          )}

          <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <p className="text-slate-500">Jour</p>
              <p className="text-white font-bold">{dashboardData?.consommation_jour.toFixed(1) || '--'} kWh</p>
            </div>
            <div>
              <p className="text-slate-500">Semaine</p>
              <p className="text-white font-bold">{dashboardData?.consommation_semaine.toFixed(1) || '--'} kWh</p>
            </div>
            <div>
              <p className="text-slate-500">Variation</p>
              <p className={`font-bold ${dashboardData?.variation_jour && dashboardData.variation_jour > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {dashboardData?.variation_jour && dashboardData.variation_jour > 0 ? '+' : ''}
                {dashboardData?.variation_jour.toFixed(1) || '--'}%
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Conseil IA */}
        <GlassCard className="p-8 border-brand-cyan/20 bg-brand-cyan/5">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap size={20} className="text-brand-cyan" />
            Conseil IA
          </h3>
          <div className="space-y-4">
            {dashboardData ? (
              <>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {dashboardData.alertes_actives > 0
                    ? `⚠️ Vous avez ${dashboardData.alertes_actives} alerte${dashboardData.alertes_actives > 1 ? 's' : ''} active${dashboardData.alertes_actives > 1 ? 's' : ''}. Consultez-les pour optimiser votre consommation.`
                    : `✨ Votre consommation de pointe se situe entre 19h et 21h. Essayez de décaler l'utilisation de votre lave-linge après 22h pour réduire votre facture de 15%.`}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => refetch()}
                    className="w-full py-3 rounded-xl bg-brand-cyan text-brand-dark font-bold text-sm hover:scale-[1.02] transition-transform"
                  >
                    Rafraîchir les données
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Loader size={16} className="text-brand-cyan animate-spin" />
                <p className="text-slate-400 text-sm">Chargement des données...</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
