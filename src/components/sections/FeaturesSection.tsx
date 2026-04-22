"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, BarChart3, Cpu, Globe, Rocket } from "lucide-react";

const features = [
  {
    title: "Real-time Monitoring",
    description: "Instantaneous data processing with sub-second latency for precise energy tracking.",
    icon: <BarChart3 className="w-6 h-6 text-brand-cyan" />,
    color: "cyan",
  },
  {
    title: "AI-Driven Insights",
    description: "Advanced machine learning algorithms predict consumption patterns and suggest optimizations.",
    icon: <Cpu className="w-6 h-6 text-brand-violet" />,
    color: "violet",
  },
  {
    title: "Anomaly Detection",
    description: "Automatic identification of energy leakage and unusual consumption behavior in real-time.",
    icon: <Shield className="w-6 h-6 text-brand-cyan" />,
    color: "cyan",
  },
  {
    title: "Global Scalability",
    description: "Deploy across multiple facilities and regions with seamless data synchronization.",
    icon: <Globe className="w-6 h-6 text-brand-violet" />,
    color: "violet",
  },
  {
    title: "Intelligent Automation",
    description: "Smart triggers and automated responses based on grid conditions and pricing.",
    icon: <Zap className="w-6 h-6 text-brand-cyan" />,
    color: "cyan",
  },
  {
    title: "Future-Proof Tech",
    description: "Built on modern architecture to scale with your evolving energy needs.",
    icon: <Rocket className="w-6 h-6 text-brand-violet" />,
    color: "violet",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative bg-brand-dark overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-violet/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
          >
            <Zap className="w-4 h-4 text-brand-cyan fill-brand-cyan" />
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Core Capabilities</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-black text-white mb-6 tracking-tight"
          >
            Engineered for <span className="text-brand-cyan italic">Intelligence.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Our platform combines cutting-edge AI with cinematic data visualization to give you unprecedented control over your energy ecosystem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative p-8 rounded-3xl glass border border-white/5 hover:border-white/20 transition-all duration-300"
            >
              {/* Feature Icon Background Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                feature.color === "cyan" ? "bg-brand-cyan/20" : "bg-brand-violet/20"
              }`} />

              <div className="mb-6 relative">
                 <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-white/20 transition-all duration-300">
                    {feature.icon}
                 </div>
                 {/* Highlighting Animation on scroll/view */}
                 <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                    className={`absolute -bottom-2 left-0 h-[1px] ${
                      feature.color === "cyan" ? "bg-brand-cyan/50" : "bg-brand-violet/50"
                    }`}
                 />
              </div>

              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-glow transition-all duration-300">
                {feature.title}
              </h3>
              
              <p className="text-slate-500 leading-relaxed group-hover:text-slate-300 transition-colors">
                {feature.description}
              </p>

              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-brand-cyan transition-colors cursor-pointer">
                LEARN MORE
                <div className="w-4 h-px bg-slate-700 group-hover:w-8 group-hover:bg-brand-cyan transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
