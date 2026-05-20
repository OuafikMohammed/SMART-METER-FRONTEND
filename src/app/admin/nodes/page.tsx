'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Search, MapPin, Zap, AlertTriangle, Edit2, Trash2, Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Foyer {
  id: number;
  name: string;
  address: string;
  consumption: number;
  status: 'active' | 'inactive';
  residentName: string;
  lastUpdate: string;
}

export default function NodesPage() {
  const { token } = useAuth();
  const [foyers, setFoyers] = useState<Foyer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFoyers, setFilteredFoyers] = useState<Foyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoyers = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/energy/foyers/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Erreur lors du chargement des foyers');
        
        const data = await response.json();
        const foyersData = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
        
        // Transform backend data to frontend format
        const foyersList = foyersData.map((f: any) => ({
          id: f.id,
          name: f.numero_foyer || `Foyer ${f.id}`,
          address: f.adresse || 'N/A',
          consumption: f.puissance_souscrite || 0,
          status: f.is_active ? 'active' : 'inactive',
          residentName: f.resident_name || 'N/A',
          lastUpdate: f.updated_at || new Date().toISOString()
        }));
        setFoyers(foyersList);
        setFilteredFoyers(foyersList);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(message);
        console.error('Erreur fetch foyers:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFoyers();
    }
  }, [token]);

  useEffect(() => {
    const filtered = foyers.filter(
      (foyer) =>
        foyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        foyer.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoyers(filtered);
  }, [searchTerm, foyers]);

  const [editingFoyer, setEditingFoyer] = useState<Foyer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [foyerToDelete, setFoyerToDelete] = useState<number | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [newFoyer, setNewFoyer] = useState({
    numero_foyer: '',
    adresse: '',
    ville: 'Casablanca',
    code_postal: '20000',
    puissance_souscrite: 6.0
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/energy/foyers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newFoyer),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erreur lors de la création');
      }

      const created = await response.json();
      const mapped = {
        id: created.id,
        name: created.numero_foyer,
        address: created.adresse,
        consumption: created.puissance_souscrite,
        status: created.is_active ? 'active' : ('inactive' as 'active' | 'inactive'),
        residentName: 'N/A',
        lastUpdate: created.updated_at
      };
      
      setFoyers([mapped, ...foyers]);
      setIsAddModalOpen(false);
      setNewFoyer({
        numero_foyer: '',
        adresse: '',
        ville: 'Casablanca',
        code_postal: '20000',
        puissance_souscrite: 6.0
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFoyer) return;

    try {
      setUpdateLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/energy/foyers/${editingFoyer.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          adresse: editingFoyer.address,
          puissance_souscrite: editingFoyer.consumption,
          is_active: editingFoyer.status === 'active'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erreur lors de la mise à jour');
      }

      const updated = await response.json();
      setFoyers(foyers.map(f => f.id === updated.id ? {
        ...f,
        address: updated.adresse,
        consumption: updated.puissance_souscrite,
        status: updated.is_active ? 'active' : 'inactive'
      } : f));
      
      setIsEditModalOpen(false);
      setEditingFoyer(null);
    } catch (err) {
      console.error('Update error:', err);
      alert(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/energy/foyers/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      setFoyers(foyers.filter((f) => f.id !== id));
      setFoyerToDelete(null);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      console.error('Erreur suppression foyer:', errorMsg);
      setError(errorMsg);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-white tracking-tighter"
          >
            Foyers <span className="text-brand-cyan">Management</span>
          </motion.h1>
          <p className="text-slate-500 font-medium mt-1">Gérez tous les foyers connectés</p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-cyan text-brand-dark font-bold hover:shadow-lg hover:shadow-brand-cyan/50 transition-all"
        >
          <Plus className="w-4 h-4" />
          Ajouter Foyer
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Total Foyers</p>
          <p className="text-3xl font-bold text-white">{foyers.length}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Actifs</p>
          <p className="text-3xl font-bold text-emerald-400">{foyers.filter((f) => f.status === 'active').length}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Puissance Totale</p>
          <p className="text-3xl font-bold text-brand-cyan">
            {foyers.reduce((sum, f) => sum + f.consumption, 0).toFixed(1)} kW
          </p>
        </GlassCard>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Rechercher par nom ou adresse..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
        />
      </div>

      {/* Foyers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="overflow-hidden">
          {error && (
            <div className="flex items-center gap-2 p-4 border-b border-red-500/20 bg-red-500/10">
              <AlertCircle className="text-red-400" size={20} />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">Foyer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">Adresse</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">Puissance</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">Résident</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFoyers.length > 0 ? (
                    filteredFoyers.map((foyer, index) => (
                      <motion.tr
                        key={foyer.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-brand-cyan" />
                            </div>
                            <span className="font-medium text-white">{foyer.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{foyer.address}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-brand-cyan" />
                            <span className="font-medium text-white">{foyer.consumption} kW</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              (foyer.status === 'active')
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {(foyer.status === 'active') ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{foyer.residentName}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => {
                                setEditingFoyer(foyer);
                                setIsEditModalOpen(true);
                              }}
                              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-brand-cyan" />
                            </button>
                            <button
                              onClick={() => setFoyerToDelete(foyer.id)}
                              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        {searchTerm ? 'Aucun foyer trouvé' : 'Aucun foyer disponible'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Ajouter un Foyer</h2>
              
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Numéro Foyer (ex: F-100)</label>
                  <input
                    type="text"
                    required
                    value={newFoyer.numero_foyer}
                    onChange={(e) => setNewFoyer({ ...newFoyer, numero_foyer: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-cyan"
                    placeholder="F-XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Adresse</label>
                  <textarea
                    required
                    value={newFoyer.adresse}
                    onChange={(e) => setNewFoyer({ ...newFoyer, adresse: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-cyan"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Ville</label>
                    <input
                      type="text"
                      value={newFoyer.ville}
                      onChange={(e) => setNewFoyer({ ...newFoyer, ville: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Code Postal</label>
                    <input
                      type="text"
                      value={newFoyer.code_postal}
                      onChange={(e) => setNewFoyer({ ...newFoyer, code_postal: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Puissance (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newFoyer.puissance_souscrite}
                    onChange={(e) => setNewFoyer({ ...newFoyer, puissance_souscrite: parseFloat(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1 py-3 rounded-xl bg-brand-cyan text-brand-dark font-bold hover:shadow-lg hover:shadow-brand-cyan/40 transition-all disabled:opacity-50"
                  >
                    {updateLoading ? 'Création...' : 'Créer le Foyer'}
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingFoyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Modifier {editingFoyer.name}</h2>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Adresse</label>
                  <textarea
                    value={editingFoyer.address}
                    onChange={(e) => setEditingFoyer({ ...editingFoyer, address: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-cyan"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Puissance (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingFoyer.consumption}
                    onChange={(e) => setEditingFoyer({ ...editingFoyer, consumption: parseFloat(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Statut</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setEditingFoyer({ ...editingFoyer, status: 'active' })}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                        editingFoyer.status === 'active' 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                        : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      Actif
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingFoyer({ ...editingFoyer, status: 'inactive' })}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                        editingFoyer.status === 'inactive' 
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                        : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      Inactif
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1 py-3 rounded-xl bg-brand-cyan text-brand-dark font-bold hover:shadow-lg hover:shadow-brand-cyan/40 transition-all disabled:opacity-50"
                  >
                    {updateLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {foyerToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm"
          >
            <GlassCard className="p-8 border border-red-500/20 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Supprimer le foyer ?</h2>
              <p className="text-slate-400 mb-8">Cette action est irréversible. Les données de consommation associées seront également supprimées.</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setFoyerToDelete(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(foyerToDelete)}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:shadow-lg hover:shadow-red-500/40 transition-all"
                >
                  Supprimer
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}
