import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
        className={`${plusJakarta.variable} ${dmSans.variable} antialiased bg-background text-foreground selection:bg-accent/20 selection:text-accent`}
      >
        {children}
      </body>
    </html>
  );
}
