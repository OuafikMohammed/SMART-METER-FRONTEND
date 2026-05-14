"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Radar from "@/components/react-bits/Radar/Radar";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Zap, TrendingDown, Clock, MousePointer2, AlertCircle, RotateCw } from "lucide-react";
import CountUp from "react-countup";
import { useAuth } from "@/context/AuthContext";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

interface DashboardData {
  peakLoad: number;
  efficiency: number;
  activeNodes: number;
  uptime: number;
  consumptionData: Array<{
    date: string;
    kWh: number;
  }>;
  neuralStats: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

export default function AdminPage() {
  const { user } = useAuth();
  const { data: adminData, loading, error, refetch } = useAdminDashboard();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Transform API data to UI format
  useEffect(() => {
    if (adminData) {
      const totalConsumptionKwh = adminData.total_consumption_kwh || 0;
      const avgConsumption = adminData.average_consumption_per_resident || 0;
      const totalCost = adminData.total_cost_estimate || 0;
      const totalResidents = adminData.total_residents || 0;

      const consumptionData = (adminData.consumption_by_day || [])
        .map((day) => ({
          date: new Date(day.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
          kWh: day.total_consumption_kwh,
        }))
        .slice(-7);

      setDashboardData({
        peakLoad: totalConsumptionKwh,
        efficiency: Math.min(100, totalResidents > 0 ? (avgConsumption / 20) * 100 : 0),
        activeNodes: totalResidents,
        uptime: 99.9,
        consumptionData,
        neuralStats: [
          { label: "Résidents", value: totalResidents * 10, color: "#00D4FF" },
          { label: "Conso (kWh)", value: Math.round(avgConsumption * 10) / 10, color: "#8B5CF6" },
          { label: "Coût (DH)", value: Math.round(totalCost), color: "#F59E0B" },
        ],
      });
    }
  }, [adminData]);

  if (!dashboardData && !loading) {
    setDashboardData({
      peakLoad: 0,
      efficiency: 0,
      activeNodes: 0,
      uptime: 99.9,
      consumptionData: [],
      neuralStats: [
        { label: "Résidents", value: 0, color: "#00D4FF" },
        { label: "Conso (kWh)", value: 0, color: "#8B5CF6" },
        { label: "Coût (DH)", value: 0, color: "#F59E0B" },
      ],
    });
  }

  return (
    <div className="space-y-8 relative">
      <div className="fixed inset-0 pointer-events-none opacity-40 -z-10 bg-brand-dark">
        <Radar 
            speed={0.1} 
            color="#00D4FF" 
            backgroundColor="transparent"
            brightness={1.5}
            scale={0.7}
        />
      </div>

      {error && (
        <div className="flex items-center justify-between gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-400" size={20} />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 text-red-400 rounded border border-red-500/30 transition-colors flex items-center gap-1"
          >
            <RotateCw size={14} />
            {loading ? "Chargement..." : "Réessayer"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
        </div>
      ) : dashboardData ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
               <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-black text-white tracking-tighter"
               >
                Dashboard <span className="text-brand-cyan">Administrateur</span>
               </motion.h1>
               <p className="text-slate-500 font-medium mt-1">Bienvenue {user?.fullName || 'Admin'}. Vue d'ensemble des résidents managés.</p>
            </div>
            <div className="flex gap-3">
               <GlassCard className="px-4 py-2 flex items-center gap-3 border-emerald-500/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span className="text-xs font-bold text-white">Système Opérationnel</span>
               </GlassCard>
               <GlassCard className="px-4 py-2 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-white">À jour</span>
               </GlassCard>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Zap className="text-brand-cyan" />, label: "Consommation Totale", val: dashboardData.peakLoad.toFixed(1), unit: "kWh", trend: "+2.4%", color: "cyan" },
              { icon: <TrendingDown className="text-emerald-400" />, label: "Efficacité", val: dashboardData.efficiency.toFixed(1), unit: "%", trend: "+1.2%", color: "emerald text-emerald-400" },
              { icon: <MousePointer2 className="text-brand-violet" />, label: "Résidents Actifs", val: dashboardData.activeNodes.toString(), unit: "", trend: `+${dashboardData.activeNodes}`, color: "violet" },
              { icon: <Clock className="text-amber-400" />, label: "Disponibilité", val: dashboardData.uptime.toFixed(2), unit: "%", trend: "Stable", color: "amber" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-6 h-full flex flex-col justify-between">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${item.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.trend}
                      </span>
                   </div>
                   <div>
                      <h4 className="text-3xl font-black text-white">
                        <CountUp end={parseFloat(item.val)} decimals={item.val.includes('.') ? 1 : 0} duration={2} />
                        {item.unit && <span className="text-lg text-slate-500 ml-1">{item.unit}</span>}
                      </h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{item.label}</p>
                   </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <GlassCard className="lg:col-span-2 p-8 min-h-[450px]">
               <div className="flex justify-between items-center mb-10">
                  <div>
                     <h3 className="text-lg font-bold text-white">Tendances de Consommation</h3>
                     <p className="text-xs text-slate-500 font-medium">Consommation totale sur 7 derniers jours</p>
                  </div>
               </div>
               <div className="h-[300px] w-full">
                  {dashboardData.consumptionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={dashboardData.consumptionData}>
                          <defs>
                             <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                             contentStyle={{ backgroundColor: "#141829", borderColor: "#ffffff05", color: "#fff", borderRadius: "12px", fontSize: "12px" }}
                             itemStyle={{ color: "#00D4FF" }}
                          />
                          <Area type="monotone" dataKey="kWh" stroke="#00D4FF" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} animationDuration={2000} />
                       </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      Aucune donnée disponible
                    </div>
                  )}
               </div>
            </GlassCard>

            <div className="space-y-8">
               <GlassCard className="p-8 h-full">
                  <h3 className="text-lg font-bold text-white mb-8">Statistiques</h3>
                  <div className="space-y-8">
                     {dashboardData.neuralStats.map((stat, i) => (
                       <div key={stat.label} className="space-y-3">
                          <div className="flex justify-between items-end">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                             <span className="text-sm font-black text-white">{stat.value}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${Math.min(100, (stat.value / 100) * 100)}%` }}
                               transition={{ duration: 1.5, delay: i * 0.2 }}
                               className="h-full rounded-full shadow-[0_0_10px_currentColor]"
                               style={{ backgroundColor: stat.color, color: stat.color }}
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </GlassCard>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
