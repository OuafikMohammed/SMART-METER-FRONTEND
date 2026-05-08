"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  glowColor?: string;
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant = "primary", size = "md", children, glowColor = "rgba(0, 212, 255, 0.5)", ...props }, ref) => {
    const variants = {
      primary: "bg-brand-cyan text-brand-dark font-bold hover:shadow-[0_0_20px_rgba(0,212,255,0.6)]",
      secondary: "bg-brand-violet text-white font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]",
      outline: "border border-brand-border bg-transparent text-white hover:bg-white/5 hover:border-brand-cyan/50",
      ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-3.5 text-base",
      xl: "px-10 py-4 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative overflow-hidden rounded-full transition-all duration-300 flex items-center justify-center gap-2 group",
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as any)}
      >
        {/* Shine effect on hover */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        
        {/* Glow behind the button */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
          style={{ backgroundColor: glowColor }}
        />
        
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

PremiumButton.displayName = "PremiumButton";

export default PremiumButton;
