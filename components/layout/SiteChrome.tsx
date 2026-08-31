'use client'

import { usePathname } from 'next/navigation'
import type { SiteSettings } from '@/lib/sanity/settings'
import { Header } from './Header'
import { Footer } from './Footer'

export function SiteChrome({ settings, children }: { settings?: SiteSettings | null; children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudio = pathname === '/studio' || pathname?.startsWith('/studio/')

  if (isStudio) return <>{children}</>

  return (
    <>
      <Header settings={settings} />
      <div className="h-[92px] shrink-0" aria-hidden="true" />
      {children}
      <Footer settings={settings} />
    </>
  )
}
