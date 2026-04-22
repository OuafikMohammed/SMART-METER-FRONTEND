"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PremiumButton from "@/components/ui/PremiumButton";
import AnimatedInput from "@/components/ui/AnimatedInput";
import LaserFlow from "@/components/react-bits/LaserFlow/LaserFlow";
import { Zap, ArrowLeft, Globe, Lock } from "lucide-react";

export default function LoginPage() {
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

          <div className="space-y-6">
            <AnimatedInput 
              label="Email Address" 
              placeholder="name@company.com" 
              type="email"
            />
            <div className="space-y-1">
              <AnimatedInput 
                label="Password" 
                placeholder="••••••••" 
                type="password"
              />
              <div className="flex justify-end">
                <Link href="#" className="text-xs text-brand-violet hover:text-white transition-colors font-bold">
                  Forgot password?
                </Link>
              </div>
            </div>

            <PremiumButton className="w-full py-4 text-base" variant="secondary">
              Sign In
            </PremiumButton>

            <div className="relative py-4 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-white/5" />
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Or continue with</span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                  <Globe className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white">Google</span>
               </button>
               <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                  <Lock className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white">GitHub</span>
               </button>
            </div>
          </div>

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
