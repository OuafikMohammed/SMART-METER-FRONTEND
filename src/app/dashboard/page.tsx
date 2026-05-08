"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import GlassCard from "@/components/ui/GlassCard";
import { Zap, TrendingUp, AlertTriangle, Cpu } from "lucide-react";

export default function ResidentDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: "Consommation Actuelle", value: "2.4 kWh", icon: <Zap className="text-brand-cyan" />, change: "+12%" },
    { label: "Coût Estimé (Mois)", value: "450 DH", icon: <TrendingUp className="text-brand-violet" />, change: "-5%" },
    { label: "Appareils Actifs", value: "8", icon: <Cpu className="text-emerald-400" />, change: "Stable" },
    { label: "Alertes", value: "0", icon: <AlertTriangle className="text-amber-400" />, change: "0 nouvelles" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Bienvenue, <span className="text-brand-cyan">{user?.fullName || user?.username}</span>
        </h1>
        <p className="text-slate-500 mt-2">Voici un aperçu de votre consommation énergétique en temps réel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  {stat.icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-red-500/10 text-red-400' : 
                  stat.change.startsWith('-') ? 'bg-emerald-500/10 text-emerald-400' : 
                  'bg-white/5 text-slate-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8 min-h-[400px] flex items-center justify-center border-dashed border-white/10">
           <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                 <TrendingUp size={32} className="text-slate-700" />
              </div>
              <p className="text-slate-600 font-medium">Graphique de consommation en cours de développement...</p>
           </div>
        </GlassCard>

        <GlassCard className="p-8 border-brand-cyan/20 bg-brand-cyan/5">
           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap size={20} className="text-brand-cyan" />
              Conseil IA
           </h3>
           <div className="space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                "Votre consommation de pointe se situe entre 19h et 21h. Essayez de décaler l'utilisation de votre lave-linge après 22h pour réduire votre facture de 15%."
              </p>
              <div className="pt-4">
                 <button className="w-full py-3 rounded-xl bg-brand-cyan text-brand-dark font-bold text-sm hover:scale-[1.02] transition-transform">
                    Optimiser maintenant
                 </button>
              </div>
           </div>
        </GlassCard>
      </div>
    </div>
  );
}
