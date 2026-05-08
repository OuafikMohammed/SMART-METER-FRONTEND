"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Shield, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import PremiumButton from "@/components/ui/PremiumButton";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.role !== 'ADMIN') {
          setStatus("error");
          setError("Accès réservé aux administrateurs.");
          return;
        }

        login(data.access, data.user);
        setStatus("success");
        
        // Redirect to admin dashboard after a delay
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        setStatus("error");
        setError(data.detail || "Identifiants invalides.");
      }
    } catch (err) {
      setStatus("error");
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-cyan/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-violet/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-dark p-12 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-cyan" />
          
          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-20 h-20 rounded-3xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,212,255,0.2)]">
              <Shield className="w-10 h-10 text-brand-cyan" />
            </div>
            <h1 className="text-4xl font-display font-black text-white tracking-tight mb-3">
              ADMIN <span className="text-brand-cyan italic">PANEL</span>
            </h1>
            <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-black">
              Accès Sécurisé - EMSI Casablanca
            </p>
          </div>

          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-10"
            >
              <div className="relative mb-8">
                <div className="h-24 w-24 rounded-full bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan/50">
                  <CheckCircle2 className="h-12 w-12 text-brand-cyan" />
                </div>
                <motion.div 
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute -inset-2 bg-brand-cyan/10 blur-xl -z-10 rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Authentification Réussie</h2>
              <p className="text-slate-400">Initialisation de la session administrateur...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Identifiant</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-cyan transition-colors" />
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white outline-none focus:border-brand-cyan/50 focus:bg-white/10 transition-all placeholder:text-slate-700"
                    placeholder="admin_id"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Mot de passe</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-cyan transition-colors" />
                  <input
                    type="password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white outline-none focus:border-brand-cyan/50 focus:bg-white/10 transition-all placeholder:text-slate-700"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {status === "error" && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <PremiumButton 
                  type="submit" 
                  className="w-full justify-center py-5 rounded-[1.5rem]" 
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Se Connecter
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </PremiumButton>
              </div>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-loose">
              Système de Monitoring Énergétique <br />
              &copy; 2026 EMSI Casablanca - Département Génie Informatique
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
