"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Calendar, Download, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface HistoryItem {
  date: string;
  consumption: number;
  cost: number;
  peak: string;
}

interface PeriodStats {
  avg: number;
  total: number;
  peak: string;
  saving: string;
}

export default function ConsumptionHistory() {
  const { token } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [periodStats, setPeriodStats] = useState<Record<string, PeriodStats>>({
    week: { avg: 0, total: 0, peak: "", saving: "0%" },
    month: { avg: 0, total: 0, peak: "", saving: "0%" },
    year: { avg: 0, total: 0, peak: "", saving: "0%" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        // Fetch history data
        const historyRes = await fetch(`${baseUrl}/api/energy/consommations/`, {
          headers,
        });

        if (!historyRes.ok) throw new Error('Erreur lors du chargement de l\'historique');
        const historyDataRes = await historyRes.json();
        const results = historyDataRes.results || historyDataRes;
        setHistoryData(Array.isArray(results) ? results : []);

        // Calculate period stats from history data
        const historyArray = Array.isArray(results) ? results : [];
        const avgConsumption = historyArray.length > 0 
          ? historyArray.reduce((sum: number, item: any) => sum + (item.kwh || 0), 0) / historyArray.length 
          : 0;
        const maxConsumption = historyArray.length > 0
          ? Math.max(...historyArray.map((item: any) => item.kwh || 0))
          : 0;
        
        setPeriodStats(prev => ({
          ...prev,
          [selectedPeriod]: {
            avgConsumption: avgConsumption.toFixed(2),
            maxConsumption: maxConsumption.toFixed(2),
            totalConsumption: historyArray.reduce((sum: number, item: any) => sum + (item.kwh || 0), 0).toFixed(2)
          }
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(message);
        console.error('Erreur fetch history:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [selectedPeriod, token]);

  const stats = periodStats[selectedPeriod as keyof typeof periodStats];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Historique de <span className="text-brand-cyan">Consommation</span>
        </h1>
        <p className="text-slate-500 mt-2">Suivi détaillé de votre consommation énergétique au fil du temps.</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-3 flex-wrap">
        {["week", "month", "year"].map((period) => (
          <motion.button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${
              selectedPeriod === period
                ? "bg-brand-cyan text-brand-dark"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            {period === "week" ? "Cette semaine" : period === "month" ? "Ce mois" : "Cette année"}
          </motion.button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <TrendingUp className="text-brand-cyan" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Moyenne Journalière</p>
            <h3 className="text-2xl font-black text-white mt-1">{stats.avg} kWh</h3>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <TrendingUp className="text-brand-violet" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Consommation Totale</p>
            <h3 className="text-2xl font-black text-white mt-1">{stats.total} kWh</h3>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <Clock className="text-emerald-400" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Heures de Pointe</p>
            <h3 className="text-2xl font-black text-white mt-1">{stats.peak}</h3>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <TrendingUp className="text-emerald-400" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                {stats.saving}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Économie vs. Baseline</p>
            <h3 className="text-2xl font-black text-white mt-1">{parseInt(stats.saving)} %</h3>
          </GlassCard>
        </motion.div>
      </div>

      {/* Historical Data Table */}
      <GlassCard className="p-8 overflow-x-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Données Historiques</h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20 transition-all font-bold text-sm">
            <Download size={16} />
            Télécharger
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="text-red-400" size={20} />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-slate-400 text-sm font-bold">Date</th>
                <th className="text-left py-4 px-4 text-slate-400 text-sm font-bold">Consommation</th>
                <th className="text-left py-4 px-4 text-slate-400 text-sm font-bold">Coût Estimé</th>
                <th className="text-left py-4 px-4 text-slate-400 text-sm font-bold">Heures de Pointe</th>
              </tr>
            </thead>
            <tbody>
              {historyData.length > 0 ? (
                historyData.map((item, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 text-white font-medium flex items-center gap-2">
                      <Calendar size={16} className="text-slate-500" />
                      {item.date}
                    </td>
                    <td className="py-4 px-4 text-white font-medium">{item.consumption} kWh</td>
                    <td className="py-4 px-4 text-white font-medium">{item.cost} DH</td>
                    <td className="py-4 px-4 text-slate-400 text-sm">{item.peak}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Aucune donnée disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
}
