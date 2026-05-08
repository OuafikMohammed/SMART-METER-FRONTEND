"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  BarChart3, 
  LayoutDashboard, 
  Zap, 
  Settings, 
  Bell, 
  Cpu, 
  ShieldCheck, 
  LogOut,
  Menu,
  X,
  History,
  MessageSquare,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const adminItems = [
  { icon: <LayoutDashboard size={20} />, label: "Overview", href: "/admin" },
  { icon: <BarChart3 size={20} />, label: "Consommations", href: "/admin/analytics" },
  { icon: <Cpu size={20} />, label: "Foyers", href: "/admin/nodes" },
  { icon: <ShieldCheck size={20} />, label: "Anomalies", href: "/admin/anomalies" },
  { icon: <Bell size={20} />, label: "Alertes", href: "/admin/alerts" },
  { icon: <Settings size={20} />, label: "Configuration", href: "/admin/settings" },
];

const residentItems = [
  { icon: <LayoutDashboard size={20} />, label: "Ma Consommation", href: "/dashboard" },
  { icon: <History size={20} />, label: "Historique", href: "/dashboard/history" },
  { icon: <MessageSquare size={20} />, label: "Assistant IA", href: "/dashboard/ai" },
  { icon: <Bell size={20} />, label: "Mes Alertes", href: "/dashboard/alerts" },
  { icon: <Settings size={20} />, label: "Paramètres", href: "/dashboard/settings" },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const items = user?.role === "ADMIN" ? adminItems : residentItems;

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      className="relative z-50 glass-dark border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out h-full"
    >
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/5 overflow-hidden">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-cyan flex items-center justify-center shrink-0">
             <Zap size={20} className="text-brand-dark fill-brand-dark" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-display font-black text-xl text-white tracking-tighter"
              >
                SMARTMETER
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Sidebar Nav */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" 
                  : "text-slate-500 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className={cn(
                  "shrink-0 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110"
              )}>
                {item.icon}
              </div>
              {isOpen && <span className="font-bold text-sm">{item.label}</span>}
              {isActive && isOpen && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#00D4FF]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/5">
         <button 
           onClick={handleLogout}
           className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all group"
         >
            <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
            {isOpen && <span className="font-bold text-sm">Déconnexion</span>}
         </button>
      </div>
    </motion.aside>
  );
}
