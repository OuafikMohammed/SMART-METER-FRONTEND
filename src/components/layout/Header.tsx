"use client";

import React from "react";
import { Menu, X, Bell, Search, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Map path to title
  const getTitle = () => {
    if (pathname.startsWith('/admin')) return "Administration";
    if (pathname.startsWith('/dashboard')) return "Tableau de Bord";
    return "SmartMeter";
  };

  return (
    <header className="h-20 glass-dark border-b border-white/5 flex items-center justify-between px-8 relative z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h2 className="text-white font-bold text-lg hidden sm:block">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden sm:block">
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm text-white placeholder:text-slate-600 outline-none w-64 focus:border-brand-cyan/50 transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        </div>
        
        <div className="flex items-center gap-3 border-l border-white/5 pl-6">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-white">{user?.fullName || user?.username}</p>
            <p className="text-[10px] text-brand-cyan uppercase tracking-widest font-black">
              {user?.role === 'ADMIN' ? 'Administrateur' : 'Résident'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet p-[2px]">
            <div className="w-full h-full rounded-full bg-brand-dark border-2 border-brand-dark flex items-center justify-center overflow-hidden">
              {user?.role === 'ADMIN' ? (
                <img src={`https://i.pravatar.cc/100?u=${user?.username}`} alt="Avatar" />
              ) : (
                <User size={20} className="text-slate-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
