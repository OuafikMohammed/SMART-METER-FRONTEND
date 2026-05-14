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
        const response = await fetch(`${baseUrl}/api/admin/foyers/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Erreur lors du chargement des foyers');
        
        const data = await response.json();
        const foyersList = data.results || data;
        setFoyers(Array.isArray(foyersList) ? foyersList : []);
        setFilteredFoyers(Array.isArray(foyersList) ? foyersList : []);
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

  const handleDelete = async (id: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/admin/foyers/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      setFoyers(foyers.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Erreur suppression foyer:', err);
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
          <p className="text-slate-400 text-sm font-medium mb-2">Consommation Totale</p>
          <p className="text-3xl font-bold text-brand-cyan">
            {foyers.reduce((sum, f) => sum + f.consumption, 0)} kWh
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
                            <span className="font-medium text-white">{foyer.numero_foyer || foyer.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{foyer.adresse || foyer.address}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-brand-cyan" />
                            <span className="font-medium text-white">{foyer.puissance_souscrite || foyer.consumption} kW</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              (foyer.is_active !== false)
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {(foyer.is_active !== false) ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{foyer.resident_name || foyer.lastUpdate || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                              <Edit2 className="w-4 h-4 text-brand-cyan" />
                            </button>
                            <button
                              onClick={() => handleDelete(foyer.id)}
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
    </div>
  );
}
