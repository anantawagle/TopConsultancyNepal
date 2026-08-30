'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check, CircleAlert, LoaderCircle, MessageSquareText, Send } from 'lucide-react'
import Script from 'next/script'
import { FormEvent, useMemo, useState } from 'react'

const destinations = ['Australia', 'Canada', 'United Kingdom', 'United States', 'New Zealand', 'Other / undecided']
const testOptions = ['IELTS', 'PTE', 'TOEFL', 'SAT', 'Not sure yet', 'No test preparation']
type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
  const [destination, setDestination] = useState('')
  const [tests, setTests] = useState<string[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const reduceMotion = useReducedMotion()
  const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const progress = useMemo(() => Math.min(100, 15 + (destination ? 25 : 0) + (tests.length ? 20 : 0) + (message.trim() ? 25 : 0) + (status === 'success' ? 15 : 0)), [destination, tests, message, status])

  function toggleTest(item: string) {
    setTests(current => {
      if (current.includes(item)) return current.filter(value => value !== item)
      if (item === 'No test preparation' || item === 'Not sure yet') return [item]
      return [...current.filter(value => value !== 'No test preparation' && value !== 'Not sure yet'), item]
    })
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!destination) {
      setStatus('error')
      setError('Please choose a preferred destination, or select “Other / undecided”.')
      return
    }
    if (!turnstileKey) {
      setStatus('error')
      setError('The enquiry service is not configured yet. Please use the direct contact details on this page.')
      return
    }
    setStatus('sending')
    const form = event.currentTarget
    const data = new FormData(form)
    const studySummary = [
      'Student study-abroad enquiry',
      `Preferred destination: ${destination}`,
      `Test preparation: ${tests.join(', ') || 'Not specified'}`,
      `Education level: ${data.get('educationLevel') || 'Not specified'}`,
      `Preferred intake: ${data.get('intake') || 'Not specified'}`,
      `Academic background: ${data.get('academicBackground') || 'Not specified'}`,
      '',
      message.trim(),
    ].join('\n')
    data.set('message', studySummary.slice(0, 2000))
    data.set('consent', data.get('consent') === 'on' ? 'true' : 'false')
    data.set('source_path', window.location.pathname)
    data.set('utm_source', new URLSearchParams(window.location.search).get('utm_source') || '')
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', body: data })
      const result = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) throw new Error(result?.error || 'We could not send your message. Please try again.')
      setStatus('success')
      form.reset()
      setMessage('')
    } catch (submissionError) {
      setStatus('error')
      setError(submissionError instanceof Error ? submissionError.message : 'We could not send your message. Please try again.')
      window.turnstile?.reset()
    }
  }

  if (status === 'success') return <motion.div initial={reduceMotion ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[520px] flex-col items-center justify-center rounded-[2rem] border border-teal-200 bg-teal-50 p-8 text-center" role="status"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-secondary text-white"><Check className="h-8 w-8" aria-hidden="true" /></span><h2 className="mt-6 text-3xl font-extrabold text-brand-primary">Message received</h2><p className="mt-3 max-w-md leading-7 text-text-muted">Thanks for getting in touch. Our team will review your enquiry and respond using the contact details you provided.</p><button type="button" onClick={() => setStatus('idle')} className="mt-8 min-h-12 rounded-xl border border-brand-primary/15 bg-white px-6 font-bold text-brand-primary transition hover:border-brand-secondary">Send another message</button></motion.div>

  return <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-40px_rgba(16,47,59,.55)] sm:p-8">
    {turnstileKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />}
    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-secondary/10 blur-3xl" aria-hidden="true" />
    <div className="relative">
      <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Plan your study journey</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-primary">Tell us where you want to go</h2><p className="mt-2 leading-6 text-text-muted">Share your goals and preparation needs so we can understand your next step.</p></div><span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-soft text-brand-secondary sm:flex"><MessageSquareText className="h-6 w-6" aria-hidden="true" /></span></div>
      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true"><motion.div className="h-full rounded-full bg-brand-secondary" animate={{ width: `${progress}%` }} /></div>
      <form onSubmit={submit} className="mt-8 space-y-7">
        <fieldset><legend className="text-sm font-bold text-brand-primary">Where would you like to study? <span className="text-red-700">*</span></legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{destinations.map(item => <button key={item} type="button" aria-pressed={destination === item} onClick={() => setDestination(item)} className={`min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${destination === item ? 'border-brand-secondary bg-brand-secondary text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-text-muted hover:border-brand-secondary/50 hover:bg-white'}`}>{destination === item && <Check className="mr-1.5 inline h-4 w-4" aria-hidden="true" />}{item}</button>)}</div><input type="hidden" name="destination" value={destination} /></fieldset>
        <fieldset><legend className="text-sm font-bold text-brand-primary">Do you need test-preparation classes?</legend><p className="mt-1 text-xs text-text-muted">Select all that apply.</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{testOptions.map(item => <button key={item} type="button" aria-pressed={tests.includes(item)} onClick={() => toggleTest(item)} className={`min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${tests.includes(item) ? 'border-brand-secondary bg-teal-50 text-brand-secondary' : 'border-slate-200 bg-slate-50 text-text-muted hover:border-brand-secondary/50 hover:bg-white'}`}>{tests.includes(item) && <Check className="mr-1.5 inline h-4 w-4" aria-hidden="true" />}{item}</button>)}</div></fieldset>
        <div className="grid gap-5 sm:grid-cols-2"><Field label="Your name" name="name" autoComplete="name" required placeholder="e.g. Aarav Sharma" /><Field label="Email address" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></div>
        <Field label="Phone number" name="phone" type="tel" autoComplete="tel" required placeholder="e.g. +977 98XXXXXXXX" hint="Include your country code if you are currently outside Nepal." />
        <div className="grid gap-5 sm:grid-cols-2"><SelectField label="Current education level" name="educationLevel" options={['Grade 12 / +2', 'Bachelor’s degree', 'Master’s degree', 'Other']} /><SelectField label="Preferred intake" name="intake" options={['As soon as possible', '2026', '2027', 'Not decided yet']} /></div>
        <Field label="Academic background" name="academicBackground" placeholder="e.g. +2 Management, GPA 3.2" hint="Add your qualification, subject and approximate GPA or percentage." />
        <div><div className="flex items-center justify-between gap-4"><label htmlFor="message" className="text-sm font-bold text-brand-primary">Anything else we should know?</label><span className="text-xs tabular-nums text-text-muted">{message.length}/1200</span></div><textarea id="message" name="message" maxLength={1200} rows={5} value={message} onChange={event => setMessage(event.target.value)} placeholder="Tell us about your preferred course, budget, study gap or questions…" className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-brand-primary outline-none transition placeholder:text-slate-400 focus:border-brand-secondary focus:bg-white focus:ring-4 focus:ring-brand-secondary/10" /></div>
        <div className="hidden" aria-hidden="true"><label htmlFor="bot-field">Leave this field empty</label><input id="bot-field" name="bot-field" tabIndex={-1} autoComplete="off" /></div>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-text-muted"><input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-brand-secondary" /><span>I agree that Top Consultancy Nepal may use these details to respond to my enquiry. <span className="text-red-700">*</span></span></label>
        {turnstileKey && <div className="cf-turnstile" data-sitekey={turnstileKey} data-theme="light" data-appearance="interaction-only" />}
        {status === 'error' && <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><span>{error}</span></div>}
        <button type="submit" disabled={status === 'sending'} className="group flex min-h-14 w-full items-center justify-center rounded-xl bg-brand-primary px-6 font-bold text-white shadow-[0_14px_30px_-16px_rgba(16,47,59,.8)] transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-50">{status === 'sending' ? <><LoaderCircle className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />Sending…</> : <>Send enquiry <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></>}</button>
        <p className="text-center text-xs leading-5 text-text-muted">Your details help us understand your study plans. Admission and visa outcomes are never guaranteed.</p>
      </form>
    </div>
  </div>
}

function Field({ label, hint, ...props }: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = String(props.name)
  return <div><label htmlFor={id} className="text-sm font-bold text-brand-primary">{label}{props.required && <span className="text-red-700"> *</span>}</label><input id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...props} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base text-brand-primary outline-none transition placeholder:text-slate-400 focus:border-brand-secondary focus:bg-white focus:ring-4 focus:ring-brand-secondary/10" />{hint && <p id={`${id}-hint`} className="mt-2 text-xs leading-5 text-text-muted">{hint}</p>}</div>
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <div><label htmlFor={name} className="text-sm font-bold text-brand-primary">{label}</label><select id={name} name={name} defaultValue="" className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base text-brand-primary outline-none transition focus:border-brand-secondary focus:bg-white focus:ring-4 focus:ring-brand-secondary/10"><option value="" disabled>Select an option</option>{options.map(option => <option key={option}>{option}</option>)}</select></div>
}

declare global { interface Window { turnstile?: { reset: () => void } } }
