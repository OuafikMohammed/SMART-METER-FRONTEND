"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { AlertTriangle, CheckCircle, Clock, Bell, Trash2, Archive } from "lucide-react";

export default function AlertesPage() {
  const [selectedTab, setSelectedTab] = useState("active");

  const activeAlerts = [
    {
      id: 1,
      title: "Consommation Anormale Détectée",
      description: "Votre consommation a dépassé 120% de la baseline. Vérifiez vos appareils actifs.",
      severity: "HAUTE",
      timestamp: "2 heures",
      icon: AlertTriangle,
    },
    {
      id: 2,
      title: "Heures de Pointe Actives",
      description: "Vous êtes actuellement dans la période tarifaire de pointe (19h-21h).",
      severity: "MOYENNE",
      timestamp: "15 minutes",
      icon: Clock,
    },
  ];

  const resolvedAlerts = [
    {
      id: 3,
      title: "Consommation Retournée à la Normale",
      description: "La consommation est revenue aux niveaux attendus.",
      severity: "BASSE",
      timestamp: "4 heures",
      resolvedAt: "2026-05-07 19:30",
      icon: CheckCircle,
    },
    {
      id: 4,
      title: "Appareil Consommant Trop Détecté",
      description: "Le lave-linge consomme plus que la normale.",
      severity: "MOYENNE",
      timestamp: "1 jour",
      resolvedAt: "2026-05-06 22:15",
      icon: CheckCircle,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HAUTE":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "MOYENNE":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "BASSE":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Mes <span className="text-brand-cyan">Alertes</span>
        </h1>
        <p className="text-slate-500 mt-2">Gestion des anomalies et notifications concernant votre consommation.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <motion.button
          onClick={() => setSelectedTab("active")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            selectedTab === "active"
              ? "bg-brand-cyan text-brand-dark"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
        >
          <Bell size={18} />
          Actives ({activeAlerts.length})
        </motion.button>
        <motion.button
          onClick={() => setSelectedTab("resolved")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            selectedTab === "resolved"
              ? "bg-brand-cyan text-brand-dark"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
        >
          <CheckCircle size={18} />
          Résolues ({resolvedAlerts.length})
        </motion.button>
      </div>

      {/* Active Alerts */}
      {selectedTab === "active" && (
        <div className="space-y-4">
          {activeAlerts.length > 0 ? (
            activeAlerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className={`p-6 border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 flex-1">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${getSeverityColor(alert.severity)}`}>
                        <alert.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">{alert.title}</h3>
                        <p className="text-slate-400 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className="text-xs text-slate-500">{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-brand-cyan/20 hover:text-brand-cyan transition-all"
                      >
                        <Archive size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          ) : (
            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <p className="text-slate-400 font-medium">Aucune alerte active. Votre consommation est normale.</p>
            </GlassCard>
          )}
        </div>
      )}

      {/* Resolved Alerts */}
      {selectedTab === "resolved" && (
        <div className="space-y-4">
          {resolvedAlerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="p-6 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 flex-1">
                    <div className="p-3 rounded-xl bg-emerald-500/10 flex-shrink-0">
                      <alert.icon size={24} className="text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{alert.title}</h3>
                      <p className="text-slate-400 mt-1">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Résolu
                        </span>
                        <span className="text-xs text-slate-500">{alert.resolvedAt}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
