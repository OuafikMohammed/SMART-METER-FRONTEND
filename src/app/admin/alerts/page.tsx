'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSecureApi } from '@/hooks/useSecureApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, Archive, CheckCircle2, Eye, Filter, RefreshCcw, ExternalLink } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Link from 'next/link';

interface Alerte {
  id: number;
  anomalie: number;
  foyer_numero: string;
  anomalie_severite: string;
  anomalie_score: number;
  statut: string;
  acquittee: boolean;
  created_at: string;
  acquittee_at?: string;
}

export default function AdminAlertsPage() {
  const { secureFetch } = useSecureApi();
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    statut: 'all',
    acquittee: 'all',
  });

  useEffect(() => {
    fetchAlertes();
  }, [filter]);

  const getErrorMessage = (err: unknown, statusCode?: number): string => {
    if (statusCode === 401 || statusCode === 403) {
      return "Vous n'avez pas les permissions pour accéder à ces données.";
    }
    if (statusCode === 404) {
      return "Endpoint API non trouvé.";
    }
    return "Erreur lors du chargement des alertes.";
  };

  const fetchAlertes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filter.statut && filter.statut !== 'all') params.append('statut', filter.statut);
      if (filter.acquittee && filter.acquittee !== 'all') params.append('acquittee', filter.acquittee);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      const response = await secureFetch(
        `${baseUrl}/energy/alertes/?${params.toString()}`
      );

      const data = await response.json();
      const results = Array.isArray(data) ? data : data.results || [];
      setAlertes(results);
    } catch (err) {
      const statusCode = (err as any)?.status || null;
      setError(getErrorMessage(err, statusCode));
    } finally {
      setLoading(false);
    }
  };

  const marquerConsultee = async (alerteId: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      await secureFetch(`${baseUrl}/energy/alertes/${alerteId}/marquer_consultee/`, {
        method: 'POST',
      });
      fetchAlertes();
    } catch (error) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const acquitterAlerte = async (alerteId: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      await secureFetch(`${baseUrl}/energy/alertes/${alerteId}/acquitter/`, {
        method: 'POST',
      });
      fetchAlertes();
    } catch (error) {
      setError('Erreur lors de l\'acquittement');
    }
  };

  const getSeveriteStyles = (severite: string) => {
    switch (severite) {
      case 'CRITIQUE': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'HAUTE': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'MOYENNE': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  const getStatutStyles = (statut: string) => {
    switch (statut) {
      case 'NOUVELLE': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'CONSULTEE': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'ACQUITTEE': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 relative pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex items-center gap-3 mb-2"
           >
             <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/20">
                <Bell className="text-brand-cyan" size={20} />
             </div>
             <span className="text-xs font-black text-brand-cyan uppercase tracking-[0.2em]">Monitoring System</span>
           </motion.div>
           <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-white tracking-tighter"
           >
            Centre des <span className="text-brand-cyan text-glow-cyan">Alertes</span>
           </motion.h1>
           <p className="text-slate-500 font-medium mt-1">Gestion et archivage des alertes critiques issues des anomalies de consommation.</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => fetchAlertes()}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 transition-all group"
          >
            <RefreshCcw className={`w-4 h-4 text-brand-cyan group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs font-bold text-white ml-2">Actualiser</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-brand-cyan/10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <ShieldAlert className="text-blue-400" size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alertes Actives</p>
                <h3 className="text-2xl font-black text-white">{alertes.filter(a => !a.acquittee).length}</h3>
             </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 border-purple-500/10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <RefreshCcw className="text-purple-400" size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">En cours</p>
                <h3 className="text-2xl font-black text-white">{alertes.filter(a => a.statut === 'CONSULTEE').length}</h3>
             </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-slate-500/10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-slate-500/10 flex items-center justify-center border border-slate-500/20">
                <Archive className="text-slate-400" size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Archivées</p>
                <h3 className="text-2xl font-black text-white">{alertes.filter(a => a.acquittee).length}</h3>
             </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters Section */}
      <GlassCard className="p-4" hoverEffect={false}>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-slate-400 px-2">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Filtres</span>
          </div>
          
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={filter.statut} onValueChange={(v) => setFilter({...filter, statut: v})}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-10">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="NOUVELLE">Nouvelle</SelectItem>
                <SelectItem value="CONSULTEE">Consultée</SelectItem>
                <SelectItem value="ACQUITTEE">Acquittée</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filter.acquittee} onValueChange={(v) => setFilter({...filter, acquittee: v})}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-10">
                <SelectValue placeholder="Visibilité" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="all">Toutes les alertes</SelectItem>
                <SelectItem value="false">Alertes Actives</SelectItem>
                <SelectItem value="true">Archives (Acquittées)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Main Content Table */}
      <ErrorAlert error={error} />
      
      <GlassCard className="overflow-hidden border-white/5" hoverEffect={false}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent bg-white/[0.02]">
                <TableHead className="text-slate-500 font-bold py-5 px-6 uppercase tracking-widest text-[10px]">Foyer</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Sévérité</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Confiance IA</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Statut</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Date</TableHead>
                <TableHead className="text-slate-500 font-bold text-right px-6 uppercase tracking-widest text-[10px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-10 h-10 border-2 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin"></div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Synchronisation en cours...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : alertes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <CheckCircle2 size={40} className="text-slate-700 mb-2" />
                       <p className="text-sm font-bold text-white uppercase tracking-widest">Aucune alerte trouvée</p>
                       <p className="text-xs text-slate-500">Modifiez les filtres pour voir plus de résultats</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                alertes.map((alerte, i) => (
                  <motion.tr 
                    key={alerte.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-white font-black text-sm">{alerte.foyer_numero}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">SmartNode Device</span>
                      </div>
                    </TableCell>
                    <TableCell>
                       <Badge className={getSeveriteStyles(alerte.anomalie_severite)}>
                          {alerte.anomalie_severite}
                       </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${alerte.anomalie_score * 100}%` }}
                               className={`h-full rounded-full ${alerte.anomalie_score > 0.8 ? 'bg-red-500' : 'bg-brand-cyan'}`}
                             />
                          </div>
                          <span className="text-[11px] font-bold text-white">{(alerte.anomalie_score * 100).toFixed(0)}%</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <Badge className={getStatutStyles(alerte.statut)}>
                          {alerte.statut}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs font-medium">
                       {new Date(alerte.created_at).toLocaleDateString('fr-FR', {
                         day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                       })}
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/anomalies?id=${alerte.anomalie}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg flex items-center gap-2"
                            onClick={() => {
                              if (alerte.statut === 'NOUVELLE') marquerConsultee(alerte.id);
                            }}
                          >
                             <ExternalLink size={14} />
                             <span className="text-[10px] font-bold uppercase">Détails</span>
                          </Button>
                        </Link>
                        {!alerte.acquittee && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 rounded-lg flex items-center gap-2"
                            onClick={() => acquitterAlerte(alerte.id)}
                          >
                             <CheckCircle2 size={14} />
                             <span className="text-[10px] font-bold uppercase">Acquitter</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </GlassCard>

      {/* Info Panel RG12 */}
      <GlassCard className="p-6 border-blue-500/10 bg-blue-500/[0.02]" hoverEffect={false}>
         <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
               <ShieldAlert className="text-blue-400" size={20} />
            </div>
            <div>
               <h4 className="text-sm font-bold text-white mb-1">Conformité RG12 - Politique d'Archivage</h4>
               <p className="text-xs text-slate-400 leading-relaxed">
                 Toutes les alertes acquittées sont conservées de manière permanente dans le registre d'audit (Audit Log) et restent consultables dans la section "Archives". Aucune donnée n'est supprimée afin de garantir la traçabilité des interventions de sécurité.
               </p>
            </div>
         </div>
      </GlassCard>
    </div>
  );
}
