'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

interface AnalyticsDataPoint {
  time: string;
  consumption: number;
  forecast: number;
}

interface TopConsumer {
  id: number;
  name: string;
  consumption: number;
  percentage: number;
}

export default function AnalyticsPage() {
  const { token } = useAuth();
  const { data: adminData, loading, error } = useAdminDashboard();
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [topConsumers, setTopConsumers] = useState<TopConsumer[]>([]);
  const [stats, setStats] = useState({
    totalConsumption: '0 kWh',
    avgPerFoyer: '0 kWh',
    peakLoad: '0 kW',
    savings: '0%',
    consumptionTrend: '+0%',
    avgTrend: '0%',
    peakTrend: '+0%',
    savingsTrend: '+0%',
  });

  useEffect(() => {
    if (adminData) {
      // Format consumption data for chart (daily consumption for last 7 days)
      const formattedConsumption = adminData.daily_consumption.map((item: any) => ({
        time: new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        consumption: item.value,
        forecast: item.value * 1.05 // Mock forecast based on real data
      }));
      setAnalyticsData(formattedConsumption);

      // Format top consumers
      const consumers = adminData.top_consumers.map((c: any, i: number) => ({
        id: i,
        name: c.resident,
        consumption: c.consumption,
        percentage: (c.consumption / (adminData.top_consumers[0]?.consumption || 1)) * 100
      }));
      setTopConsumers(consumers);

      // Update stats
      const peak = Math.max(...adminData.daily_consumption.map((d: any) => d.value), 0);
      setStats({
        totalConsumption: `${adminData.total_consumption.toLocaleString()} kWh`,
        avgPerFoyer: `${(adminData.total_consumption / (adminData.foyers_count || 1)).toFixed(1)} kWh`,
        peakLoad: `${peak.toFixed(1)} kWh`,
        savings: `${adminData.efficiency}%`,
        consumptionTrend: adminData.efficiency >= 0 ? `+${adminData.efficiency}%` : `${adminData.efficiency}%`,
        avgTrend: '+2%',
        peakTrend: '+5%',
        savingsTrend: '+10%',
      });
    }
  }, [adminData]);
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black text-white tracking-tighter"
        >
          Consommations <span className="text-brand-cyan">Analytics</span>
        </motion.h1>
        <p className="text-slate-500 font-medium mt-1">Analyse détaillée de la consommation énergétique</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Consommation', value: stats.totalConsumption, trend: stats.consumptionTrend, icon: <Zap className="text-brand-cyan" /> },
              { label: 'Moyenne par Foyer', value: stats.avgPerFoyer, trend: stats.avgTrend, icon: <TrendingDown className="text-emerald-400" /> },
              { label: 'Pic de Charge', value: stats.peakLoad, trend: stats.peakTrend, icon: <TrendingUp className="text-amber-400" /> },
              { label: 'Économies Réalisées', value: stats.savings, trend: stats.savingsTrend, icon: <Clock className="text-brand-violet" /> },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{stat.trend}</span>
                  </div>
                  <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Consumption Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-6">
                <h3 className="text-white font-bold mb-6">Tendance de Consommation (24h)</h3>
                {analyticsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData}>
                      <defs>
                        <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="time" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="consumption"
                        stroke="#00D4FF"
                        fillOpacity={1}
                        fill="url(#colorConsumption)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-slate-400">
                    Aucune donnée disponible
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Top Consumers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6 h-full">
                <h3 className="text-white font-bold mb-6">Top Consommateurs</h3>
                {topConsumers.length > 0 ? (
                  <div className="space-y-3">
                    {topConsumers.map((consumer) => (
                      <div key={consumer.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{consumer.name}</p>
                          <div className="w-full bg-white/5 rounded-full h-2 mt-1">
                            <div
                              className="bg-brand-cyan h-2 rounded-full"
                              style={{ width: `${consumer.percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 ml-2">{consumer.consumption} kWh</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">Aucun consommateur disponible</p>
                )}
              </GlassCard>
            </motion.div>
          </div>

          {/* Consumption by Time of Day */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-white font-bold mb-6">Consommation vs Prévisions</h3>
              {analyticsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="consumption" fill="#00D4FF" />
                    <Bar dataKey="forecast" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-slate-400">
                  Aucune donnée disponible
                </div>
              )}
            </GlassCard>
          </motion.div>
        </>
      )}
    </div>
  )
}
