'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Search, MapPin, Zap, AlertTriangle, Edit2, Trash2, Plus } from 'lucide-react';

const mockFoyers = [
  { id: 1, name: 'Foyer A-12', address: '123 Rue de Paris', consumption: 450, status: 'active', lastUpdate: '2m ago' },
  { id: 2, name: 'Foyer B-45', address: '456 Rue de Lyon', consumption: 380, status: 'active', lastUpdate: '5m ago' },
  { id: 3, name: 'Foyer C-89', address: '789 Rue de Marseille', consumption: 320, status: 'inactive', lastUpdate: '1h ago' },
  { id: 4, name: 'Foyer D-23', address: '321 Rue de Toulouse', consumption: 290, status: 'active', lastUpdate: '3m ago' },
  { id: 5, name: 'Foyer E-67', address: '654 Rue de Nice', consumption: 160, status: 'active', lastUpdate: '7m ago' },
];

export default function NodesPage() {
  const [foyers, setFoyers] = useState(mockFoyers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFoyers, setFilteredFoyers] = useState(mockFoyers);

  useEffect(() => {
    const filtered = foyers.filter(
      (foyer) =>
        foyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        foyer.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoyers(filtered);
  }, [searchTerm, foyers]);

  const handleDelete = (id: number) => {
    setFoyers(foyers.filter((f) => f.id !== id));
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">Adresse</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">Consommation</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">Dernière Mise à Jour</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoyers.map((foyer, index) => (
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
                        <span className="font-medium text-white">{foyer.consumption} kWh</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          foyer.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {foyer.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{foyer.lastUpdate}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
