"use client";

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Orb from "@/components/react-bits/Orb/Orb";
import { AlertCircle, ShieldAlert, CheckCircle2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const anomalies = [
  { id: "AN-1042", source: "HVAC System - North Wing", type: "Sudden Load Spike", severity: "high", time: "10:24 AM" },
  { id: "AN-1041", source: "Lighting Grid - Floor 4", type: "Voltage Fluctuations", severity: "medium", time: "09:15 AM" },
  { id: "AN-1040", source: "Elevator B-2", type: "Motor Overheat", severity: "low", time: "08:42 AM" },
  { id: "AN-1039", source: "Main Transformer", type: "Frequency Deviation", severity: "high", time: "07:30 AM" },
];

const AnomalySection = () => {
  return (
    <section id="anomalies" className="py-24 relative overflow-hidden bg-brand-dark min-h-screen flex flex-col justify-center">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={200}
          forceHoverState={false}
        />
        <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4">
             <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6"
              >
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Real-time Detection</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
              >
                Zero-Latency <br />
                <span className="text-red-500 italic relative inline-block">
                  Anomaly
                  <motion.span 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="absolute bottom-1 left-0 h-2 bg-red-500/20 -z-10"
                  />
                </span> Intelligence
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-lg mb-8"
              >
                Our neural engine monitors billions of data points to identify irregularities 
                before they become critical failures.
              </motion.p>

              <div className="flex gap-12">
                 <div>
                    <h4 className="text-3xl font-black text-white">0.4s</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase">Detection Time</p>
                 </div>
                 <div>
                    <h4 className="text-3xl font-black text-white">100%</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase">Neural Coverage</p>
                 </div>
              </div>
          </div>

          <div className="lg:col-span-8">
            <GlassCard className="p-0 overflow-hidden border-white/5">
               <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <h3 className="font-bold text-white flex items-center gap-2">
                     <AlertCircle className="w-5 h-5 text-red-500" />
                     Live Anomalies
                  </h3>
                  <div className="h-6 w-32 bg-white/5 rounded-full flex items-center px-1">
                     <div className="h-4 w-1/2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/[0.02]">
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Source</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Severity</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {anomalies.map((anomaly, i) => (
                        <motion.tr 
                          key={anomaly.id}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="group hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-xs text-brand-cyan">{anomaly.id}</td>
                          <td className="px-6 py-4">
                             <div className="text-sm font-bold text-white">{anomaly.source}</div>
                             <div className="text-[10px] text-slate-500 italic">{anomaly.type}</div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2 text-xs text-slate-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                Analyzing
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest inline-block border",
                                anomaly.severity === "high" ? "bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]" :
                                anomaly.severity === "medium" ? "bg-amber-500/20 text-amber-500 border-amber-500/30" :
                                "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                             )}>
                                {anomaly.severity}
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <MoreHorizontal className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors ml-auto cursor-pointer" />
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
               </div>
               <div className="p-4 text-center bg-white/[0.02] border-t border-white/5">
                  <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
                    View Full Intelligence Log
                  </button>
               </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnomalySection;
