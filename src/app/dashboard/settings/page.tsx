"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Settings, Bell, Lock, User, LogOut, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    firstName: user?.fullName?.split(" ")[0] || "",
    lastName: user?.fullName?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    pushNotifications: true,
    consumptionAlerts: true,
    peakHourReminders: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Lock },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          <span className="text-brand-cyan">Paramètres</span>
        </h1>
        <p className="text-slate-500 mt-2">Gérez vos préférences et paramètres de compte.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-white/10 overflow-x-auto pb-4">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-brand-cyan/20 text-brand-cyan border-b-2 border-brand-cyan"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Informations du Profil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-cyan/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-cyan/50 transition-colors"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-slate-400 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-cyan/50 transition-colors"
              />
            </div>
            <div className="mb-6">
              <label className="block text-slate-400 text-sm font-bold mb-2">Type de Compte</label>
              <input
                type="text"
                value="Résident"
                disabled
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed opacity-50"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl bg-brand-cyan text-brand-dark font-bold hover:bg-brand-cyan/90 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Enregistrer les Modifications
            </motion.button>
          </GlassCard>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <GlassCard className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-white mb-6">Préférences de Notifications</h2>

            {[
              {
                key: "email",
                label: "Notifications par Email",
                description: "Recevez les alertes importantes par email",
              },
              { key: "sms", label: "Notifications par SMS", description: "Recevez les alertes urgentes par SMS" },
              {
                key: "pushNotifications",
                label: "Notifications Push",
                description: "Recevez les notifications sur votre navigateur",
              },
              {
                key: "consumptionAlerts",
                label: "Alertes de Consommation",
                description: "Soyez notifié lorsque votre consommation dépasse le seuil",
              },
              {
                key: "peakHourReminders",
                label: "Rappels d'Heures de Pointe",
                description: "Recevez un rappel avant les heures tarifaires de pointe",
              },
            ].map((setting) => (
              <div
                key={setting.key}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div>
                  <p className="text-white font-bold">{setting.label}</p>
                  <p className="text-slate-500 text-sm mt-1">{setting.description}</p>
                </div>
                <button
                  onClick={() => handleNotificationChange(setting.key as keyof typeof notifications)}
                  className={`w-12 h-7 rounded-full transition-all flex items-center ${
                    notifications[setting.key as keyof typeof notifications]
                      ? "bg-brand-cyan"
                      : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications[setting.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </GlassCard>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Sécurité du Compte</h2>

            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Mot de passe actuel</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-brand-cyan/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-brand-cyan/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-brand-cyan/50 transition-colors"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl bg-brand-cyan text-brand-dark font-bold hover:bg-brand-cyan/90 transition-colors flex items-center justify-center gap-2 mb-6"
            >
              <Lock size={18} />
              Mettre à jour le mot de passe
            </motion.button>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-bold text-white mb-4">Sessions Actives</h3>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                  <p className="text-white font-bold">Navigateur Actuel</p>
                  <p className="text-slate-500 text-sm mt-1">Chrome - Windows</p>
                </div>
                <span className="text-emerald-400 text-xs font-bold">Actif</span>
              </div>
            </div>
          </GlassCard>

          {/* Logout Section */}
          <GlassCard className="p-8 border-red-500/20 bg-red-500/5">
            <h2 className="text-xl font-bold text-red-400 mb-4">Déconnexion</h2>
            <p className="text-slate-400 mb-6">Vous serez déconnecté de tous les appareils et devrez vous reconnecter.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 border border-red-500/20"
            >
              <LogOut size={18} />
              Se Déconnecter
            </motion.button>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
