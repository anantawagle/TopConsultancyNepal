'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const links = [
  { href: '/consultancies', label: 'Consultancies' }, { href: '/study', label: 'Destinations' },
  { href: '/test-preparation', label: 'Test Prep' }, { href: '/events', label: 'Events' },
  { href: '/blog', label: 'Blog' }, { href: '/scholarships', label: 'Scholarships' },
]

export function Header() {
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
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Top Consultancy Nepal home"><span className="relative h-12 w-12 shrink-0 transition-transform group-hover:scale-105"><Image src="/images/tcn-logo.png" alt="" fill priority sizes="48px" className="object-contain" /></span><span className="leading-tight"><span className="block text-base font-extrabold tracking-tight text-brand-primary sm:text-lg">Top Consultancy</span><span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-brand-secondary sm:block">Nepal</span></span></Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">{links.map((link) => <Link key={link.href} href={link.href} className={`relative rounded-full px-3 py-2 text-sm font-semibold transition-colors ${isActive(link.href) ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-brand-primary'}`}>{link.label}</Link>)}</nav>
        <div className="flex items-center gap-2"><Link href="/contact" className="hidden items-center rounded-full bg-brand-secondary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-secondary/20 transition hover:-translate-y-0.5 hover:bg-brand-primary md:inline-flex">Contact <ArrowUpRight className="ml-1.5 h-4 w-4" /></Link><button type="button" onClick={() => setMenuOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-primary lg:hidden" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
      </div>
      <AnimatePresence>{menuOpen && <motion.nav id="mobile-navigation" initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden border-t border-slate-200/80 lg:hidden" aria-label="Mobile navigation"><div className="grid gap-1 p-3 sm:grid-cols-2">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-bold ${isActive(link.href) ? 'bg-brand-primary text-white' : 'text-slate-700 hover:bg-slate-100'}`}>{link.label}</Link>)}<Link href="/contact" onClick={() => setMenuOpen(false)} className="rounded-xl bg-brand-secondary px-4 py-3 text-sm font-bold text-white md:hidden">Contact us</Link></div></motion.nav>}</AnimatePresence>
    </div>
  </motion.header>
}
