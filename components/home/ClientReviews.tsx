import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const decisionSteps = [
  {
    number: '01',
    title: 'Build a shortlist',
    description:
      'Compare consultancies by destination, services and location before you book a counselling session.',
  },
  {
    number: '02',
    title: 'Know what to ask',
    description:
      'Check fees, application support, visa guidance and test preparation against the same set of questions.',
  },
  {
    number: '03',
    title: 'Verify the details',
    description:
      'Confirm costs, timelines and admissions advice directly with the institution or official immigration source.',
  },
]

export function ClientReviews() {
  return (
    <section
      className="border-y border-slate-200 bg-[#f4f1e9] py-20 text-slate-950 lg:py-28"
      aria-labelledby="student-decisions-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
              Before you choose a consultancy
            </p>
            <h2
              id="student-decisions-title"
              className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl"
            >
              Make the shortlist before you book the appointment.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
              A good counselling session should help you test your options—not pressure you into the first one presented.
              Start with enough context to recognise the difference.
            </p>

            <Link
              href="/consultancies"
              className="mt-8 inline-flex min-h-11 items-center gap-2 border-b-2 border-slate-950 py-2 font-bold text-slate-950 transition-colors hover:border-brand-primary hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
            >
              Compare consultancy profiles
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>

          <div className="border-t border-slate-300">
            {decisionSteps.map((step) => (
              <article
                key={step.number}
                className="grid gap-4 border-b border-slate-300 py-7 sm:grid-cols-[3.5rem_12rem_1fr] sm:gap-6 sm:py-8"
              >
                <p className="font-mono text-sm font-semibold text-slate-500" aria-hidden="true">
                  {step.number}
                </p>
                <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>
                <p className="max-w-lg text-base leading-7 text-slate-700">{step.description}</p>
              </article>
            ))}

            <aside className="mt-8 border-l-4 border-brand-primary pl-5 sm:ml-[5rem]">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-600">A useful rule</p>
              <p className="mt-2 max-w-2xl text-lg font-semibold leading-7 text-slate-900">
                If a fee, deadline or visa claim affects your decision, ask for the official source before you act on it.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
