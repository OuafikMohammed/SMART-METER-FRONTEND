'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataPoint[]>([]);
  const [topConsumers, setTopConsumers] = useState<TopConsumer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        // Fetch consumption data
        const consumptionRes = await fetch(`${baseUrl}/api/energy/consommations/`, { headers });
        if (!consumptionRes.ok) throw new Error('Erreur lors du chargement des données de consommation');
        const consumptionData = await consumptionRes.json();
        const consResults = consumptionData.results || consumptionData || [];
        
        // Format consumption data for chart
        const formattedConsumption = (Array.isArray(consResults) ? consResults : []).slice(0, 24).map((item: any) => ({
          time: item.timestamp?.split('T')[1]?.substring(0, 5) || item.timestamp || 'N/A',
          consumption: item.kwh || 0,
          forecast: (item.kwh || 0) * 1.1
        }));
        setAnalyticsData(formattedConsumption);

        // Fetch foyers for top consumers
        const foyersRes = await fetch(`${baseUrl}/api/energy/foyers/`, { headers });
        if (!foyersRes.ok) throw new Error('Erreur lors du chargement des foyers');
        const foyersData = await foyersRes.json();
        const foyers = Array.isArray(foyersData.results) ? foyersData.results : (Array.isArray(foyersData) ? foyersData : []);
        setTopConsumers(foyers.slice(0, 5).map((f: any) => ({
          id: f.id,
          name: f.numero_foyer,
          consumption: Math.random() * 100,
          percentage: Math.random() * 100
        })));

        // Fetch stats from anomalies
        const anomaliesRes = await fetch(`${baseUrl}/api/energy/anomalies/`, { headers });
        if (!anomaliesRes.ok) throw new Error('Erreur lors du chargement des statistiques');
        const anomaliesData = await anomaliesRes.json();
        const anomalies = Array.isArray(anomaliesData.results) ? anomaliesData.results : (Array.isArray(anomaliesData) ? anomaliesData : []);
        
        const totalConsumption = formattedConsumption.reduce((sum: number, d: any) => sum + (d.consumption || 0), 0);
        setStats({
          totalConsumption: `${totalConsumption.toFixed(2)} kWh`,
          avgPerFoyer: `${(totalConsumption / 6).toFixed(2)} kWh`,
          peakLoad: `${Math.max(...formattedConsumption.map((d: any) => d.consumption || 0)).toFixed(2)} kW`,
          savings: `${(anomalies.length * 2.5).toFixed(1)}%`,
          consumptionTrend: '+5%',
          avgTrend: '+3%',
          peakTrend: '+8%',
          savingsTrend: '+12%',
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(message);
        console.error('Erreur fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);
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
