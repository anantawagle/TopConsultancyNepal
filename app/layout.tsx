import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Top Consultancy Nepal",
    default: "Top Consultancy Nepal - Find, Compare and Choose with Confidence",
  },
  description: "Find and compare education consultancies in Nepal. Get the best study abroad information, test preparation guides, and scholarships.",
  icons: {
    icon: "/images/tcn-logo.png",
    apple: "/images/tcn-logo.png",
  },
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <a href="#main-content" className="fixed left-4 top-3 z-[200] -translate-y-20 rounded-lg bg-brand-primary px-4 py-3 font-bold text-white transition-transform focus:translate-y-0">Skip to main content</a>
        <Header />
        <div className="h-[92px] shrink-0" aria-hidden="true" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
