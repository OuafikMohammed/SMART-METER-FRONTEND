'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAdminResidents, useAdminFoyers, useAssignFoyer } from '@/hooks';
import { AlertTriangle, TrendingUp, Users, Search, Plus, Edit2, Eye } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function AdminResidentsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedResident, setSelectedResident] = useState<number | null>(null);
  const [selectedFoyerId, setSelectedFoyerId] = useState<number | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const { data: residentsData, loading: residentsLoading, refetch: refetchResidents } = useAdminResidents(page, 20, search);
  const { data: foyersData, loading: foyersLoading } = useAdminFoyers(1, 100);
  const { assignFoyer, loading: assignLoading } = useAssignFoyer();

  const handleAssignFoyer = async () => {
    if (!selectedResident || !selectedFoyerId) return;

    try {
      await assignFoyer(selectedResident, selectedFoyerId);
      setShowAssignModal(false);
      setSelectedResident(null);
      setSelectedFoyerId(null);
      refetchResidents();
    } catch (err) {
      console.error('Erreur lors de l\'assignation du foyer:', err);
    }
  };

  const handleViewDetail = (residentId: number) => {
    router.push(`/admin/residents/${residentId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Gestion des Résidents</h1>
            <p className="text-slate-400">
              Gérez tous les résidents et assignez-les aux foyers
            </p>
          </div>
          <Users className="w-12 h-12 text-brand-cyan opacity-20" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou username..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-12 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan"
          />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Résidents</p>
              <p className="text-2xl font-bold text-white">{residentsData?.count || 0}</p>
            </div>
            <Users className="w-10 h-10 text-brand-cyan opacity-40" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Foyers Disponibles</p>
              <p className="text-2xl font-bold text-white">{foyersData?.count || 0}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-brand-violet opacity-40" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Assignations Actives</p>
              <p className="text-2xl font-bold text-white">
                {residentsData?.results.filter((r) => r.foyer).length || 0}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-amber-400 opacity-40" />
          </div>
        </GlassCard>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard>
          {residentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block">
                <div className="w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full"></div>
              </div>
              <p className="text-slate-400 mt-2">Chargement...</p>
            </div>
          ) : residentsData?.results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">Aucun résident trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Résident</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Foyer</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Conso Jour</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Conso Semaine</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Alertes</th>
                    <th className="text-center py-3 px-4 text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {residentsData?.results.map((resident) => (
                    <tr key={resident.id} className="border-b border-slate-700 hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 text-white font-medium">
                        {resident.first_name} {resident.last_name}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{resident.email}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {resident.foyer ? (
                          <span className="text-brand-cyan">{resident.foyer.numero_foyer}</span>
                        ) : (
                          <span className="text-amber-400">Non assigné</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-white">
                        {resident.consommation_jour.toFixed(1)} kWh
                      </td>
                      <td className="py-3 px-4 text-right text-white">
                        {resident.consommation_semaine.toFixed(1)} kWh
                      </td>
                      <td className="py-3 px-4 text-right">
                        {resident.alertes_non_acquittees > 0 ? (
                          <span className="text-red-400 font-medium">{resident.alertes_non_acquittees}</span>
                        ) : (
                          <span className="text-green-400">0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(resident.id)}
                            className="text-brand-cyan hover:text-brand-violet transition"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedResident(resident.id);
                              setShowAssignModal(true);
                            }}
                            className="text-brand-violet hover:text-brand-cyan transition"
                            title="Assigner un foyer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {(residentsData?.count || 0) > 20 && (
            <div className="flex justify-center gap-2 mt-6 pt-4 border-t border-slate-700">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50 hover:bg-slate-600 transition"
              >
                Précédent
              </button>
              <span className="px-3 py-1 text-slate-400">
                Page {page} sur {Math.ceil((residentsData?.count || 0) / 20)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!residentsData || page >= Math.ceil(residentsData.count / 20)}
                className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50 hover:bg-slate-600 transition"
              >
                Suivant
              </button>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Assign Foyer Modal */}
      {showAssignModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-white mb-4">Assigner un Foyer</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-2">Sélectionner un foyer</label>
                <select
                  value={selectedFoyerId || ''}
                  onChange={(e) => setSelectedFoyerId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-brand-cyan"
                >
                  <option value="">-- Choisir un foyer --</option>
                  {foyersData?.results.map((foyer) => (
                    <option key={foyer.id} value={foyer.id}>
                      {foyer.numero_foyer} - {foyer.adresse}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedResident(null);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition"
                  disabled={assignLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleAssignFoyer}
                  disabled={!selectedFoyerId || assignLoading}
                  className="flex-1 px-4 py-2 bg-brand-cyan text-slate-900 rounded font-medium hover:bg-cyan-400 transition disabled:opacity-50"
                >
                  {assignLoading ? 'Assignation...' : 'Assigner'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
