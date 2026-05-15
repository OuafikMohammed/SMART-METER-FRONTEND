"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PremiumButton from "@/components/ui/PremiumButton";
import AnimatedInput from "@/components/ui/AnimatedInput";
import LaserFlow from "@/components/react-bits/LaserFlow/LaserFlow";
import { Zap, ArrowLeft, Globe, Lock, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const endpoint = `${apiUrl}/api/auth/login/`;

    try {
      console.log(`[Login] Attempting to authenticate to: ${endpoint}`);
      console.log(`[Login] Credentials:`, { username: formData.username, password: '***' });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Include cookies for CORS
      });

      console.log(`[Login] Response status: ${response.status}`);
      console.log(`[Login] Response headers:`, {
        contentType: response.headers.get('content-type'),
        corsOrigin: response.headers.get('access-control-allow-origin'),
      });

      // Check if response content-type is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[Login] Non-JSON response received:', text.substring(0, 200));
        setStatus("error");
        setError(`Erreur serveur (${response.status}): La réponse n'est pas au format JSON. Vérifiez que l'API est correctement configurée.`);
        return;
      }

      const data = await response.json();
      console.log(`[Login] Parsed response data:`, { 
        hasAccess: !!data.access, 
        hasUser: !!data.user,
        userRole: data.user?.role 
      });

      if (response.ok && data.access && data.user) {
        // Store in localStorage before setting state
        localStorage.setItem('sm_token', data.access);
        localStorage.setItem('sm_user', JSON.stringify(data.user));
        
        // Update auth context
        login(data.access, data.user);
        
        setStatus("idle");
        console.log(`[Login] Login successful, redirecting to ${data.user.role === 'ADMIN' ? '/admin' : '/dashboard'}`);
        
        // Small delay to ensure state is updated before redirect
        setTimeout(() => {
          if (data.user.role === 'ADMIN') {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }, 100);
      } else {
        setStatus("error");
        const errorMsg = data.detail || data.message || "Identifiants incorrects. Veuillez réessayer.";
        console.error('[Login] Authentication failed:', { status: response.status, errorMsg, data });
        setError(errorMsg);
      }
    } catch (err) {
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('[Login] Exception caught:', { 
        message: errorMessage, 
        error: err,
        apiUrl,
      });
      
      // Provide more specific error messages
      if (errorMessage.includes('Failed to fetch')) {
        setError("Impossible de se connecter au serveur. Vérifiez que:\n1. Le serveur API est en cours d'exécution sur " + apiUrl + "\n2. CORS est activé\n3. Votre firewall autorise la connexion");
      } else if (errorMessage.includes('JSON')) {
        setError("Le serveur a retourné une réponse invalide. Vérifiez les logs du serveur.");
      } else {
        setError(`Erreur de connexion: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-brand-dark overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <LaserFlow
          color="#8B5CF6"
          wispDensity={0.5}
          flowSpeed={0.2}
          fogIntensity={0.6}
        />
        <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="glass-dark border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden"
        >
          {/* Top accent glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-brand-violet blur-lg opacity-50" />
          
          <div className="flex flex-col items-center mb-10">
            <Link href="/" className="mb-8 p-3 rounded-2xl bg-brand-violet/20 border border-brand-violet/30 hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-brand-violet fill-brand-violet shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm font-medium">Access your energy intelligence panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatedInput 
              label="Username or Email" 
              placeholder="Username" 
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <div className="space-y-1">
              <AnimatedInput 
                label="Password" 
                placeholder="••••••••" 
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div className="flex justify-end">
                <Link href="#" className="text-xs text-brand-violet hover:text-white transition-colors font-bold">
                  Forgot password?
                </Link>
              </div>
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
              variant="secondary"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {status === "loading" ? "Signing In..." : "Sign In"}
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

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-white hover:text-brand-violet transition-colors font-bold border-b border-transparent hover:border-brand-violet">
              Create account
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

