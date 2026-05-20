"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/hooks/useDashboard";
import GlassCard from "@/components/ui/GlassCard";
import { Zap, TrendingUp, AlertTriangle, Cpu, Loader } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

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
        <GlassCard className="lg:col-span-2 p-8 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Consommation Dernières 48h</h3>
              <p className="text-slate-500 text-xs mt-1">Données actualisées en temps réel</p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5 bg-brand-cyan/10 px-2 py-1 rounded-md border border-brand-cyan/20">
                <div className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                <span className="text-brand-cyan">Normale</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
                <span className="text-amber-400">Anomalie</span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-[300px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader size={24} className="text-brand-cyan animate-spin" />
              </div>
            ) : graphPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graphPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(time) => {
                      const date = new Date(time);
                      if (date.getHours() === 0 && date.getMinutes() === 0) {
                        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
                      }
                      return date.getHours() % 6 === 0 ? `${date.getHours()}h` : '';
                    }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                    minTickGap={20}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const isAnomaly = data.anomaly_label !== 0;
                        return (
                          <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                              {new Date(data.timestamp).toLocaleString('fr-FR', { 
                                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                              })}
                            </p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-white text-lg font-black">{data.kwh.toFixed(2)}</span>
                              <span className="text-slate-500 text-xs font-bold">kWh</span>
                            </div>
                            {isAnomaly && (
                              <div className="mt-2 flex items-center gap-1.5 text-amber-400 text-[10px] font-bold py-1 px-2 bg-amber-400/10 rounded-lg border border-amber-400/20">
                                <AlertTriangle size={10} />
                                ANOMALIE DÉTECTÉE
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }}
                  />
                  <Bar 
                    dataKey="kwh" 
                    radius={[4, 4, 0, 0]}
                    barSize={Math.max(4, 400 / graphPoints.length)}
                  >
                    {graphPoints.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.anomaly_label !== 0 ? '#fbbf24' : '#06b6d4'} 
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 italic">
                Pas de données de consommation disponibles
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Aujourd'hui</p>
              <p className="text-white text-lg font-black">{dashboardData?.consommation_jour.toFixed(1) || '--'} <span className="text-[10px] font-medium text-slate-500">kWh</span></p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">7 Derniers Jours</p>
              <p className="text-white text-lg font-black">{dashboardData?.consommation_semaine.toFixed(1) || '--'} <span className="text-[10px] font-medium text-slate-500">kWh</span></p>
            </div>
            <div className="space-y-1 border-l border-white/5">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Variation</p>
              <div className="flex items-center justify-center gap-1">
                <p className={`text-lg font-black ${dashboardData?.variation_jour && dashboardData.variation_jour > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {dashboardData?.variation_jour && dashboardData.variation_jour > 0 ? '+' : ''}
                  {dashboardData?.variation_jour.toFixed(1) || '--'}%
                </p>
              </div>
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
                  {dashboardData.conseil_ia || (dashboardData.alertes_actives > 0
                    ? `⚠️ Vous avez ${dashboardData.alertes_actives} alerte${dashboardData.alertes_actives > 1 ? 's' : ''} active${dashboardData.alertes_actives > 1 ? 's' : ''}. Consultez-les pour optimiser votre consommation.`
                    : `✨ Votre consommation de pointe se situe entre 19h et 21h. Essayez de décaler l'utilisation de votre lave-linge après 22h pour réduire votre facture de 15%.`)}
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
