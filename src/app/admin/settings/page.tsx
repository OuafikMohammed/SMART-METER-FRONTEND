'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Save, Bell, Shield, Database, Settings as SettingsIcon, Mail } from 'lucide-react';

interface Settings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  anomalyThreshold: number;
  maintenanceMode: boolean;
  dataRetention: number;
  backupFrequency: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    pushNotifications: false,
    anomalyThreshold: 15,
    maintenanceMode: false,
    dataRetention: 90,
    backupFrequency: 7,
  });

  const handleToggle = (key: keyof Settings) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    } as Settings);
  };

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings({
      ...settings,
      [key]: value,
    } as Settings);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black text-white tracking-tighter"
        >
          Configuration <span className="text-brand-cyan">System</span>
        </motion.h1>
        <p className="text-slate-500 font-medium mt-1">Gérez les paramètres du système</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-brand-cyan" />
              </div>
              <h2 className="text-xl font-bold text-white">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <div>
                  <p className="font-medium text-white">Notifications Email</p>
                  <p className="text-sm text-slate-400">Recevoir des alertes par email</p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cyan" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <div>
                  <p className="font-medium text-white">Notifications Push</p>
                  <p className="text-sm text-slate-400">Recevoir des notifications push</p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleToggle('pushNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cyan" />
                </label>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="font-medium text-white mb-3">Seuil d'Anomalie (%)</p>
                <input
                  type="number"
                  value={settings.anomalyThreshold}
                  onChange={(e) => handleChange('anomalyThreshold', parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-brand-violet/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand-violet" />
              </div>
              <h2 className="text-xl font-bold text-white">Sécurité</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <div>
                  <p className="font-medium text-white">Mode Maintenance</p>
                  <p className="text-sm text-slate-400">Désactiver l'accès utilisateur</p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={() => handleToggle('maintenanceMode')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600" />
                </label>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Database */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Base de Données</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="font-medium text-white mb-3">Rétention des Données (jours)</p>
                <input
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) => handleChange('dataRetention', parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="font-medium text-white mb-3">Fréquence de Sauvegarde (jours)</p>
                <input
                  type="number"
                  value={settings.backupFrequency}
                  onChange={(e) => handleChange('backupFrequency', parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-cyan text-brand-dark font-bold hover:shadow-lg hover:shadow-brand-cyan/50 transition-all">
          <Save className="w-5 h-5" />
          Enregistrer les Paramètres
        </button>
      </motion.div>
    </div>
  );
}
