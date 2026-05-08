"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Calendar, Download, TrendingUp, Clock } from "lucide-react";

export default function ConsumptionHistory() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const historyData = [
    { date: "May 7, 2026", consumption: 45.2, cost: 135.6, peak: "19h-21h" },
    { date: "May 6, 2026", consumption: 38.5, cost: 115.5, peak: "20h-22h" },
    { date: "May 5, 2026", consumption: 52.1, cost: 156.3, peak: "18h-20h" },
    { date: "May 4, 2026", consumption: 41.3, cost: 123.9, peak: "19h-21h" },
    { date: "May 3, 2026", consumption: 48.7, cost: 146.1, peak: "21h-23h" },
    { date: "May 2, 2026", consumption: 44.2, cost: 132.6, peak: "19h-21h" },
  ];

  const periodStats = {
    week: { avg: 45.3, total: 316.9, peak: "20h-22h", saving: "12%" },
    month: { avg: 45.3, total: 1357, peak: "20h-22h", saving: "18%" },
    year: { avg: 42.8, total: 15641, peak: "19h-21h", saving: "25%" },
  };

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
            {historyData.map((item, idx) => (
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
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
