import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Harmon — Admissions Intelligence Platform",
  description: "AI-powered strategic admissions intelligence. Replace high-cost college consultants with data-driven insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${plexMono.variable} antialiased`}
      >
        <div className="app-shell flex">
          <Sidebar />
          <main className="flex-1 min-h-screen relative pt-15">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(111,140,255,0.18),_transparent_45%)] opacity-60 pointer-events-none" />
            <div className="relative z-10 max-w-7xl mx-auto px-8 py-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
