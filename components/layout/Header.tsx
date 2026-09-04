'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Menu, X, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { SiteSettings } from '@/lib/sanity/settings'

type LinkItem = {
  href: string;
  label: string;
  dropdown?: { href: string; label: string }[];
}

const links: LinkItem[] = [
  { href: '/consultancies', label: 'Consultancies' }, { href: '/study', label: 'Destinations' },
  { href: '/test-preparation', label: 'Test Prep' }, { href: '/events', label: 'Events' },
  { 
    href: '/blog', 
    label: 'Blog',
    dropdown: [
      { href: '/blog', label: 'All Blogs' },
      { href: '/blog/category/australia', label: 'Australia' },
      { href: '/blog/category/canada', label: 'Canada' },
      { href: '/blog/category/uk', label: 'United Kingdom' },
      { href: '/blog/category/usa', label: 'United States' },
      { href: '/blog/category/new-zealand', label: 'New Zealand' }
    ]
  }, 
  { href: '/scholarships', label: 'Scholarships' },
]

export function Header({ settings }: { settings?: SiteSettings | null }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const previousY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      const movingDown = currentY > previousY.current
      setVisible(currentY < 80 || !movingDown)
      if (movingDown && currentY > 120) setMenuOpen(false)
      previousY.current = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return <motion.header initial={false} animate={{ y: visible ? 0 : -120, opacity: visible ? 1 : 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-x-0 top-3 z-[100] px-3 sm:top-4 sm:px-5">
    <div className="relative mx-auto max-w-7xl rounded-[1.4rem] border border-white/70 bg-white/85 shadow-[0_18px_60px_-20px_rgba(11,31,58,0.45)] backdrop-blur-2xl">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/50 to-transparent" />
      <div className="flex h-[68px] items-center justify-between px-4 sm:px-5">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${settings?.siteName || 'Top Consultancy Nepal'} home`}><span className="relative h-12 w-12 shrink-0 transition-transform group-hover:scale-105"><Image src={settings?.logo?.url || "/images/tcn-logo.png"} alt="" fill priority sizes="48px" className="object-contain" /></span><span className="leading-tight"><span className="block text-base font-extrabold tracking-tight text-brand-primary sm:text-lg">{settings?.siteName || 'Top Consultancy Nepal'}</span>{settings?.tagline && <span className="hidden max-w-48 truncate text-[10px] font-bold uppercase tracking-[0.12em] text-brand-secondary sm:block">{settings.tagline}</span>}</span></Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <div key={link.href} className="relative group">
              <Link 
                href={link.href} 
                className={`flex items-center gap-1 relative rounded-full px-3 py-2 text-sm font-semibold transition-colors ${isActive(link.href) ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-brand-primary'}`}
              >
                {link.label}
                {link.dropdown && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
              </Link>
              
              {link.dropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="w-48 bg-white rounded-2xl shadow-xl ring-1 ring-slate-900/5 border border-slate-100 overflow-hidden p-2 flex flex-col gap-0.5">
                    {link.dropdown.map(drop => (
                      <Link 
                        key={drop.href} 
                        href={drop.href} 
                        className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${pathname === drop.href ? 'bg-brand-secondary/10 text-brand-primary font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-brand-primary'}`}
                      >
                        {drop.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2"><Link href="/contact" className="hidden items-center rounded-full bg-brand-secondary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-secondary/20 transition hover:-translate-y-0.5 hover:bg-brand-primary md:inline-flex">Contact <ArrowUpRight className="ml-1.5 h-4 w-4" /></Link><button type="button" onClick={() => setMenuOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-primary lg:hidden" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
      </div>
      <AnimatePresence>{menuOpen && <motion.nav id="mobile-navigation" initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden border-t border-slate-200/80 lg:hidden" aria-label="Mobile navigation"><div className="grid gap-1 p-3 sm:grid-cols-2">{links.map((link) => <div key={link.href} className="flex flex-col gap-1"><Link href={link.href} onClick={() => setMenuOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-bold flex items-center justify-between ${isActive(link.href) ? 'bg-brand-primary text-white' : 'text-slate-700 hover:bg-slate-100'}`}>{link.label}</Link>{link.dropdown && isActive(link.href) && (<div className="ml-4 flex flex-col gap-1 border-l-2 border-slate-100 pl-2 mt-1">{link.dropdown.map(drop => (<Link key={drop.href} href={drop.href} onClick={() => setMenuOpen(false)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${pathname === drop.href ? 'bg-brand-secondary/10 text-brand-primary' : 'text-slate-600 hover:bg-slate-50'}`}>{drop.label}</Link>))}</div>)}</div>)}<Link href="/contact" onClick={() => setMenuOpen(false)} className="rounded-xl bg-brand-secondary px-4 py-3 text-sm font-bold text-white md:hidden">Contact us</Link></div></motion.nav>}</AnimatePresence>
    </div>
  </motion.header>
}
