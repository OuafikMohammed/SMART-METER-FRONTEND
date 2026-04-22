"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import PremiumButton from "@/components/ui/PremiumButton";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const messages = [
  { role: "bot", content: "Hello! I've analyzed your energy usage for the last 24 hours. Would you like to see the optimization report?" },
  { role: "user", content: "Yes, please show me where I can save energy." },
  { role: "bot", content: "I found that your HVAC system is running at 100% capacity during peak hours. By shifting usage by 2 hours, you could save approximately 15% on your next bill." },
  { role: "user", content: "That sounds great! Can you automate that for me?" },
  { role: "bot", content: "Absolutely. I've scheduled the optimization. You'll see the results in your dashboard tomorrow." },
];

const AIChatSection = () => {
  const [visibleMessages, setVisibleMessages] = useState<typeof messages>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const showNextMessage = (index: number) => {
      if (index >= messages.length) return;

      if (messages[index].role === "bot") {
        setTyping(true);
        timeout = setTimeout(() => {
          setTyping(false);
          setVisibleMessages((prev) => [...prev, messages[index]]);
          setTimeout(() => showNextMessage(index + 1), 2000);
        }, 1500);
      } else {
        timeout = setTimeout(() => {
          setVisibleMessages((prev) => [...prev, messages[index]]);
          setTimeout(() => showNextMessage(index + 1), 1000);
        }, 1000);
      }
    };

    showNextMessage(0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-brand-violet" />
            <span className="text-xs font-bold text-brand-violet uppercase">Intelligence Layer</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
          >
            Your AI Energy <br />
            <span className="text-brand-violet italic text-glow-purple relative inline-block">
              Assistant
              <motion.span 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute bottom-1 left-0 h-2 bg-brand-violet/20 -z-10"
              />
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg mb-8 max-w-lg"
          >
            Interact with our advanced AI to get personalized insights, 
            automate savings, and solve anomalies instantly through natural conversation.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PremiumButton variant="secondary" size="lg">
              Talk to AI
            </PremiumButton>
          </motion.div>
        </div>

        <div className="relative">
          {/* Decorative background glow */}
          <div className="absolute -inset-4 bg-brand-violet/10 blur-[60px] rounded-[2rem] -z-10" />
          
          <GlassCard className="h-[500px] flex flex-col border-brand-violet/10">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-violet/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-brand-violet" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Energy AI</h4>
                  <p className="text-[10px] text-brand-violet font-bold uppercase tracking-widest">Active Now</p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide">
              <AnimatePresence initial={false}>
                {visibleMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      msg.role === "user" ? "bg-white/10" : "bg-brand-violet/20"
                    )}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-brand-violet" />}
                    </div>
                    <div className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user" 
                        ? "bg-brand-violet text-white rounded-tr-none shadow-lg shadow-brand-violet/20" 
                        : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {typing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-violet/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-brand-violet" />
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl rounded-tl-none flex gap-1">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-brand-violet rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-violet rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-violet rounded-full" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Input Mockup */}
            <div className="p-4 bg-white/5 border-t border-white/5">
              <div className="relative">
                <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-500 italic">
                  Ask me about your energy optimization...
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand-violet/20 flex items-center justify-center">
                  <Send className="w-4 h-4 text-brand-violet" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default AIChatSection;
