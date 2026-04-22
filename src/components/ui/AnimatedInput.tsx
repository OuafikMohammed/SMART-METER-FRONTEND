"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 group">
        {label && (
          <label className="block text-sm font-medium text-slate-400 group-focus-within:text-brand-cyan transition-colors duration-300">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-all duration-300",
              "focus:border-brand-cyan/50 focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(0,212,255,0.1)]",
              error && "border-red-500/50 focus:border-red-500/50 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)]",
              className
            )}
            {...props}
          />
          {/* Animated focus border line bottom */}
          <motion.div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-brand-cyan"
            initial={{ width: 0, opacity: 0 }}
            whileFocus={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export default AnimatedInput;
