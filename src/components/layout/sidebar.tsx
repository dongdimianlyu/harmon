"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  FlaskConical,
  PenTool,
  TrendingUp,
} from "lucide-react";
import { Well } from "@/components/ui/well";

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/profile", label: "My Profile", icon: User },
  { href: "/app/strategy", label: "Strategy Lab", icon: FlaskConical },
  { href: "/app/writing", label: "Writing Studio", icon: PenTool },
  { href: "/app/growth", label: "Growth Tracker", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-xl border-b-2 border-transparent shadow-[0_4px_30px_rgba(163,177,198,0.2)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl shadow-neumorph flex items-center justify-center">
            <span className="text-[var(--color-accent)] text-xl font-display font-extrabold">H</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-muted)]">Harmon</p>
            <p className="text-sm text-[var(--color-foreground)] font-bold tracking-tight font-display">Admissions Intelligence</p>
          </div>
        </div>

        <nav className="flex items-center gap-2 p-1.5 rounded-2xl shadow-neumorph-inset bg-[var(--color-background)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                  isActive
                    ? "bg-[var(--color-background)] text-[var(--color-accent)] shadow-neumorph"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background)] hover:shadow-neumorph-sm"
                )}
              >
                <Icon size={18} strokeWidth={2} className={cn(isActive && "text-[var(--color-accent)]")} />
                <span className="hidden md:inline-block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-[var(--color-foreground)] font-bold font-display">Alex Chen</p>
            <p className="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-widest">Class of 2026</p>
          </div>
          <Well depth="deep" className="w-12 h-12 p-0 flex items-center justify-center rounded-full">
            <span className="text-[var(--color-accent)] text-sm font-bold font-display tracking-tight">AC</span>
          </Well>
        </div>
      </div>
    </header>
  );
}
