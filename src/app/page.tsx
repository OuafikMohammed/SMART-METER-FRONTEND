"use client";

import FeaturesSection from "@/components/sections/FeaturesSection";
import HeroSection from "@/components/sections/HeroSection";
import DashboardPreview from "@/components/sections/DashboardPreview";
import AIChatSection from "@/components/sections/AIChatSection";
import AnomalySection from "@/components/sections/AnomalySection";
import PricingSection from "@/components/sections/PricingSection";
import Link from "next/link";
import PremiumButton from "@/components/ui/PremiumButton";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark text-slate-200 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 z-[100] w-full p-6 backdrop-blur-md bg-brand-dark/10 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-display font-black text-2xl tracking-tighter cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.5)] group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-brand-dark fill-brand-dark" />
            </div>
            <span className="text-glow">SMARTMETER</span>
          </div>
          
          <div className="hidden md:flex gap-8 items-center mr-8">
            <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
            <Link href="#dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Link href={user?.role === 'ADMIN' ? "/admin" : "/dashboard"}>
                  <PremiumButton variant="ghost" size="md">
                    Dashboard
                  </PremiumButton>
                </Link>
                <PremiumButton size="md" onClick={logout}>
                  Sign Out
                </PremiumButton>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <PremiumButton variant="ghost" size="md">
                    Log In
                  </PremiumButton>
                </Link>
                <Link href="/auth/signup">
                  <PremiumButton size="md">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </PremiumButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full relative">
        <HeroSection />
        
        {/* Secondary Section - Stats/Trust */}
        <section className="py-24 relative z-10 bg-brand-dark">
           <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-20">
              {[
                { label: "Average Savings", value: "35%" },
                { label: "Data Processing", value: "Real-time" },
                { label: "Accuracy Rate", value: "99.9%" },
                { label: "AI Monitoring", value: "24/7", color: "text-brand-cyan" }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center group"
                >
                   <h2 className={`text-5xl font-black mb-2 relative inline-block ${stat.color || 'text-white'}`}>
                    {stat.value}
                    <motion.span 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + idx * 0.1, duration: 0.8 }}
                      className="absolute bottom-1 left-0 h-2 bg-white/10 -z-10 group-hover:bg-brand-cyan/20 transition-colors"
                    />
                   </h2>
                   <p className="text-slate-500 font-medium">{stat.label}</p>
                </motion.div>
              ))}
           </div>
        </section>

        <FeaturesSection />

        <DashboardPreview />
        
        <AIChatSection />

        <AnomalySection />
        
        <PricingSection />
      </main>




      
      <footer className="relative z-10 border-t border-white/5 py-12 bg-brand-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2 text-white font-display font-black text-xl tracking-tighter">
             <Zap className="w-5 h-5 text-brand-cyan fill-brand-cyan" />
             SMARTMETER
           </div>
           <p className="text-slate-500 text-sm">© {new Date().getFullYear()} SMARTMETER. Designed for the future of energy.</p>
           <div className="flex gap-6">
              <Link href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="text-slate-500 hover:text-white transition-colors">Terms</Link>
           </div>
        </div>
        {/* Decorative background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-brand-cyan/5 blur-[100px] rounded-full pointer-events-none" />
      </footer>
    </div>
  );
}

