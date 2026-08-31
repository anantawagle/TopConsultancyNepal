import type { Metadata } from 'next'
import Link from 'next/link'
import { defineQuery } from 'next-sanity'
import { isSanityConfigured } from '@/lib/sanity/config'

export const metadata: Metadata = { title: 'Study Abroad Blog', description: 'Practical study-abroad and test-preparation guides.' }
type Post = { _id: string; title: string; slug: string; excerpt?: string; publishedAt?: string }
const postsQuery = defineQuery(/* groq */ `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc, _id asc){_id,title,"slug":slug.current,excerpt,publishedAt}`)

export default async function BlogPage() {
  let posts: Post[] = []
  if (isSanityConfigured) { const { client } = await import('@/lib/sanity/client'); posts = await client.fetch<Post[]>(postsQuery).catch(() => []) }
  return <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14"><p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand-secondary">Advice and insights</p><h1 className="text-4xl font-extrabold text-brand-primary md:text-5xl">Study Abroad Blog</h1><p className="mb-12 mt-5 max-w-3xl text-lg text-text-muted">Practical guides for choosing a destination, preparing for tests and making informed application decisions.</p>{posts.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <article key={post._id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><p className="text-sm text-text-muted">{post.publishedAt ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(post.publishedAt)) : 'Study guide'}</p><h2 className="mt-3 text-2xl font-bold text-brand-primary"><Link href={`/blog/${post.slug}`} className="hover:text-brand-secondary">{post.title}</Link></h2>{post.excerpt && <p className="mt-4 flex-1 leading-7 text-text-muted">{post.excerpt}</p>}<Link href={`/blog/${post.slug}`} className="mt-6 font-semibold text-brand-secondary">Read guide →</Link></article>)}</div> : <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center"><h2 className="text-xl font-bold text-brand-primary">Fresh guidance is on the way</h2><p className="mt-2 text-text-muted">Explore our destination and test-preparation guides while new articles are being prepared.</p><Link href="/study" className="mt-6 inline-block font-bold text-brand-secondary">Explore study destinations →</Link></div>}</main>
}
