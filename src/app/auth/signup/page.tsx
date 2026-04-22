"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PremiumButton from "@/components/ui/PremiumButton";
import AnimatedInput from "@/components/ui/AnimatedInput";
import LaserFlow from "@/components/react-bits/LaserFlow/LaserFlow";
import { Zap, ArrowLeft, Globe, Lock, Shield } from "lucide-react";

export default function SignupPage() {
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

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <AnimatedInput 
                label="First Name" 
                placeholder="John" 
              />
              <AnimatedInput 
                label="Last Name" 
                placeholder="Doe" 
              />
            </div>
            <AnimatedInput 
              label="Email Address" 
              placeholder="name@company.com" 
              type="email"
            />
            <AnimatedInput 
              label="Password" 
              placeholder="••••••••" 
              type="password"
            />

            <div className="flex items-start gap-3 px-1 py-4 border-t border-white/5 mt-4">
               <div className="mt-1 w-5 h-5 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center shrink-0">
                  <Shield className="w-2.5 h-2.5 text-brand-cyan" />
               </div>
               <p className="text-[10px] text-slate-500 leading-normal">
                  By creating an account, you agree to our <Link href="#" className="text-white hover:text-brand-cyan">Terms of Service</Link> and <Link href="#" className="text-white hover:text-brand-cyan">Privacy Policy</Link>.
               </p>
            </div>

            <PremiumButton className="w-full py-4 text-base" variant="primary">
              Get Started
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
