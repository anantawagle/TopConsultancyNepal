import type { Metadata } from 'next'
import Link from 'next/link'
import { defineQuery } from 'next-sanity'
import { ArrowUpRight, Clock3, Mail, MapPinned, Phone, ShieldCheck } from 'lucide-react'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = { title: 'Start Your Study Abroad Journey', description: 'Share your study goals, preferred destination and test-preparation needs with Top Consultancy Nepal.' }
type Settings = { contactEmail?: string; contactPhone?: string }
const contactQuery = defineQuery(/* groq */ `*[_type == "siteSettings" && _id == "siteSettings"][0]{contactEmail,contactPhone}`)

export default async function ContactPage() {
  let settings: Settings | null = null
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    const { client } = await import('@/lib/sanity/client')
    settings = await client.fetch<Settings | null>(contactQuery).catch(() => null)
  }

  return <main id="main-content" tabIndex={-1} className="flex-1 overflow-hidden bg-[#f7faf9]">
    <section className="relative overflow-hidden bg-brand-primary text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,.12)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:linear-gradient(to_right,black,transparent)]" aria-hidden="true" />
      <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-brand-secondary/40 blur-[100px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-28">
        <p className="eyebrow !text-teal-300">Your study journey starts here</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-extrabold leading-[1.04] tracking-[-.045em] md:text-7xl text-balance">Where do you want your education to take you?</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">Share your destination, academic background and test-preparation needs. We’ll use the details to understand the guidance you’re looking for.</p>
        <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-slate-200"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-teal-300" aria-hidden="true" />Your details stay private</span><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-teal-300" aria-hidden="true" />Typical review: 2–3 days</span></div>
      </div>
    </section>

    <section className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[.72fr_1.28fr] lg:py-24">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow">Student enquiries</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-primary">Your plans are personal. Your first step should be clear.</h2><p className="mt-4 leading-7 text-text-muted">Tell us what you have studied, where you hope to go and whether you need help preparing for an English-language test.</p>
        <div className="mt-8 space-y-3">
          {settings?.contactEmail && <a href={`mailto:${settings.contactEmail}`} className="flex min-h-16 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-secondary"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft text-brand-secondary"><Mail className="h-5 w-5" aria-hidden="true" /></span><span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wider text-text-muted">Email us</span><span className="block break-words font-bold text-brand-primary">{settings.contactEmail}</span></span></a>}
          {settings?.contactPhone && <a href={`tel:${settings.contactPhone}`} className="flex min-h-16 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-secondary"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft text-brand-secondary"><Phone className="h-5 w-5" aria-hidden="true" /></span><span><span className="block text-xs font-bold uppercase tracking-wider text-text-muted">Call us</span><span className="font-bold text-brand-primary">{settings.contactPhone}</span></span></a>}
          {!settings?.contactEmail && !settings?.contactPhone && <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-text-muted"><MapPinned className="mb-3 h-5 w-5 text-brand-secondary" aria-hidden="true" />Direct details are being updated. You can still use the enquiry form.</div>}
        </div>
        <div className="mt-8 rounded-2xl bg-brand-primary p-6 text-white"><h3 className="font-bold">Trying to reach a consultancy?</h3><p className="mt-2 text-sm leading-6 text-slate-300">Each profile includes the provider’s own current contact information.</p><Link href="/consultancies" className="mt-5 inline-flex min-h-11 items-center font-bold text-teal-300 hover:text-white">Browse profiles <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></div>
      </aside>
      <ContactForm />
    </section>
  </main>
}
