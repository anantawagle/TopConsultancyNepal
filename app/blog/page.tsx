export const dynamic = 'force-dynamic';
import type { Metadata } from 'next'
import Link from 'next/link'
import { defineQuery } from 'next-sanity'
import { isSanityConfigured } from '@/lib/sanity/config'

export const metadata: Metadata = { title: 'Study Abroad Blog', description: 'Practical study-abroad and test-preparation guides.' }
type Post = { _id: string; title: string; slug: string; excerpt?: string; publishedAt?: string }
const postsQuery = defineQuery(/* groq */ `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc, _id asc){_id,title,"slug":slug.current,excerpt,publishedAt}`)

export default async function BlogPage() {
  let posts: Post[] = []
  if (isSanityConfigured) { 
    const { client } = await import('@/lib/sanity/client')
    posts = await client.fetch<Post[]>(postsQuery, {}, { cache: 'no-store' }).catch(() => []) 
  }
  
  return (
    <main className="flex-1 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="mx-auto max-w-6xl px-4 relative z-10 text-center">
          <p className="mb-4 inline-block rounded-full bg-brand-secondary/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-brand-secondary">
            Advice and insights
          </p>
          <h1 className="text-4xl font-extrabold text-brand-primary md:text-5xl lg:text-6xl tracking-tight">
            Study Abroad Blog
          </h1>
          <p className="mx-auto mb-8 mt-6 max-w-2xl text-lg text-text-muted md:text-xl">
            Practical guides for choosing a destination, preparing for tests, and making informed application decisions.
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="mx-auto max-w-6xl px-4 mt-8 sm:mt-12">
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article 
                key={post._id} 
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-secondary/10 hover:border-brand-secondary/30"
              >
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs">
                      📅
                    </span>
                    {post.publishedAt ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(post.publishedAt)) : 'Study guide'}
                  </div>
                  <h2 className="mt-5 text-2xl font-bold leading-tight text-brand-primary transition-colors group-hover:text-brand-secondary">
                    <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="mt-4 line-clamp-3 text-base leading-relaxed text-text-muted">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <div className="mt-8 flex items-center gap-2 font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors">
                  Read article 
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-brand-primary">Fresh guidance is on the way</h2>
            <p className="mt-3 text-lg text-text-muted">
              Explore our destination and test-preparation guides while new articles are being prepared.
            </p>
            <Link 
              href="/study" 
              className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-secondary px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-brand-secondary/90 hover:shadow-md"
            >
              Explore study destinations
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
