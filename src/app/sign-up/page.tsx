"use client";

import Link from "next/link";
import { useCallback } from "react";
import { ArrowLeft, Mail, Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const noise =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E";

export default function SignUpPage() {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(73,108,191,0.35), transparent 35%), radial-gradient(circle at 80% 10%, rgba(96,144,255,0.25), transparent 35%), radial-gradient(circle at 50% 70%, rgba(27,59,121,0.4), rgba(10,14,27,0.9)), linear-gradient(140deg, #0c1020 0%, #0b1530 50%, #060914 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
        style={{ backgroundImage: `url(${noise})` }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10 flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full border border-white/30 bg-white/5 flex items-center justify-center text-sm font-semibold tracking-tight">
              H
            </div>
            <div className="leading-tight">
              <p className="text-sm text-white/80">Harmon</p>
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">College Strategy</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft size={16} /> Back
          </Link>
        </header>

        <div className="rounded-2xl border border-white/25 ring-1 ring-white/15 bg-black/30 backdrop-blur-xl shadow-2xl px-8 py-10 flex flex-col gap-6">
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">Sign Up</p>
            <h1 className="text-3xl font-semibold">Create your account</h1>
            <p className="text-white/70 text-sm">Start your strategy workspace with email or Google.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-white/80">
              Email
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/25 ring-1 ring-white/10 bg-white/5 px-3 py-2 focus-within:border-white/50 focus-within:ring-white/30">
                <Mail size={16} className="text-white/60" />
                <Input type="email" placeholder="you@example.com" className="bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:outline-none" required />
              </div>
            </label>
            <label className="block text-sm font-medium text-white/80">
              Password
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/25 ring-1 ring-white/10 bg-white/5 px-3 py-2 focus-within:border-white/50 focus-within:ring-white/30">
                <Lock size={16} className="text-white/60" />
                <Input type="password" placeholder="••••••••" className="bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:outline-none" required />
              </div>
            </label>
            <Button type="submit" className="w-full mt-1 bg-white text-slate-900 hover:bg-white/90 font-semibold flex items-center justify-center gap-2">
              <UserPlus size={18} />
              Create account
            </Button>
          </form>

          <div className="flex items-center gap-3 text-white/50 text-xs uppercase tracking-[0.18em]">
            <span className="flex-1 h-px bg-white/15" />
            <span>Or continue with</span>
            <span className="flex-1 h-px bg-white/15" />
          </div>

          <Button variant="outline" className="w-full border-white/30 text-white hover:border-white/50 hover:bg-white/10">
            Continue with Google
          </Button>

          <p className="text-center text-sm text-white/70">
            Already have an account? {" "}
            <Link href="/sign-in" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
