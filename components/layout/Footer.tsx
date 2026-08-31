import Link from 'next/link'
import Image from 'next/image'
import type { SiteSettings } from '@/lib/sanity/settings'

export function Footer({ settings }: { settings?: SiteSettings | null }) {
  const currentYear = new Date().getFullYear()
  const siteName = settings?.siteName || 'Top Consultancy Nepal'

  return (
    <footer className="mt-auto border-t border-white/10 bg-brand-primary px-6 py-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" className="mb-5 inline-flex items-center gap-3" aria-label={`${siteName} home`}>
            <span className="relative h-16 w-16 shrink-0 rounded-2xl bg-white p-1"><Image src={settings?.logo?.url || "/images/tcn-logo.png"} alt="" fill sizes="64px" className="object-contain p-1" /></span>
            <span className="leading-tight"><span className="block text-xl font-extrabold tracking-tight text-white">{siteName}</span></span>
          </Link>
          <p className="mb-6 text-sm leading-relaxed text-slate-300">
            {settings?.tagline || 'Find, Compare and Choose with Confidence. Your trusted directory for education consultancies in Nepal.'}
          </p>
        </div>
        
        <div>
          <h4 className="mb-6 font-semibold text-white">Explore</h4>
          <ul className="space-y-4">
            <li><Link href="/consultancies" className="text-sm text-slate-300 transition-colors hover:text-white">Consultancies</Link></li>
            <li><Link href="/study" className="text-sm text-slate-300 transition-colors hover:text-white">Study Destinations</Link></li>
            <li><Link href="/test-preparation" className="text-sm text-slate-300 transition-colors hover:text-white">Test Preparation</Link></li>
            <li><Link href="/events" className="text-sm text-slate-300 transition-colors hover:text-white">Events</Link></li>
            <li><Link href="/blog" className="text-sm text-slate-300 transition-colors hover:text-white">Blog</Link></li>
            <li><Link href="/scholarships" className="text-sm text-slate-300 transition-colors hover:text-white">Scholarships</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="mb-6 font-semibold text-white">Platform</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="text-sm text-slate-300 transition-colors hover:text-white">About Us</Link></li>
            <li><Link href="/editorial-policy" className="text-sm text-slate-300 transition-colors hover:text-white">Editorial Policy</Link></li>
            <li><Link href="/contact" className="text-sm text-slate-300 transition-colors hover:text-white">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="mb-6 font-semibold text-white">Legal</h4>
          <ul className="space-y-4">
            <li><Link href="/privacy-policy" className="text-sm text-slate-300 transition-colors hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-sm text-slate-300 transition-colors hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="mx-auto mt-16 max-w-7xl border-t border-white/10 pt-8 text-center text-sm text-slate-400">
        <p>&copy; {currentYear} {siteName}. All rights reserved.</p>
      </div>
    </footer>
  )
}
