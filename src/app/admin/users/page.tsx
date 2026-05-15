'use client';

/**
 * app/admin/users/page.tsx
 * Page de gestion des utilisateurs pour les administrateurs.
 * 
 * Affiche:
 * - Liste de tous les utilisateurs
 * - ID, username, email, role, foyer
 * - Pagination
 * - Interface pour créer/éditer des utilisateurs
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'RESIDENT';
  foyer?: {
    id: number;
    numero_foyer: string;
  };
  is_active: boolean;
}

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Vérifier que l'utilisateur est ADMIN
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Charger la liste des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('sm_token');
        if (!token) {
          toast.error('Session expirée');
          return;
        }

        // Temporarily show a message - backend user endpoints not yet available
        // TODO: Create /api/users/ endpoint in backend
        toast.info('Gestion utilisateurs non encore disponible');
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
        return;
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors du chargement');
        }

        const data: User[] = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Impossible de charger les utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrer les utilisateurs
  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const getRoleBadgeColor = (role: string) => {
    return role === 'ADMIN'
      ? 'bg-red-500/20 text-red-400 border-red-500/30'
      : 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">
          <Users className="w-8 h-8 text-accent-cyan" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-accent-cyan" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-slate-400">
            {users.length} utilisateur{users.length > 1 ? 's' : ''} trouvé{users.length > 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-accent-cyan text-brand-dark rounded-lg font-bold hover:bg-accent-cyan/90 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouvel Utilisateur
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Rechercher par username ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-surface-raised border border-surface-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/50 transition-colors"
        />
      </div>

      {/* Users Table */}
      <div className="bg-surface-raised border border-surface-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Header */}
            <thead>
              <tr className="bg-brand-dark/50 border-b border-surface-border">
                <th className="px-6 py-4 text-left text-slate-400 font-semibold">ID</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold">Username</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold">Rôle</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold">Foyer</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {filteredUsers.map((u, index) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b border-surface-border hover:bg-brand-dark/30 transition-colors ${
                    index % 2 === 0 ? 'bg-brand-dark/10' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-slate-300 font-mono">{u.id}</td>
                  <td className="px-6 py-4 text-white font-medium">{u.username}</td>
                  <td className="px-6 py-4 text-slate-400">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(
                        u.role
                      )}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {u.foyer?.numero_foyer || '—'}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                      aria-label="Éditer utilisateur"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      aria-label="Supprimer utilisateur"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-raised border border-surface-border rounded-lg p-6"
        >
          <p className="text-slate-400 text-sm mb-2">Total</p>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-raised border border-surface-border rounded-lg p-6"
        >
          <p className="text-slate-400 text-sm mb-2">Administrateurs</p>
          <p className="text-3xl font-bold text-red-400">
            {users.filter((u) => u.role === 'ADMIN').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-raised border border-surface-border rounded-lg p-6"
        >
          <p className="text-slate-400 text-sm mb-2">Résidents</p>
          <p className="text-3xl font-bold text-blue-400">
            {users.filter((u) => u.role === 'RESIDENT').length}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
