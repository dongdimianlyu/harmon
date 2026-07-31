import { Sidebar } from "@/components/layout/sidebar";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell flex">
      <Sidebar />
      <main className="flex-1 min-h-screen relative pt-15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(111,140,255,0.18),_transparent_45%)] opacity-60 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
