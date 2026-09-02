import Link from 'next/link'
import Image from 'next/image'
import { getConsultancies } from '@/lib/sanity/consultancies'

export async function RelatedConsultancies({ testName }: { testName: string }) {
  const consultancies = await getConsultancies()
  const matches = consultancies.filter((item) => item.testPreparation?.includes(testName))
  if (!matches.length) return null

  return <section className="border-t border-slate-200 py-14" aria-labelledby="test-prep-consultancies"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-secondary">Preparation providers</p><h2 id="test-prep-consultancies" className="text-3xl font-bold text-brand-primary">Consultancies offering {testName}</h2></div><Link href="/consultancies" className="font-semibold text-brand-secondary hover:underline">Compare all consultancies →</Link></div><div className="grid gap-5 md:grid-cols-3">{matches.slice(0, 6).map((item) => <article key={item._id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{item.logo?.url ? <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100"><Image src={item.logo.url} alt={item.logo.alt || `${item.name} logo`} width={44} height={44} className="h-full w-full object-contain p-1" /></div> : <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/5 text-lg font-extrabold text-brand-primary">{item.name.charAt(0)}</div>}<h3 className="mt-5 text-xl font-bold text-brand-primary">{item.name}</h3><p className="mt-2 text-sm font-medium text-brand-secondary">{item.city || 'Nepal'}</p><p className="mt-4 flex-1 text-sm leading-6 text-text-muted">{item.shortDescription}</p><Link href={`/consultancies/${item.slug}`} className="mt-5 font-bold text-brand-primary hover:text-brand-secondary">View profile →</Link></article>)}</div></section>
}
