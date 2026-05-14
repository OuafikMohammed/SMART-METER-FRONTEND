"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Radar from "@/components/react-bits/Radar/Radar";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { Zap, TrendingDown, Clock, MousePointer2, AlertCircle } from "lucide-react";
import CountUp from "react-countup";
import { useAuth } from "@/context/AuthContext";
import { useSecureApi } from "@/hooks/useSecureApi";

interface DashboardData {
  peakLoad: number;
  efficiency: number;
  activeNodes: number;
  uptime: number;
  consumptionData: Array<{
    name: string;
    active: number;
    baseline: number;
  }>;
  neuralStats: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

export default function AdminPage() {
  const { token } = useAuth();
  const { secureFetch } = useSecureApi();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    peakLoad: 14.2,
    efficiency: 94.8,
    activeNodes: 128,
    uptime: 99.99,
    consumptionData: [],
    neuralStats: [
      { label: "Data Pipeline", value: 98, color: "#00D4FF" },
      { label: "Anomaly Accuracy", value: 99.4, color: "#8B5CF6" },
      { label: "Predictive Confidence", value: 92, color: "#F59E0B" },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    peakLoadTrend: "-2.4%",
    efficiencyTrend: "+1.2%",
    nodesTrend: "+4",
    uptimeTrend: "0.00%",
  });
  const [retryCount, setRetryCount] = useState(0);

