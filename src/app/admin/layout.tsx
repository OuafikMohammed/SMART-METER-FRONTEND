"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const sidebarItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin" },
  { icon: <BarChart3 size={20} />, label: "Analytics", href: "/admin/analytics" },
  { icon: <Cpu size={20} />, label: "Nodes", href: "/admin/nodes" },
  { icon: <ShieldCheck size={20} />, label: "Anomalies", href: "/admin/anomalies" },
  { icon: <Bell size={20} />, label: "Alerts", href: "/admin/alerts" },
  { icon: <Settings size={20} />, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="relative z-50 glass-dark border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out"
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 overflow-hidden">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan flex items-center justify-center shrink-0">
               <Zap size={20} className="text-brand-dark fill-brand-dark" />
            </div>
            {isSidebarOpen && (
              <span className="font-display font-black text-xl text-white tracking-tighter">SMARTMETER</span>
            )}
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
          {sidebarItems.map((item) => {
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
                {isSidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
                {isActive && isSidebarOpen && (
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
           <button className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all group">
              <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
              {isSidebarOpen && <span className="font-bold text-sm">Logout</span>}
           </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-20 glass-dark border-b border-white/5 flex items-center justify-between px-8 relative z-40">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h2 className="text-white font-bold text-lg hidden sm:block">
                {sidebarItems.find(item => item.href === pathname)?.label || "Overview"}
              </h2>
           </div>

           <div className="flex items-center gap-6">
              <div className="relative group hidden sm:block">
                 <input 
                    type="text" 
                    placeholder="Search metrics..." 
                    className="bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm text-white placeholder:text-slate-600 outline-none w-64 focus:border-brand-cyan/50 transition-all"
                 />
              </div>
              <div className="flex items-center gap-3 border-l border-white/5 pl-6">
                 <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-white">Alex Johnson</p>
                    <p className="text-[10px] text-brand-cyan uppercase tracking-widest font-black">Admin</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet p-[2px]">
                    <div className="w-full h-full rounded-full bg-brand-dark border-2 border-brand-dark overflow-hidden">
                       <img src="https://i.pravatar.cc/100?u=admin" alt="User avatar" />
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
           {children}
        </main>
      </div>
    </div>
  );
}
