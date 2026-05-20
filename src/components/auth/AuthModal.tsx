"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2, Loader2, Zap } from "lucide-react";
import PremiumButton from "@/components/ui/PremiumButton";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen, initialMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const result = mode === "login" 
        ? await authApi.login({ username: formData.username, password: formData.password })
        : await authApi.register({ 
            username: formData.username, 
            email: formData.email, 
            password: formData.password,
            first_name: formData.firstName,
            last_name: formData.lastName
          });

      if (result.status >= 200 && result.status < 300 && result.data) {
        if (mode === "login") {
          const { access, refresh, user } = result.data;
          login(access, refresh, user);
          setStatus("success");
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          // After signup, switch to login or auto-login
          setStatus("success");
          setTimeout(() => {
            setMode("login");
            setStatus("idle");
          }, 2000);
        }
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Impossible de contacter le serveur");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#05070A]/80 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0E1A]/90 p-8 shadow-2xl backdrop-blur-2xl"
      >
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-cyan/10 blur-[80px]" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-brand-violet/10 blur-[80px]" />

        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="relative mb-6">
                  {/* Premium Success Animation/GIF Placeholder */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="h-24 w-24 rounded-full bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan/50"
                  >
                    <CheckCircle2 className="h-12 w-12 text-brand-cyan" />
                  </motion.div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 border-2 border-dashed border-brand-cyan/20 rounded-full"
                  />
                </div>
                
                <h2 className="mb-2 text-3xl font-display font-bold text-white">
                  {mode === "login" ? "Bienvenue !" : "Compte Créé !"}
                </h2>
                <p className="text-slate-400">
                  {mode === "login" 
                    ? "Connexion réussie. Redirection vers votre dashboard..." 
                    : "Votre compte a été créé avec succès."}
                </p>
                
                {/* Visual GIF Placeholder as requested */}
                <div className="mt-8 h-32 w-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group">
                   <div className="absolute inset-0 bg-gradient-to-t from-brand-cyan/20 to-transparent opacity-50" />
                   <div className="flex items-center justify-center h-full">
                      <Zap className="w-12 h-12 text-brand-cyan animate-pulse" />
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-display font-black text-white tracking-tight">
                    {mode === "login" ? "Connexion" : "Inscription"}
                  </h2>
                  <p className="mt-2 text-slate-400">
                    {mode === "login" 
                      ? "Accédez à votre intelligence énergétique." 
                      : "Rejoignez la révolution énergétique dès aujourd'hui."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Prénom</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand-cyan/50 focus:bg-white/10 transition-all"
                            placeholder="Jean"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Nom</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand-cyan/50 focus:bg-white/10 transition-all"
                            placeholder="Dupont"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Nom d'utilisateur</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-brand-cyan/50 focus:bg-white/10 transition-all"
                        placeholder="username123"
                      />
                    </div>
                  </div>

                  {mode === "signup" && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-brand-cyan/50 focus:bg-white/10 transition-all"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-brand-cyan/50 focus:bg-white/10 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 font-medium ml-1"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  <div className="pt-4">
                    <PremiumButton
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full justify-center py-4"
                    >
                      {status === "loading" ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          {mode === "login" ? "Se connecter" : "S'inscrire"}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </PremiumButton>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-500">
                    {mode === "login"
                      ? "Pas encore de compte ?"
                      : "Déjà un compte ?"}
                    <button
                      onClick={() => setMode(mode === "login" ? "signup" : "login")}
                      className="ml-2 font-bold text-brand-cyan hover:underline"
                    >
                      {mode === "login" ? "S'inscrire" : "Se connecter"}
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
