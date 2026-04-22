"use client";

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import CountUp from "react-countup";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Zap, Activity, TrendingUp, AlertTriangle } from "lucide-react";

const data = [
  { time: "00:00", value: 30 },
  { time: "04:00", value: 25 },
  { time: "08:00", value: 45 },
  { time: "12:00", value: 65 },
  { time: "16:00", value: 55 },
  { time: "20:00", value: 80 },
  { time: "23:59", value: 40 },
];

const barData = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 600 },
  { name: "Thu", value: 800 },
  { name: "Fri", value: 500 },
  { name: "Sat", value: 200 },
  { name: "Sun", value: 150 },
];

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-24 relative overflow-hidden bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
          >
            Precision <span className="text-brand-cyan relative inline-block">
              Analytics
              <motion.span 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-1 left-0 h-2 bg-brand-cyan/20 -z-10"
              />
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Experience energy data like never before. Our immersive dashboard 
            brings real-time insights to your fingertips with cinematic clarity.
          </motion.p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Chart */}
          <GlassCard className="col-span-12 lg:col-span-8 p-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-cyan" />
                  Live Energy Consumption
                </h3>
                <p className="text-sm text-slate-500">Real-time load monitoring (kWh)</p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-xs text-brand-cyan font-bold">
                  Active
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#141829", borderColor: "#ffffff10", borderRadius: "12px", color: "#fff" }}
                    itemStyle={{ color: "#00D4FF" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00D4FF" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    strokeWidth={3}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Right Column KPIs */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-brand-cyan fill-brand-cyan" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Savings</p>
                  <h4 className="text-3xl font-black text-white">
                    $<CountUp end={1284.50} duration={3} decimals={2} />
                  </h4>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                +14.2% from last month
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-violet/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-brand-violet fill-brand-violet" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Anomalies Detected</p>
                  <h4 className="text-3xl font-black text-white">
                    <CountUp end={3} duration={4} />
                  </h4>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-violet">
                 Potential issues found in Zone B
              </div>
            </GlassCard>

            <GlassCard className="p-6 h-[168px] overflow-hidden">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Activity Heatmap</p>
               <div className="opacity-50 hover:opacity-100 transition-opacity">
                  <CalendarHeatmap
                    startDate={new Date('2023-12-01')}
                    endDate={new Date('2024-03-30')}
                    values={[
                      { date: '2024-01-01', count: 12 },
                      { date: '2024-01-22', count: 122 },
                      { date: '2024-01-30', count: 38 },
                      // ... more data
                    ]}
                    classForValue={(value: any) => {
                      if (!value) return 'color-empty';
                      return `color-scale-${value.count > 50 ? 'large' : 'small'}`;
                    }}
                  />
               </div>
            </GlassCard>
          </div>

          {/* Bottom Bar Chart */}
          <GlassCard className="col-span-12 p-8 h-[350px]">
             <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Weekly Consumption Breakdown</h3>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-brand-cyan" />
                      HVAC
                   </div>
                   <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-brand-violet" />
                      Lighting
                   </div>
                </div>
             </div>
             <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                       cursor={{ fill: '#ffffff05' }}
                       contentStyle={{ backgroundColor: "#141829", border: "none", borderRadius: "8px" }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1500}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#00D4FF" : "#8B5CF6"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </GlassCard>
        </div>
      </div>

      <style jsx global>{`
        .react-calendar-heatmap .color-empty { fill: rgba(255, 255, 255, 0.05); }
        .react-calendar-heatmap .color-scale-small { fill: rgba(0, 212, 255, 0.3); }
        .react-calendar-heatmap .color-scale-large { fill: rgba(0, 212, 255, 0.8); }
        .react-calendar-heatmap rect { rx: 2px; ry: 2px; }
      `}</style>
    </section>
  );
};

export default DashboardPreview;
