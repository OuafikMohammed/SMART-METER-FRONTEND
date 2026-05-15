'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useReadings } from '@/hooks/useReadings';
import { Trash2, Edit2, Plus, BarChart3, Calendar, Zap } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface FormData {
  meter_id: string;
  timestamp: string;
  consumption_kwh: string;
  tariff_type: 'standard' | 'peak' | 'off_peak';
}

export default function ResidentReadingsPage() {
  const { user } = useAuth();
  const {
    readings,
    loading,
    error,
    success,
    fetchResidentReadings,
    createReading,
    updateReading,
    deleteReading,
    clearSuccess,
  } = useReadings(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    meter_id: '',
    timestamp: '',
    consumption_kwh: '',
    tariff_type: 'standard',
  });

  // Fetch readings on mount
  useEffect(() => {
    fetchResidentReadings();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(clearSuccess, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, clearSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.meter_id || !formData.timestamp || !formData.consumption_kwh) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const data = {
      meter_id: formData.meter_id,
      timestamp: formData.timestamp,
      consumption_kwh: parseFloat(formData.consumption_kwh),
      tariff_type: formData.tariff_type,
    };

    if (editingId) {
      await updateReading(editingId, data);
      setEditingId(null);
    } else {
      await createReading(data);
    }

    setFormData({
      meter_id: '',
      timestamp: '',
      consumption_kwh: '',
      tariff_type: 'standard',
    });
    setShowForm(false);
  };

  const handleEdit = (reading: any) => {
    setEditingId(reading.id);
    setFormData({
      meter_id: reading.meter_id,
      timestamp: reading.timestamp.split('T')[0],
      consumption_kwh: reading.consumption_kwh.toString(),
      tariff_type: reading.tariff_type,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette lecture?')) {
      await deleteReading(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      meter_id: '',
      timestamp: '',
      consumption_kwh: '',
      tariff_type: 'standard',
    });
  };

  const totalConsumption = readings.reduce((sum, r) => sum + r.consumption_kwh, 0);
  const avgConsumption = readings.length > 0 ? totalConsumption / readings.length : 0;
  const totalCost = readings.reduce((sum, r) => sum + r.cost_estimate, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Mes Lectures de Consommation
          </h1>
          <p className="text-slate-500 mt-2">
            Gestion de vos lectures de consommation énergétique
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-cyan/20 hover:bg-brand-cyan/30 border border-brand-cyan/30 text-brand-cyan transition-colors"
        >
          <Plus size={20} />
          Ajouter
        </button>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <p className="text-red-400">⚠️ {error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <p className="text-emerald-400">✓ {success}</p>
        </motion.div>
      )}

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Modifier la lecture' : 'Nouvelle lecture'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    N° Compteur
                  </label>
                  <input
                    type="text"
                    value={formData.meter_id}
                    onChange={(e) =>
                      setFormData({ ...formData, meter_id: e.target.value })
                    }
                    placeholder="ex: MTR-001"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.timestamp}
                    onChange={(e) =>
                      setFormData({ ...formData, timestamp: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-cyan/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Consommation (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.consumption_kwh}
                    onChange={(e) =>
                      setFormData({ ...formData, consumption_kwh: e.target.value })
                    }
                    placeholder="0.0"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Type de Tarif
                  </label>
                  <select
                    value={formData.tariff_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tariff_type: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-cyan/50"
                  >
                    <option value="standard">Standard</option>
                    <option value="peak">Pic</option>
                    <option value="off_peak">Heures creuses</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-brand-cyan/20 hover:bg-brand-cyan/30 border border-brand-cyan/30 text-brand-cyan disabled:opacity-50"
                >
                  {loading ? 'Traitement...' : editingId ? 'Modifier' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                >
                  Annuler
                </button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Consommation Totale</p>
              <p className="text-2xl font-bold text-white mt-2">
                {totalConsumption.toFixed(2)} kWh
              </p>
            </div>
            <Zap className="text-brand-cyan" size={32} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Consommation Moyenne</p>
              <p className="text-2xl font-bold text-white mt-2">
                {avgConsumption.toFixed(2)} kWh
              </p>
            </div>
            <BarChart3 className="text-brand-violet" size={32} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Coût Total Estimé</p>
              <p className="text-2xl font-bold text-white mt-2">
                {totalCost.toFixed(2)} €
              </p>
            </div>
            <Calendar className="text-emerald-400" size={32} />
          </div>
        </GlassCard>
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Compteur
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Consommation
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Tarif
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Coût Estimé
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Chargement des lectures...
                  </td>
                </tr>
              ) : readings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Aucune lecture disponible
                  </td>
                </tr>
              ) : (
                readings.map((reading, index) => (
                  <motion.tr
                    key={reading.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      {new Date(reading.timestamp).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {reading.meter_id}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-brand-cyan">
                      {reading.consumption_kwh.toFixed(2)} kWh
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs">
                        {reading.tariff_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {reading.cost_estimate.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-sm text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(reading)}
                        className="p-2 rounded-lg hover:bg-brand-cyan/20 text-brand-cyan transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(reading.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
