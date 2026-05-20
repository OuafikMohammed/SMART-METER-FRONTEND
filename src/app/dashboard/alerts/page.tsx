"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { AlertTriangle, CheckCircle, Clock, Bell, Trash2, Archive, AlertCircle, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { residentApi } from "@/lib/api";

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
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertToDelete, setAlertToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) return;

        // Fetch active alerts
        const activeRes = await residentApi.getAlerts(token, 'new');
        if (activeRes.error) throw new Error(activeRes.error);
        const active = (activeRes.data?.results || []).map((alert: any) => ({
          id: alert.id,
          title: `Alerte ${alert.anomalie?.severite || 'Détectée'}`,
          description: `Une anomalie de type ${alert.anomalie?.severite || 'inconnue'} a été détectée sur votre consommation.`,
          severity: alert.anomalie?.severite || "MOYENNE",
          timestamp: new Date(alert.created_at).toLocaleString('fr-FR'),
          statut: "active",
          icon: alert.anomalie?.severite === 'HAUTE' ? AlertTriangle : Clock,
        }));

        // Fetch resolved alerts
        const resolvedRes = await residentApi.getAlerts(token, 'acknowledged');
        if (resolvedRes.error) throw new Error(resolvedRes.error);
        const resolved = (resolvedRes.data?.results || []).map((alert: any) => ({
          id: alert.id,
          title: `Alerte Résolue`,
          description: `L'anomalie sur votre foyer a été traitée.`,
          severity: alert.anomalie?.severite || "BASSE",
          timestamp: new Date(alert.created_at).toLocaleString('fr-FR'),
          resolvedAt: alert.acquittee_at ? new Date(alert.acquittee_at).toLocaleString('fr-FR') : 'Récemment',
          statut: "resolved",
          icon: CheckCircle,
        }));


        setActiveAlerts(active);
        setResolvedAlerts(resolved);
        setAiAnalysis(activeRes.data?.ai_analysis || null);
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
      if (!token) return;
      
      const res = await residentApi.deleteAlert(token, alertId);
      if (res.error) throw new Error(res.error);
      
      setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
      setResolvedAlerts(prev => prev.filter(a => a.id !== alertId));
      setAlertToDelete(null);
    } catch (err) {
      console.error('Erreur suppression alerte:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const handleArchive = async (alertId: number) => {
    try {
      if (!token) return;
      
      const res = await residentApi.acquitAlert(token, alertId);
      if (res.error) throw new Error(res.error);
      
      // Move from active to resolved
      const archivedAlert = activeAlerts.find(a => a.id === alertId);
      if (archivedAlert) {
        setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
        setResolvedAlerts(prev => [
          {
            ...archivedAlert,
            statut: "resolved" as const,
            icon: CheckCircle,
            resolvedAt: new Date().toLocaleString('fr-FR')
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error('Erreur archivage alerte:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'archivage');
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

      {/* AI Analysis */}
      {aiAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6 border-amber-500/20 bg-amber-500/5">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-400" />
              Analyse IA des Anomalies
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {aiAnalysis}
            </p>
          </GlassCard>
        </motion.div>
      )}

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
                            onClick={() => handleArchive(alert.id)}
                            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-brand-cyan/20 hover:text-brand-cyan transition-all"
                          >
                            <Archive size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setAlertToDelete(alert.id)}
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
                          onClick={() => setAlertToDelete(alert.id)}
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
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {alertToDelete !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <GlassCard className="p-8 border-red-500/20">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                    <Trash2 className="text-red-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Supprimer l'alerte ?</h3>
                  <p className="text-slate-400 mb-8">
                    Cette action est irréversible. L'alerte sera définitivement supprimée de votre historique.
                  </p>
                  <div className="flex gap-4 w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAlertToDelete(null)}
                      className="flex-1 px-6 py-3 rounded-xl font-bold bg-white/5 text-slate-400 hover:bg-white/10 transition-all"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => alertToDelete && handleDelete(alertToDelete)}
                      className="flex-1 px-6 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                    >
                      Supprimer
                    </motion.button>
                  </div>
                </div>
                <button 
                  onClick={() => setAlertToDelete(null)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
