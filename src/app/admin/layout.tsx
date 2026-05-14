"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (user && user.role !== 'ADMIN') {
      router.push("/dashboard");
    } else {
      setIsCheckingAuth(false);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-dark">
        <Loader2 className="w-10 h-10 text-brand-cyan animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-8 relative">
           {children}
        </main>
      </div>
    </div>
  );
}