  const getErrorMessage = (err: unknown, statusCode?: number): string => {
    if (!token) {
      return "Veuillez vous connecter pour accéder à cette page.";
    }
    
    if (statusCode === 401) {
      return "Votre session a expiré. Veuillez vous reconnecter.";
    }
    
    if (statusCode === 403) {
      return "Vous n'avez pas les permissions pour accéder à ces données.";
    }
    
    if (statusCode === 404) {
      return "Endpoint API non trouvé. Vérifiez la configuration du serveur.";
    }
    
    if (err instanceof Error && (err.message.includes("Failed to fetch") || err.message.includes("fetch failed") || err.message.includes("NetworkError"))) {
      return "Impossible de se connecter au serveur. Assurez-vous que le backend est en cours d'exécution.";
    }
    
    // Also catch plain TypeError without message checking just in case
    if (err instanceof TypeError) {
      return "Impossible de se connecter au serveur. Assurez-vous que le backend est en cours d'exécution.";
    }
    
    if (err instanceof SyntaxError) {
      return "Erreur de format de réponse du serveur.";
    }
    
    return err instanceof Error ? err.message : 'Erreur inconnue lors du chargement des données.';
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setError("Veuillez vous connecter pour accéder à cette page.");
          setLoading(false);
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          const dashboardRes = await secureFetch(`${baseUrl}/api/admin/dashboard/`, { 
            signal: controller.signal 
          });
          clearTimeout(timeoutId);

          const data = await dashboardRes.json();
          
          // Map API response to UI data
          const totalResidents = data.total_residents || 0;
          const totalConsumptionKwh = parseFloat(data.total_consumption_kwh || '0');
          const totalCostEstimate = parseFloat(data.total_cost_estimate || '0');
          const avgConsumption = parseFloat(data.average_consumption_per_resident || '0');
          
          // Calculate consumption data points from daily breakdown
          const consumptionData = (data.consumption_by_day || []).map((day: any) => ({
            date: day.date,
            kWh: parseFloat(day.total_consumption_kwh),
          })).slice(0, 7); // Last 7 days
          
          setDashboardData({
            peakLoad: totalConsumptionKwh,
            efficiency: Math.min(100, (avgConsumption / 20) * 100), // Normalized to percentage
            activeNodes: totalResidents,
            uptime: 99.9,
            consumptionData: consumptionData,
            neuralStats: [
              { label: "Total Residents", value: totalResidents * 10, color: "#00D4FF" },
              { label: "Avg Consumption", value: Math.round(avgConsumption), color: "#8B5CF6" },
              { label: "Total Cost", value: Math.round(totalCostEstimate), color: "#F59E0B" },
            ],
          });

          setStats({
            peakLoadTrend: "+0%",
            efficiencyTrend: "+0%",
            nodesTrend: `+${totalResidents}`,
            uptimeTrend: "99.9%",
          });
          setRetryCount(0);
        } catch (fetchErr) {
          clearTimeout(timeoutId);
          
          if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
            throw new Error('Délai d\'attente dépassé. Le serveur met trop de temps à répondre.');
          }
          throw fetchErr;
        }
      } catch (err) {
        const statusCode = (err as any)?.status || null;
        const message = getErrorMessage(err, statusCode);
        setError(message);
        // console.error removed
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token, secureFetch]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    
    // Trigger fetch by re-running effect
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setError("Veuillez vous connecter pour accéder à cette page.");
          setLoading(false);
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          const dashboardRes = await secureFetch(`${baseUrl}/api/admin/dashboard/`, { 
            signal: controller.signal 
          });
          clearTimeout(timeoutId);

          const data = await dashboardRes.json();
          
          const totalResidents = data.total_residents || 0;
          const totalConsumptionKwh = parseFloat(data.total_consumption_kwh || '0');
          const totalCostEstimate = parseFloat(data.total_cost_estimate || '0');
          const avgConsumption = parseFloat(data.average_consumption_per_resident || '0');
          
          const consumptionData = (data.consumption_by_day || []).map((day: any) => ({
            date: day.date,
            kWh: parseFloat(day.total_consumption_kwh),
          })).slice(0, 7);
          
          setDashboardData({
            peakLoad: totalConsumptionKwh,
            efficiency: Math.min(100, (avgConsumption / 20) * 100),
            activeNodes: totalResidents,
            uptime: 99.9,
            consumptionData: consumptionData,
            neuralStats: [
              { label: "Total Residents", value: totalResidents * 10, color: "#00D4FF" },
              { label: "Avg Consumption", value: Math.round(avgConsumption), color: "#8B5CF6" },
              { label: "Total Cost", value: Math.round(totalCostEstimate), color: "#F59E0B" },
            ],
          });

          setStats({
            peakLoadTrend: "+0%",
            efficiencyTrend: "+0%",
            nodesTrend: `+${totalResidents}`,
            uptimeTrend: "99.9%",
          });
          setRetryCount(0);
        } catch (fetchErr) {
          clearTimeout(timeoutId);
          
          if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
            throw new Error('Délai d\'attente dépassé. Le serveur met trop de temps à répondre.');
          }
          throw fetchErr;
        }
      } catch (err) {
        const statusCode = (err as any)?.status || null;
        const message = getErrorMessage(err, statusCode);
        setError(message);
        // console.error removed
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchDashboard();
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Background Radar */}
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
            onClick={handleRetry}
            disabled={loading}
            className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 text-red-400 rounded border border-red-500/30 transition-colors"
          >
            {loading ? "Chargement..." : "Réessayer"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
        </div>
      ) : (
        <>
          {/* Top Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
               <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-black text-white tracking-tighter"
               >
                System <span className="text-brand-cyan">Overview</span>
               </motion.h1>
               <p className="text-slate-500 font-medium mt-1">Status: All systems operational. Neural engine at 98.4%.</p>
            </div>
            <div className="flex gap-3">
               <GlassCard className="px-4 py-2 flex items-center gap-3 border-emerald-500/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span className="text-xs font-bold text-white">Live Node A-12</span>
               </GlassCard>
               <GlassCard className="px-4 py-2 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-white">Last Sync: 2m ago</span>
               </GlassCard>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Zap className="text-brand-cyan" />, label: "Peak Load", val: dashboardData.peakLoad.toFixed(1), unit: "kW", trend: stats.peakLoadTrend, color: "cyan" },
              { icon: <TrendingDown className="text-emerald-400" />, label: "Efficiency", val: dashboardData.efficiency.toFixed(1), unit: "%", trend: stats.efficiencyTrend, color: "emerald text-emerald-400" },
              { icon: <MousePointer2 className="text-brand-violet" />, label: "Active Nodes", val: dashboardData.activeNodes.toString(), unit: "", trend: stats.nodesTrend, color: "violet" },
              { icon: <Clock className="text-amber-400" />, label: "System Uptime", val: dashboardData.uptime.toFixed(2), unit: "%", trend: stats.uptimeTrend, color: "amber" },
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
                        <CountUp end={parseFloat(item.val)} decimals={item.val.includes('.') ? 2 : 0} duration={2} />
                        {item.unit && <span className="text-lg text-slate-500 ml-1">{item.unit}</span>}
                      </h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{item.label}</p>
                   </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Large Chart */}
            <GlassCard className="lg:col-span-2 p-8 min-h-[450px]">
               <div className="flex justify-between items-center mb-10">
                  <div>
                     <h3 className="text-lg font-bold text-white">Consumption Trends</h3>
                     <p className="text-xs text-slate-500 font-medium">Monitoring active load vs baseline forecast</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                       <div className="w-2 h-2 rounded-full bg-brand-cyan" />
                       Active Load
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                       <div className="w-2 h-2 rounded-full bg-white/20" />
                       Baseline
                     </div>
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
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                             contentStyle={{ backgroundColor: "#141829", borderColor: "#ffffff05", color: "#fff", borderRadius: "12px", fontSize: "12px" }}
                             itemStyle={{ color: "#00D4FF" }}
                          />
                          <Area type="monotone" dataKey="baseline" stroke="#ffffff20" fillOpacity={1} fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                          <Area type="monotone" dataKey="active" stroke="#00D4FF" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} animationDuration={2000} />
                       </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      Aucune donnée disponible
                    </div>
                  )}
               </div>
            </GlassCard>

            {/* Sidebar Info - Neural Engine Stats */}
            <div className="space-y-8">
               <GlassCard className="p-8 h-full">
                  <h3 className="text-lg font-bold text-white mb-8">Neural Engine Status</h3>
                  <div className="space-y-8">
                     {dashboardData.neuralStats.map((stat, i) => (
                       <div key={stat.label} className="space-y-3">
                          <div className="flex justify-between items-end">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                             <span className="text-sm font-black text-white">{stat.value}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${stat.value}%` }}
                               transition={{ duration: 1.5, delay: i * 0.2 }}
                               className="h-full rounded-full shadow-[0_0_10px_currentColor]"
                               style={{ backgroundColor: stat.color, color: stat.color }}
                             />
                          </div>
                       </div>
                     ))}
                     
                     <div className="pt-8 mt-8 border-t border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Neural Activity</p>
                        <div className="flex items-end gap-1 h-12">
                           {[0.2, 0.5, 0.8, 0.4, 0.7, 0.9, 0.3, 0.6, 0.8, 0.5, 0.7, 0.4].map((h, i) => (
                             <motion.div 
                               key={i}
                               animate={{ height: [`${h*100}%`, `${(h*1.2)*100}%`, `${h*100}%`] }}
                               transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
                               className="flex-1 bg-brand-cyan/20 rounded-sm"
                             />
                           ))}
                        </div>
                     </div>
                  </div>
               </GlassCard>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
