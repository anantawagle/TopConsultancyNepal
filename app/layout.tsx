import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSiteSettings } from "@/lib/sanity/settings";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || "Top Consultancy Nepal";

  return {
    title: {
      template: `%s | ${siteName}`,
      default: settings?.defaultSeoTitle || "Top Consultancy Nepal - Find, Compare and Choose with Confidence",
    },
    description: settings?.defaultSeoDescription || "Find and compare education consultancies in Nepal. Get the best study abroad information, test preparation guides, and scholarships.",
    icons: {
      icon: "/images/tcn-logo.png",
      apple: "/images/tcn-logo.png",
    },
  };
}

import { SiteChrome } from "@/components/layout/SiteChrome";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <a href="#main-content" className="fixed left-4 top-3 z-[200] -translate-y-20 rounded-lg bg-brand-primary px-4 py-3 font-bold text-white transition-transform focus:translate-y-0">Skip to main content</a>
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
