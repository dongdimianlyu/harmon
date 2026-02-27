import { Sidebar } from "@/components/layout/sidebar";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell flex min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-foreground)]">
      <Sidebar />
      <main className="flex-1 w-full pt-24 px-6 sm:px-8 md:px-12 pb-20 relative">
        {/* Ambient Neumorphic Background */}
        <div className="pointer-events-none fixed top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full shadow-neumorph-inset-deep opacity-30 animate-float" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
