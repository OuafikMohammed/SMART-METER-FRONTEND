'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Clock } from 'lucide-react';

const analyticsData = [
  { time: '00:00', consumption: 1200, forecast: 1100 },
  { time: '04:00', consumption: 800, forecast: 900 },
  { time: '08:00', consumption: 3200, forecast: 3000 },
  { time: '12:00', consumption: 2800, forecast: 2600 },
  { time: '16:00', consumption: 4100, forecast: 4000 },
  { time: '20:00', consumption: 3500, forecast: 3400 },
  { time: '23:59', consumption: 1800, forecast: 1900 },
];

const topConsumers = [
  { id: 1, name: 'Foyer A-12', consumption: 450, percentage: 28 },
  { id: 2, name: 'Foyer B-45', consumption: 380, percentage: 24 },
  { id: 3, name: 'Foyer C-89', consumption: 320, percentage: 20 },
  { id: 4, name: 'Foyer D-23', consumption: 290, percentage: 18 },
  { id: 5, name: 'Foyer E-67', consumption: 160, percentage: 10 },
];

export default function AnalyticsPage() {
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Consommation', value: '1,598 kWh', trend: '+2.5%', icon: <Zap className="text-brand-cyan" /> },
          { label: 'Moyenne par Foyer', value: '315 kWh', trend: '-1.2%', icon: <TrendingDown className="text-emerald-400" /> },
          { label: 'Pic de Charge', value: '450 kW', trend: '+3.1%', icon: <TrendingUp className="text-amber-400" /> },
          { label: 'Économies Réalisées', value: '12.4%', trend: '+4.2%', icon: <Clock className="text-brand-violet" /> },
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
        </GlassCard>
      </motion.div>
    </div>
  );
}
