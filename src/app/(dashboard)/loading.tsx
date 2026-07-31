export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(73,108,191,0.35),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(96,144,255,0.25),transparent_35%),radial-gradient(circle_at_50%_70%,rgba(27,59,121,0.4),rgba(10,14,27,0.9)),linear-gradient(140deg,#0c1020_0%,#0b1530_50%,#060914_100%)]" />
      <div className="absolute inset-0 opacity-50 mix-blend-screen" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 160 160\\'%3E%3Cfilter id=\\'n\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'160\\' height=\\'160\\' filter=\\'url(%23n)\\' opacity=\\'0.12\\'/%3E%3C/svg%3E')" }} />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full border-2 border-white/25 border-t-white animate-spin" />
        <p className="text-sm text-white/70 tracking-wide uppercase">Loading workspace</p>
      </div>
    </div>
  );
}
