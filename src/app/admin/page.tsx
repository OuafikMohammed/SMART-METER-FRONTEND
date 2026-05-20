"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Radar from "@/components/react-bits/Radar/Radar";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Zap, TrendingDown, Clock, MousePointer2, AlertCircle, RotateCw, Users } from "lucide-react";
import CountUp from "react-countup";
import { useAuth } from "@/context/AuthContext";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import Link from "next/link";

interface DashboardData {
  totalConsumption: number;
  efficiency: number;
  activeResidents: number;
  foyersCount: number;
  consumptionData: Array<{
    date: string;
    value: number;
  }>;
  topConsumers: Array<{
    resident: string;
    consumption: number;
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
      const colors = ["#00D4FF", "#8B5CF6", "#F59E0B", "#10B981", "#EC4899"];
      
      setDashboardData({
        totalConsumption: adminData.total_consumption,
        efficiency: adminData.efficiency,
        activeResidents: adminData.active_residents,
        foyersCount: adminData.foyers_count,
        consumptionData: adminData.daily_consumption,
        topConsumers: adminData.top_consumers.map((c, i) => ({
          ...c,
          color: colors[i % colors.length]
        })),
      });
    }
  }, [adminData]);

  return (
    <div className="space-y-8 relative pb-10">
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
            <RotateCw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Chargement..." : "Réessayer"}
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-white tracking-tighter"
           >
            Dashboard <span className="text-brand-cyan">Administrateur</span>
           </motion.h1>
           <p className="text-slate-500 font-medium mt-1">Bienvenue {user?.fullName || 'Admin'}. Données temps réel extraites de la base de données.</p>
        </div>
        <div className="flex gap-3">
           <GlassCard className="px-4 py-2 flex items-center gap-3 border-emerald-500/10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Live Database Data</span>
           </GlassCard>
           <button 
              onClick={() => refetch()}
              className="px-4 py-2 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
           >
              <RotateCw className={`w-4 h-4 text-brand-cyan group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs font-bold text-white">Actualiser</span>
           </button>
        </div>
      </div>

      {loading && !dashboardData ? (
        <div className="flex flex-col justify-center items-center h-96 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan"></div>
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Extraction des données ORM...</p>
        </div>
      ) : dashboardData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: <Zap className="text-brand-cyan" />, 
                label: "Consommation Totale", 
                val: dashboardData.totalConsumption, 
                unit: "kWh", 
                trend: "Global", 
                color: "cyan",
                href: "/admin/analytics"
              },
              { 
                icon: <TrendingDown className="text-emerald-400" />, 
                label: "Efficacité (7j)", 
                val: dashboardData.efficiency, 
                unit: "%", 
                trend: dashboardData.efficiency >= 0 ? "Amélioration" : "Baisse", 
                color: "emerald",
                href: "/admin/analytics"
              },
              { 
                icon: <Users className="text-brand-violet" />, 
                label: "Résidents Actifs", 
                val: dashboardData.activeResidents, 
                unit: "", 
                trend: "En ligne", 
                color: "violet",
                href: "/admin/residents"
              },
              { 
                icon: <MousePointer2 className="text-amber-400" />, 
                label: "Nombre de Foyers", 
                val: dashboardData.foyersCount, 
                unit: "", 
                trend: "Configurés", 
                color: "amber",
                href: "/admin/nodes"
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={item.href}>
                  <GlassCard className="p-6 h-full flex flex-col justify-between border-white/5 hover:border-brand-cyan/20 hover:bg-white/10 transition-all cursor-pointer group/card">
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/card:border-brand-cyan/30 transition-colors">
                          {item.icon}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.trend === 'Baisse' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {item.trend}
                        </span>
                     </div>
                     <div>
                        <h4 className="text-3xl font-black text-white">
                          <CountUp end={item.val} decimals={item.label.includes('Consommation') || item.label.includes('Efficacité') ? 1 : 0} duration={2} />
                          {item.unit && <span className="text-lg text-slate-500 ml-1">{item.unit}</span>}
                        </h4>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{item.label}</p>
                     </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <GlassCard className="lg:col-span-2 p-8 min-h-[450px]">
               <div className="flex justify-between items-center mb-10">
                  <div>
                     <h3 className="text-lg font-bold text-white">Consommation des 7 Derniers Jours</h3>
                     <p className="text-xs text-slate-500 font-medium italic">Données agrégées par TruncDay() depuis le backend</p>
                  </div>
               </div>
               <div className="h-[300px] w-full">
                  {dashboardData.consumptionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={dashboardData.consumptionData}>
                          <defs>
                             <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke="#64748b" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(str) => {
                              const date = new Date(str);
                              return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                            }}
                          />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                             contentStyle={{ backgroundColor: "#141829", borderColor: "#ffffff10", color: "#fff", borderRadius: "12px", fontSize: "12px" }}
                             itemStyle={{ color: "#00D4FF" }}
                             labelStyle={{ color: "#64748b", marginBottom: "4px" }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            name="Consommation (kWh)"
                            stroke="#00D4FF" 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                            strokeWidth={3} 
                            animationDuration={2000} 
                          />
                       </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                      <Zap size={40} className="opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-widest">Aucune donnée disponible</p>
                      <p className="text-[10px]">Veuillez lancer 'python manage.py seed_all'</p>
                    </div>
                  )}
               </div>
            </GlassCard>

            <div className="space-y-8">
               <GlassCard className="p-8 h-full">
                  <h3 className="text-lg font-bold text-white mb-2">Top Consommateurs</h3>
                  <p className="text-xs text-slate-500 font-medium mb-8">Classement par consommation cumulée</p>
                  
                  <div className="space-y-8">
                     {dashboardData.topConsumers.length > 0 ? dashboardData.topConsumers.map((stat, i) => (
                       <div key={stat.resident} className="space-y-3">
                          <div className="flex justify-between items-end">
                             <div className="flex flex-col">
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Rang #{i+1}</span>
                               <span className="text-xs font-bold text-white truncate max-w-[150px]">{stat.resident}</span>
                             </div>
                             <span className="text-sm font-black text-white">{stat.consumption} <span className="text-[10px] text-slate-500">kWh</span></span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${Math.min(100, (stat.consumption / (dashboardData.topConsumers[0].consumption || 1)) * 100)}%` }}
                               transition={{ duration: 1.5, delay: i * 0.2 }}
                               className="h-full rounded-full shadow-[0_0_10px_currentColor]"
                               style={{ backgroundColor: stat.color, color: stat.color }}
                             />
                          </div>
                       </div>
                     )) : (
                        <div className="py-10 text-center space-y-4">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Aucun consommateur</p>
                        </div>
                     )}
                  </div>
               </GlassCard>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

