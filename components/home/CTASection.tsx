import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="border-t border-slate-200 bg-white py-20 text-slate-950 lg:py-28" aria-labelledby="directory-cta-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 border-t border-slate-200 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.55fr)] lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">Start your search</p>
            <h2
              id="directory-cta-title"
              className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-primary sm:text-5xl lg:text-6xl"
            >
              Ready to start your journey?
            </h2>
          </div>

          <div className="lg:pt-12">
            <p className="max-w-xl text-lg leading-8 text-text-muted">
              Join thousands of students who found their perfect education partner through our comprehensive directory.
            </p>

            <Link
              href="/consultancies"
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-xl bg-brand-primary px-6 py-3 font-bold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
            >
              Start Searching Now
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
