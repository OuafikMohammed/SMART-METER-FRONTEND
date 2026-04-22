"use client";

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import PremiumButton from "@/components/ui/PremiumButton";
import { Check, Zap, Crown, Rocket } from "lucide-react";

const plans = [
  {
    name: "Standard",
    price: "0",
    description: "Ideal for individual residential monitoring.",
    features: ["Real-time basic load data", "Weekly reports", "Email alerts", "1 Device connection"],
    icon: <Zap className="w-6 h-6 text-slate-400" />,
    highlight: false,
  },
  {
    name: "Professional",
    price: "29",
    description: "Complete intelligence for smart homes.",
    features: ["AI Anomaly Detection", "Real-time cost optimization", "Multi-device sync", "SMS & Push alerts", "Exportable data (PDF/CSV)"],
    icon: <Rocket className="w-6 h-6 text-brand-cyan" />,
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Strategic power for residential buildings.",
    features: ["All Pro features", "Building-wide analytics", "Predictive maintenance AI", "Dedicated Support", "API Access"],
    icon: <Crown className="w-6 h-6 text-brand-violet" />,
    highlight: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 relative overflow-hidden bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
          >
            Invest in <span className="text-brand-cyan relative inline-block">
              Efficiency
              <motion.span 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-1 left-0 h-2 bg-brand-cyan/20 -z-10"
              />
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Choose the plan that fits your energy goals. No hidden fees, just pure intelligence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard 
                className={plan.highlight ? "border-brand-cyan/30 scale-105 shadow-[0_0_40px_rgba(0,212,255,0.1)]" : "border-white/5"}
                hoverEffect={true}
              >
                <div className="p-8 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                      {plan.icon}
                    </div>
                    {plan.highlight && (
                      <span className="px-3 py-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 text-[10px] font-black text-brand-cyan uppercase tracking-widest">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mb-8">{plan.description}</p>
                  
                  <div className="mb-8">
                    <span className="text-5xl font-black text-white">
                      {plan.price === "Custom" ? "" : "$"}
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && <span className="text-slate-500 ml-2">/ month</span>}
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-400">
                        <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-emerald-500" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <PremiumButton 
                    variant={plan.highlight ? "primary" : "outline"} 
                    className="w-full"
                    size="lg"
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </PremiumButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative gradient beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-brand-cyan via-brand-violet to-brand-cyan opacity-20" />
    </section>
  );
};

export default PricingSection;
