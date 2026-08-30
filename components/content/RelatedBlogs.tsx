import Link from 'next/link'
import { defineQuery } from 'next-sanity'

type Post = { _id: string; title: string; slug: string; excerpt?: string; publishedAt?: string }

const relatedPostsQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current) && $topic in coalesce(topics, [])]
    | order(publishedAt desc, _id asc)[0...3] {
      _id, title, "slug": slug.current, excerpt, publishedAt
    }
`)

const recentPostsQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc, _id asc)[0...3] {
      _id, title, "slug": slug.current, excerpt, publishedAt
    }
`)

async function getPosts(topic: string): Promise<Post[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return []
  const { client } = await import('@/lib/sanity/client')
  const related = await client.fetch<Post[]>(relatedPostsQuery, { topic }).catch(() => [])
  return related.length ? related : client.fetch<Post[]>(recentPostsQuery).catch(() => [])
}

export async function RelatedBlogs({ topic, title }: { topic: string; title: string }) {
  const posts = await getPosts(topic)
  return (
    <section className="border-t border-slate-200 py-14" aria-labelledby="related-guides">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-secondary">From our blog</p><h2 id="related-guides" className="text-3xl font-bold text-brand-primary">Guides related to {title}</h2></div>
        <Link href="/blog" className="font-semibold text-brand-secondary hover:underline">View all guides →</Link>
      </div>
      {posts.length ? <div className="grid gap-6 md:grid-cols-3">{posts.map((post) => <article key={post._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="mb-3 text-sm text-text-muted">{post.publishedAt ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(post.publishedAt)) : 'Study guide'}</p><h3 className="mb-3 text-xl font-bold text-brand-primary"><Link href={`/blog/${post.slug}`} className="hover:text-brand-secondary">{post.title}</Link></h3>{post.excerpt && <p className="mb-5 line-clamp-3 text-text-muted">{post.excerpt}</p>}<Link href={`/blog/${post.slug}`} className="font-semibold text-brand-secondary">Read guide →</Link></article>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-text-muted"><p className="font-semibold text-text-main">Relevant guides are coming soon.</p><p className="mt-1">We’re preparing practical articles for {title}.</p></div>}
    </section>
  )
}
