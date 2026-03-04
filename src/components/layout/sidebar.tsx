"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  Zap,
  Activity,
  Network,
} from "lucide-react";

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/positioning", label: "Positioning", icon: Target },
  { href: "/app/execution", label: "Execution", icon: Zap },
  { href: "/app/signal", label: "Signal", icon: Activity },
  { href: "/app/narrative", label: "Narrative", icon: Network },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-black text-sm font-bold">H</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Harmon</p>
            <p className="text-sm text-white font-semibold">Admissions Intelligence</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition",
                  isActive
                    ? "bg-white text-black shadow-lg"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                <Icon size={16} strokeWidth={1.6} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-white font-medium">Alex Chen</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Class of 2026</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-white text-xs font-medium">AC</span>
          </div>
        </div>
      </div>
    </header>
  );
}

