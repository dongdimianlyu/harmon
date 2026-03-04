import Link from "next/link";
import { ArrowRight, Star, Target, BarChart3, BookOpen, Lightbulb, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import { Geist, Instrument_Serif } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const features = [
  {
    title: "Profile Evaluation",
    description: "Get a realistic, data-driven assessment of your current admissions standing.",
    icon: <BarChart3 className="w-6 h-6 text-slate-900" />,
  },
  {
    title: "Opportunity Matching",
    description: "Discover internships, research, and awards that align with your unique narrative.",
    icon: <Target className="w-6 h-6 text-slate-900" />,
  },
  {
    title: "Narrative Strategy",
    description: "Develop a cohesive 'spike' that helps you stand out in the applicant pool.",
    icon: <BookOpen className="w-6 h-6 text-slate-900" />,
  },
  {
    title: "Actionable Insights",
    description: "Receive step-by-step guidance on what to do next to improve your positioning.",
    icon: <Lightbulb className="w-6 h-6 text-slate-900" />,
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 overflow-hidden">
      {/* Background Video */}
      <div className="absolute top-0 left-0 right-0 h-screen z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover [transform:scaleY(-1)]"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-white" />
      </div>

      <header className="relative z-10 w-full px-6 pt-8 flex items-center justify-center">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-sm font-semibold tracking-tight">
              H
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-slate-900">Harmon</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Link
              href="/sign-in"
              className="px-4 py-2 rounded-full text-slate-600 hover:text-slate-900 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full flex flex-col items-center">
        {/* Hero Section */}
        <div className="w-full min-h-[calc(100vh-80px)] max-w-[1200px] pt-[290px] px-6 flex flex-col items-center gap-[32px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-[32px]"
          >
            <h1 
              className={`${geist.className} text-[80px] leading-[0.9] font-medium tracking-[-0.04em] text-[#1d1d1d]`}
            >
              Strategic{" "}
              <span className={`${instrumentSerif.className} text-[100px] leading-[0.9] text-[#1d1d1d] font-normal`}>
                intelligence
              </span>
              <br />
              for college admissions
            </h1>

            <p className={`${geist.className} text-[18px] text-[#373a46] opacity-80 max-w-[554px] leading-relaxed`}>
              Replace high-cost consultants with data-driven insights. Instantly evaluate your profile, simulate outcomes, and discover your optimal path.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 mt-4 w-full max-w-md"
          >
            {/* Email Navbar Container */}
            <div className="flex items-center w-full bg-[#fcfcfc] rounded-[40px] p-2 border border-black/5 shadow-[0px_10px_40px_5px_rgba(194,194,194,0.25)]">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-6 py-3 outline-none text-[#1d1d1d] placeholder:text-[#1d1d1d]/40 text-base"
              />
              <Button
                className="rounded-full px-8 py-6 bg-[#1d1d1d] text-white hover:bg-black transition-all shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)] text-base font-medium"
              >
                Start for free
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-slate-500">
                <span className="text-slate-900 font-semibold">1,020+</span> Students
              </p>
            </div>
          </motion.div>
        </div>

        {/* Value Proposition Section */}
        <section className="w-full bg-[#fafafa] border-t border-slate-100 py-32 px-6 flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-20 text-center flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white text-xs font-medium mb-6">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-slate-600">The unfair advantage</span>
              </div>
              <h2 className={`${geist.className} text-4xl md:text-5xl font-medium tracking-tight text-slate-900 max-w-2xl`}>
                Everything you need to build a compelling applicant narrative.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium text-slate-900">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works / Dashboard Preview Section */}
        <section className="w-full bg-slate-950 text-white py-32 px-6 flex flex-col items-center overflow-hidden relative">
          {/* Subtle dark gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />
          
          <div className="w-full max-w-5xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-8"
              >
                <div>
                  <h2 className={`${geist.className} text-4xl md:text-5xl font-medium tracking-tight mb-6`}>
                    Stop guessing.<br />
                    <span className="text-slate-400">Start strategizing.</span>
                  </h2>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    Harmon analyzes thousands of data points from successful applicants to give you a clear, objective view of where you stand and what you need to do next.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {[
                    "Identify your core 'spike' and narrative",
                    "Find high-impact extracurriculars",
                    "Simulate ED vs RD acceptance odds",
                    "Optimize your college list"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-emerald-500/20 blur-xl opacity-50" />
                <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
                  {/* Mockup UI */}
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Admissions Score</div>
                        <div className="text-3xl font-medium">92/100</div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20">
                        Top 5%
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-emerald-400 w-[92%] h-full rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="text-sm text-slate-400 mb-2">Narrative Strength</div>
                        <div className="text-xl font-medium">Strong</div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="text-sm text-slate-400 mb-2">Target Schools</div>
                        <div className="text-xl font-medium">8 Matches</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-32 px-6 flex flex-col items-center bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-3xl text-center flex flex-col items-center gap-8"
          >
            <h2 className={`${geist.className} text-5xl md:text-6xl font-medium tracking-tight text-slate-900`}>
              Ready to build your<br />
              <span className={`${instrumentSerif.className} font-normal italic text-slate-500`}>winning</span> narrative?
            </h2>
            <p className="text-lg text-slate-500 max-w-xl">
              Join thousands of ambitious students using Harmon to navigate the complex world of elite college admissions.
            </p>
            <Link href="/sign-up">
              <Button
                className="rounded-full px-8 py-6 bg-[#1d1d1d] text-white hover:bg-black transition-all shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)] text-base font-medium mt-4"
              >
                Create your free account
              </Button>
            </Link>
          </motion.div>
        </section>
        
        {/* Footer */}
        <footer className="w-full border-t border-slate-100 py-12 px-6 flex flex-col items-center bg-white">
          <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-xs font-semibold tracking-tight">
                H
              </div>
              <span className="text-sm font-medium text-slate-900">Harmon Intelligence</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="#" className="hover:text-slate-900 transition">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-900 transition">Terms of Service</Link>
              <Link href="#" className="hover:text-slate-900 transition">Contact</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
