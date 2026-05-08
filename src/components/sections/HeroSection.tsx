"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import PremiumButton from "@/components/ui/PremiumButton";
import LaserFlow from "@/components/react-bits/LaserFlow/LaserFlow";
import AuthModal from "@/components/auth/AuthModal";
import { ArrowRight, Zap, Shield, BarChart3, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout, user } = useAuth();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"login" | "signup">("signup");

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scale and rotate for "exploded view"
  const dashScale = useTransform(smoothProgress, [0, 0.4], [0.8, 1]);
  const dashRotateX = useTransform(smoothProgress, [0, 0.4], [15, 0]);
  const dashY = useTransform(smoothProgress, [0, 0.4], [50, 0]);
  const dashOpacity = useTransform(smoothProgress, [0, 0.2], [0.5, 1]);

  // Parallax elements for the exploded view
  const layer1Y = useTransform(smoothProgress, [0, 0.4], [100, 0]);
  const layer2Y = useTransform(smoothProgress, [0, 0.4], [-100, 0]);
  const layer3Y = useTransform(smoothProgress, [0, 0.4], [200, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[150vh] w-full flex flex-col items-center"
    >
    

      {/* Main Content (Hero Text) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-40 pb-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 w-fit mb-6 backdrop-blur-md"
          >
            <Zap className="w-4 h-4 text-brand-cyan fill-brand-cyan" />
            <span className="text-xs font-bold tracking-wider text-brand-cyan uppercase">AI-Powered Energy Intelligence</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-display font-black leading-tight tracking-tighter mb-8"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">POWERING THE</span> <br />
            <span className="text-brand-cyan italic relative inline-block">
              FUTURE
              <motion.span 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-2 left-0 h-2 bg-brand-cyan/20 -z-10"
              />
            </span> 
            <span className="bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent"> OF ENERGY.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed"
          >
            Real-time data, anomaly detection, and AI-driven optimizations. 
            Transform your energy consumption into a strategic asset.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 glass-dark px-4 py-2 rounded-full border border-brand-cyan/20">
                  <div className="w-8 h-8 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan font-bold">
                    {user?.username[0].toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{user?.fullName || user?.username}</span>
                </div>
                <div className="flex gap-4">
                  <PremiumButton size="xl" onClick={() => window.location.href = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}>
                    Accéder au Dashboard
                  </PremiumButton>
                  <button 
                    onClick={logout}
                    className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest px-4"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <>
                <PremiumButton size="xl" onClick={() => openAuth("signup")}>
                  Commencer
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </PremiumButton>
                <PremiumButton variant="outline" size="xl" onClick={() => openAuth("login")}>
                  <LogIn className="w-5 h-5 mr-2" />
                  Se connecter
                </PremiumButton>
              </>
            )}
          </motion.div>

          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
            initialMode={authMode} 
          />
        </motion.div>

        {/* Right Side: Live Metrics Widget */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="hidden lg:flex flex-col gap-6 w-full max-w-md relative"
        >
          {/* Decorative glow behind the widget */}
          <div className="absolute -inset-10 bg-brand-cyan/5 blur-[80px] rounded-full -z-10" />
          
          <div className="glass-dark p-6 rounded-[2rem] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent opacity-50" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-white font-display font-bold text-xl tracking-tight">System Live Feed</h3>
                  <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mt-1">Node: EU-WEST-PRIME</p>
                </div>
                <div className="flex items-center gap-2 bg-brand-cyan/10 px-3 py-1.5 rounded-full border border-brand-cyan/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
                  </span>
                  <span className="text-brand-cyan text-[10px] font-black tracking-widest">LIVE</span>
                </div>
              </div>

              <div className="space-y-8">
                {/* Metric 1: Grid Load */}
                <div>
                  <div className="flex justify-between text-xs mb-3">
                    <span className="text-slate-400 font-medium uppercase tracking-wider">Current Grid Load</span>
                    <span className="text-white font-mono font-bold">84.2 kW</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "84.2%" }}
                      transition={{ duration: 2, delay: 1, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-brand-cyan via-brand-cyan to-brand-violet rounded-full shadow-[0_0_15px_rgba(0,212,255,0.4)] relative"
                    >
                      <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Metric 2: Grid Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 hover:border-brand-cyan/30 transition-colors group/card">
                    <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-2 group-hover/card:text-brand-cyan transition-colors">Active Nodes</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-display font-bold text-white tracking-tighter">1,284</span>
                      <span className="text-brand-cyan text-[10px] font-bold">+12%</span>
                    </div>
                  </div>
                  <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 hover:border-brand-violet/30 transition-colors group/card">
                    <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-2 group-hover/card:text-brand-violet transition-colors">AI Efficiency</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-display font-bold text-white tracking-tighter">99.2</span>
                      <span className="text-brand-violet text-[10px] font-bold">%</span>
                    </div>
                  </div>
                </div>

                {/* Optimization Status */}
                <div className="pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-cyan/5 border border-brand-cyan/10">
                    <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-white text-[11px] font-bold">Protocol Alpha Active</p>
                        <p className="text-brand-cyan text-[9px] font-black uppercase tracking-tighter underline decoration-brand-cyan/30 underline-offset-2">Optimizing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Carbon Offset Card */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex gap-4 self-end -mr-8"
          >
            <div className="glass-dark py-3 px-5 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl">
              <div className="w-8 h-8 rounded-full bg-brand-violet/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-brand-violet" />
              </div>
              <div>
                <p className="text-white font-bold text-[11px] leading-tight">Carbon Offset</p>
                <p className="text-slate-500 text-[10px] font-medium leading-tight">12.4 Tons / Mo</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Exploded Dashboard View Container */}
      <div className="relative w-full max-w-6xl mx-auto px-6 mt-[-20vh] pb-32">
        <motion.div
          style={{
            scale: dashScale,
            rotateX: dashRotateX,
            y: dashY,
            opacity: dashOpacity,
            perspective: 1200
          }}
          className="w-full aspect-video glass-dark rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden p-8"
        >
          {/* Main Dashboard UI Mockup */}
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Sidebar Mockup */}
            <div className="col-span-1 flex flex-col gap-8 items-center border-r border-white/5 pr-4">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/30" />
              <div className="w-8 h-8 rounded-lg bg-white/5" />
              <div className="w-8 h-8 rounded-lg bg-white/5" />
              <div className="w-8 h-8 rounded-lg bg-white/5" />
            </div>

            {/* Main Content Mockup */}
            <div className="col-span-11 space-y-8">
              <div className="flex justify-between items-center">
                <div className="h-8 w-48 bg-white/5 rounded-lg" />
                <div className="h-10 w-10 rounded-full bg-white/5" />
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i}
                    style={{ y: i === 1 ? layer1Y : i === 2 ? layer2Y : layer3Y }}
                    className="h-32 rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between"
                  >
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-8 w-32 bg-brand-cyan/40 rounded shadow-[0_0_20px_rgba(0,212,255,0.2)]" />
                  </motion.div>
                ))}
              </div>

              {/* Large Chart */}
              <div className="h-64 rounded-2xl bg-white/5 border border-white/10 p-6 relative">
                 <div className="flex justify-between mb-4">
                    <div className="h-4 w-32 bg-white/10 rounded" />
                    <div className="flex gap-2">
                       <div className="h-4 w-12 bg-white/5 rounded" />
                       <div className="h-4 w-12 bg-white/5 rounded" />
                    </div>
                 </div>
                 {/* Decorative Chart Lines */}
                 <svg className="w-full h-40 opacity-30" preserveAspectRatio="none" viewBox="0 0 400 100">
                    <path d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,10" fill="none" stroke="#00D4FF" strokeWidth="2" />
                    <path d="M0,90 Q70,40 140,60 T280,20 T400,50" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.5" />
                 </svg>

                 {/* "Floating" UI Element for Exploded View */}
                 <motion.div 
                    style={{ y: layer1Y, x: 20 }}
                    className="absolute -right-8 -top-8 w-48 p-4 glass rounded-xl border border-brand-cyan/30 shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-brand-cyan" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Security Node</span>
                    </div>
                    <div className="h-1.5 w-full bg-brand-cyan/20 rounded-full overflow-hidden">
                       <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="h-full w-1/3 bg-brand-cyan shadow-[0_0_10px_#00D4FF]" 
                       />
                    </div>
                 </motion.div>

                 <motion.div 
                    style={{ y: layer2Y, x: -40 }}
                    className="absolute -left-12 bottom-12 w-48 p-4 glass rounded-xl border border-brand-violet/30 shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-brand-violet" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Real-time Load</span>
                    </div>
                    <div className="flex items-end gap-1 h-8">
                       {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.6].map((h, i) => (
                         <div key={i} className="flex-1 bg-brand-violet/50 rounded-sm" style={{ height: `${h*100}%` }} />
                       ))}
                    </div>
                 </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Glow Trails */}
      <div className="absolute top-1/2 left-0 w-1/3 h-[500px] bg-brand-cyan/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-0 w-1/2 h-[600px] bg-brand-violet/5 blur-[150px] rounded-full pointer-events-none -z-10" />
    </section>
  );
};

export default HeroSection;
