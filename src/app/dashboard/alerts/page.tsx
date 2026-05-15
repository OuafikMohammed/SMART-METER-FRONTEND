"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { AlertTriangle, CheckCircle, Clock, Bell, Trash2, Archive, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: "HAUTE" | "MOYENNE" | "BASSE";
  timestamp: string;
  resolvedAt?: string;
  statut: "active" | "resolved";
  icon: React.ComponentType<any>;
}

export default function AlertesPage() {
  const { token } = useAuth();
  const [selectedTab, setSelectedTab] = useState("active");
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [resolvedAlerts, setResolvedAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        // Fetch active alerts
        const activeRes = await fetch(`${baseUrl}/api/energy/alertes/?statut=active`, { headers });
        if (!activeRes.ok) throw new Error('Erreur lors du chargement des alertes actives');
        const activeData = activeRes.json().then((data: any) => {
          const results = data.results || data;
          return (Array.isArray(results) ? results : []).map((alert: any) => ({
            ...alert,
            icon: alert.severity === 'HAUTE' ? AlertTriangle : Clock,
          }));
        });

        // Fetch resolved alerts
        const resolvedRes = await fetch(`${baseUrl}/api/energy/alertes/?statut=resolved`, { headers });
        if (!resolvedRes.ok) throw new Error('Erreur lors du chargement des alertes résolues');
        const resolvedData = resolvedRes.json().then((data: any) => {
          const results = data.results || data;
          return (Array.isArray(results) ? results : []).map((alert: any) => ({
            ...alert,
            icon: CheckCircle,
          }));
        });

        const [active, resolved] = await Promise.all([activeData, resolvedData]);
        setActiveAlerts(active);
        setResolvedAlerts(resolved);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(message);
        console.error('Erreur fetch alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAlerts();
    }
  }, [token]);

  const handleDelete = async (alertId: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/energy/alertes/${alertId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
      setResolvedAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Erreur suppression alerte:', err);
    }
  };

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

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
        </div>
      ) : (
        <>
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
                            onClick={() => handleDelete(alert.id)}
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
              {resolvedAlerts.length > 0 ? (
                resolvedAlerts.map((alert, idx) => (
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
                          onClick={() => handleDelete(alert.id)}
                          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              ) : (
                <GlassCard className="p-8 text-center">
                  <p className="text-slate-400 font-medium">Aucune alerte résolue.</p>
                </GlassCard>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
