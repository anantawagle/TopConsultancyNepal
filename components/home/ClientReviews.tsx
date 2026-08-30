'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Quote, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'

const reviews = [
  {
    quote: 'The comparison process finally felt clear. I could look at services and destinations in one place before speaking with a consultancy.',
    name: 'Aarav K.',
    journey: 'Planning to study in Australia',
    initials: 'AK',
    tone: 'from-blue-500 to-cyan-400',
  },
  {
    quote: 'Instead of choosing from advertisements alone, I had a better checklist for asking about fees, applications and visa support.',
    name: 'Samikshya R.',
    journey: 'Postgraduate applicant',
    initials: 'SR',
    tone: 'from-violet-500 to-fuchsia-400',
  },
  {
    quote: 'The destination and test-preparation guides helped me organise my next steps and arrive at counselling with the right questions.',
    name: 'Nischal P.',
    journey: 'Preparing for IELTS',
    initials: 'NP',
    tone: 'from-emerald-500 to-teal-400',
  },
]

export function ClientReviews() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white lg:py-32" aria-labelledby="student-stories-title">
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <div className="absolute -left-32 top-12 h-96 w-96 rounded-full bg-brand-secondary/40 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-600/30 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_420px]">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.65 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-emerald-300 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Student experiences
            </div>
            <h2 id="student-stories-title" className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Clarity changes the whole <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">journey.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Real value starts before an application: better comparisons, sharper questions and decisions made with confidence.</p>
          </motion.div>

          <motion.div initial={reduceMotion ? false : { opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-7 backdrop-blur-xl">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative flex items-center justify-between gap-5">
              <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Built for better choices</p><p className="mt-2 text-2xl font-bold">Compare. Question. Decide.</p></div>
              <motion.div animate={reduceMotion ? undefined : { rotate: [0, 8, -5, 0], scale: [1, 1.08, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950 shadow-[0_0_35px_rgba(52,211,153,0.35)]"><Star className="h-6 w-6 fill-current" aria-hidden="true" /></motion.div>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              initial={reduceMotion ? false : { opacity: 0, y: 40, rotate: index === 0 ? -1.5 : index === 2 ? 1.5 : 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -8, transition: { duration: 0.25 } }}
              className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-sm"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${review.tone} opacity-80`} />
              <Quote className="h-10 w-10 text-white/15 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-300/40" aria-hidden="true" />
              <blockquote className="mt-8 flex-1 text-xl font-medium leading-8 text-slate-100">“{review.quote}”</blockquote>
              <div className="mt-9 flex items-center gap-4 border-t border-white/10 pt-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${review.tone} text-sm font-extrabold text-white shadow-lg`}>{review.initials}</div>
                <div><p className="font-bold text-white">{review.name}</p><p className="mt-0.5 text-sm text-slate-400">{review.journey}</p></div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div initial={reduceMotion ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.35 }} className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 sm:flex-row">
          <p className="text-center text-sm text-slate-300 sm:text-left"><span className="font-bold text-white">Your next decision deserves context.</span> Explore detailed consultancy profiles before making contact.</p>
          <Link href="/consultancies" className="group inline-flex shrink-0 items-center gap-2 font-bold text-emerald-300 hover:text-emerald-200">Browse consultancies <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" /></Link>
        </motion.div>
      </div>
    </section>
  )
}
