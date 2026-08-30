import type { ReactNode } from 'react'

export function PolicyPage({ eyebrow, title, introduction, children }: { eyebrow: string; title: string; introduction: string; children: ReactNode }) {
  return <main className="flex-1"><header className="bg-brand-primary text-white"><div className="mx-auto max-w-4xl px-4 py-14 md:py-20"><p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">{eyebrow}</p><h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">{introduction}</p></div></header><article className="mx-auto max-w-4xl space-y-9 px-4 py-14 text-text-main [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand-primary [&_li]:leading-7 [&_p]:leading-8 [&_p]:text-text-muted [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">{children}</article></main>
}
