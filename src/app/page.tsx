import Link from "next/link";
import { ArrowRight, Search, Target, Brain, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Well } from "@/components/ui/well";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden font-sans">
      {/* Decorative Neumorphic Background Elements */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full shadow-neumorph-inset-deep opacity-60 animate-float" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full shadow-neumorph opacity-40 animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-center bg-[var(--color-background)]/70 backdrop-blur-xl border-b border-white/10">
        <div className="w-full max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl shadow-neumorph flex items-center justify-center text-xl font-display font-extrabold text-[var(--color-accent)]">
              H
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-lg font-bold text-[var(--color-foreground)] tracking-tight font-display">Harmon</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">College Strategy</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/sign-in" className="hidden sm:block text-sm font-bold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up">
              <Button variant="primary" size="md">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 w-full pt-40 pb-32 px-6 flex flex-col items-center justify-center text-center gap-10 max-w-7xl mx-auto">
        <Badge variant="accent" className="mb-2">
          <Star className="w-3 h-3 mr-1.5 inline-block fill-current" /> Backed by Y Combinator
        </Badge>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-display max-w-4xl leading-[1.15]">
          Where Ambitious <br className="hidden sm:block" />
          <span className="text-[var(--color-accent)]">Teens Get Discovered</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-[var(--color-muted)] leading-relaxed font-medium">
          Instantly evaluate your profile and pair it with opportunities—internships, research, mentorship, and more. 
          Get realistic feedback and take the next step. For free.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
          <Link href="/sign-up">
            <Button size="lg" className="group">
              Start Free Evaluation
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="secondary">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-4 mt-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">Engineers from</p>
          <div className="flex items-center gap-10 text-[var(--color-foreground)] font-display font-bold text-2xl">
            <span className="opacity-80">Google</span>
            <span className="opacity-80">OpenAI</span>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 mt-32 text-left">
          {/* Card 1 */}
          <Card padding="lg" hoverable className="group flex flex-col items-center text-center">
            <Well depth="deep" className="w-24 h-24 rounded-full flex items-center justify-center mb-8 bg-[var(--color-background)]">
              <Search className="w-10 h-10 text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-500 ease-out" />
            </Well>
            <h3 className="text-2xl font-bold font-display mb-4 text-[var(--color-foreground)]">Discover Opportunities</h3>
            <p className="text-[var(--color-muted)] font-medium leading-relaxed">Find internships, research programs, and mentorships perfectly matched to your unique profile and goals.</p>
          </Card>

          {/* Card 2 */}
          <Card padding="lg" hoverable className="group flex flex-col items-center text-center">
            <Well depth="deep" className="w-24 h-24 rounded-full flex items-center justify-center mb-8 bg-[var(--color-background)]">
              <Target className="w-10 h-10 text-[var(--color-accent-secondary)] group-hover:scale-110 transition-transform duration-500 ease-out" />
            </Well>
            <h3 className="text-2xl font-bold font-display mb-4 text-[var(--color-foreground)]">Strategic Feedback</h3>
            <p className="text-[var(--color-muted)] font-medium leading-relaxed">Get realistic, AI-powered insights to strengthen your college application strategy and stand out.</p>
          </Card>

          {/* Card 3 */}
          <Card padding="lg" hoverable className="group flex flex-col items-center text-center">
            <Well depth="deep" className="w-24 h-24 rounded-full flex items-center justify-center mb-8 bg-[var(--color-background)]">
              <Brain className="w-10 h-10 text-[var(--color-accent-light)] group-hover:scale-110 transition-transform duration-500 ease-out" />
            </Well>
            <h3 className="text-2xl font-bold font-display mb-4 text-[var(--color-foreground)]">AI Consultant</h3>
            <p className="text-[var(--color-muted)] font-medium leading-relaxed">Replace expensive college consultants with instant, data-driven admissions intelligence at your fingertips.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
