"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PremiumButton from "@/components/ui/PremiumButton";
import AnimatedInput from "@/components/ui/AnimatedInput";
import LaserFlow from "@/components/react-bits/LaserFlow/LaserFlow";
import { Zap, ArrowLeft, Globe, Lock, Shield, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/auth/login");
        }, 2500);
      } else {
        setStatus("error");
        // Handle field errors if any
        const firstError = Object.values(data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : (data.detail || "Une erreur est survenue lors de l'inscription."));
      }
    } catch (err) {
      setStatus("error");
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-brand-dark overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <LaserFlow
          color="#00D4FF"
          wispDensity={0.5}
          flowSpeed={0.2}
          fogIntensity={0.6}
        />
        <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="glass-dark border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden"
        >
          {/* Top accent glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-brand-cyan blur-lg opacity-50" />
          
          <div className="flex flex-col items-center mb-10 text-center">
            <Link href="/" className="mb-8 p-3 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/30 hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-brand-cyan fill-brand-cyan shadow-[0_0_20px_rgba(0,212,255,0.5)]" />
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Create Account</h1>
            <p className="text-slate-500 text-sm font-medium">Join the frontier of energy intelligence</p>
          </div>

          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan/50 mb-6">
                <CheckCircle2 className="w-10 h-10 text-brand-cyan" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Compte créé !</h2>
              <p className="text-slate-400">Redirection vers la page de connexion...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <AnimatedInput 
                  label="First Name" 
                  placeholder="John" 
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
                <AnimatedInput 
                  label="Last Name" 
                  placeholder="Doe" 
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
              <AnimatedInput 
                label="Username" 
                placeholder="johndoe" 
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <AnimatedInput 
                label="Email Address" 
                placeholder="name@company.com" 
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <AnimatedInput 
                label="Password" 
                placeholder="••••••••" 
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              <div className="flex items-start gap-3 px-1 py-4 border-t border-white/5 mt-4">
                 <div className="mt-1 w-5 h-5 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center shrink-0">
                    <Shield className="w-2.5 h-2.5 text-brand-cyan" />
                 </div>
                 <p className="text-[10px] text-slate-500 leading-normal">
                    By creating an account, you agree to our <Link href="#" className="text-white hover:text-brand-cyan">Terms of Service</Link> and <Link href="#" className="text-white hover:text-brand-cyan">Privacy Policy</Link>.
                 </p>
              </div>

              {status === "error" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}

              <PremiumButton 
                className="w-full py-4 text-base" 
                variant="primary"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                {status === "loading" ? "Creating Account..." : "Get Started"}
              </PremiumButton>

              <div className="relative py-4 flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-white/5" />
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Or continue with</span>
                <div className="flex-1 h-[1px] bg-white/5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                    <Globe className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white">Google</span>
                 </button>
                 <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                    <Lock className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white">GitHub</span>
                 </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-white hover:text-brand-cyan transition-colors font-bold border-b border-transparent hover:border-brand-cyan">
              Sign in
            </Link>
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="mt-8 flex justify-center"
        >
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

