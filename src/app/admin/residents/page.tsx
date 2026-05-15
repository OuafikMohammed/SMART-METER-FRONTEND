'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useAdminResidents } from '@/hooks/useResidentsManagement';
import { Users, Mail, Home, Zap, Loader, Plus, Edit2, Trash2, X } from 'lucide-react';
import { Resident } from '@/lib/api';
import GlassCard from '@/components/ui/GlassCard';
import Link from 'next/link';

export default function AdminResidentsPage() {
  const { user } = useAuth();
  const { residents, loading, error, success, fetchResidents, createResident, updateResident, deleteResident } = useAdminResidents();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  });

  // Fetch residents on mount
  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  // Show success message
  useEffect(() => {
    if (success) {
      setSuccessMessage(success);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  }, [success]);

  const handleOpenCreate = () => {
    setFormData({ email: '', first_name: '', last_name: '', password: '' });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (resident: Resident) => {
    setSelectedResident(resident);
    setFormData({
      email: resident.email,
      first_name: resident.first_name,
      last_name: resident.last_name,
      password: '',
    });
    setShowEditModal(true);
  };

  const handleCreateResident = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.first_name || !formData.last_name || !formData.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createResident({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
      });
      
      if (result) {
        setShowCreateModal(false);
        setFormData({ email: '', first_name: '', last_name: '', password: '' });
        await fetchResidents();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateResident = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedResident) return;
    if (!formData.email || !formData.first_name || !formData.last_name) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: any = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const result = await updateResident(selectedResident.id, updateData);
      
      if (result) {
        setShowEditModal(false);
        setSelectedResident(null);
        setFormData({ email: '', first_name: '', last_name: '', password: '' });
        await fetchResidents();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResident = async (residentId: number) => {
    setIsSubmitting(true);
    try {
      const result = await deleteResident(residentId);
      if (result) {
        setShowDeleteConfirm(null);
        await fetchResidents();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Gestion des Résidents
          </h1>
          <p className="text-slate-500 mt-2">
            Gérez les résidents sous votre supervision et leurs données de consommation
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-lg bg-brand-cyan text-slate-900 font-semibold hover:bg-cyan-400 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Ajouter un Résident
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

      {successMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <p className="text-emerald-400">✓ {successMessage}</p>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Nombre de Résidents</p>
              <p className="text-3xl font-bold text-white mt-2">{residents.length}</p>
            </div>
            <Users className="text-brand-cyan" size={40} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Résidents Actifs</p>
              <p className="text-3xl font-bold text-white mt-2">
                {residents.filter((r: Resident) => r.role === 'RESIDENT').length}
              </p>
            </div>
            <Home className="text-brand-violet" size={40} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Compteurs Associés</p>
              <p className="text-3xl font-bold text-white mt-2">
                {residents.filter((r: Resident) => r.meter_id).length}
              </p>
            </div>
            <Zap className="text-emerald-400" size={40} />
          </div>
        </GlassCard>
      </div>

      {/* Residents Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-brand-cyan" size={40} />
        </div>
      ) : residents.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Users className="mx-auto text-slate-500 mb-4" size={48} />
          <p className="text-slate-400 mb-4">Aucun résident à afficher</p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg bg-brand-cyan text-slate-900 font-semibold hover:bg-cyan-400 transition inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Créer un Résident
          </button>
        </GlassCard>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {residents.map((resident: Resident, index: number) => (
            <motion.div key={resident.id} variants={itemVariants}>
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">
                        {resident.first_name} {resident.last_name}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                        <Mail size={14} />
                        {resident.email}
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      Actif
                    </div>
                  </div>

                  {/* Meter Info */}
                  {resident.meter_id ? (
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-slate-400 text-xs">Compteur</p>
                      <p className="text-white font-mono mt-1">{resident.meter_id}</p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-yellow-400 text-xs">ℹ️ Aucun compteur assigné</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/residents/${resident.id}/readings`}
                      className="flex-1 px-3 py-2 rounded-lg bg-brand-cyan/20 hover:bg-brand-cyan/30 border border-brand-cyan/30 text-brand-cyan text-sm text-center transition-colors"
                    >
                      Lectures
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(resident)}
                      className="px-3 py-2 rounded-lg bg-brand-violet/20 hover:bg-brand-violet/30 border border-brand-violet/30 text-brand-violet text-sm transition-colors"
                      title="Modifier"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(resident.id)}
                      className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-xl border border-white/10 w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Créer un Résident</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateResident} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
                  placeholder="resident@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Mot de passe *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-brand-cyan text-slate-900 font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedResident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-xl border border-white/10 w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Modifier le Résident</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateResident} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Nouveau mot de passe (optionnel)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
                  placeholder="Laisser vide pour ne pas changer"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-brand-cyan text-slate-900 font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Modification...' : 'Modifier'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-xl border border-red-500/20 w-full max-w-md p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Confirmer la Suppression</h2>
            <p className="text-slate-400 mb-6">
              Êtes-vous sûr de vouloir supprimer ce résident ? Cette action est irréversible.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteResident(showDeleteConfirm)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 font-semibold transition disabled:opacity-50"
              >
                {isSubmitting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
