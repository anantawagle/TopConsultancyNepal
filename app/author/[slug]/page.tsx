import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { defineQuery } from 'next-sanity'
import { isSanityConfigured } from '@/lib/sanity/config'
import type { PortableTextBlock } from 'sanity'
import { CustomPortableText } from '@/components/content/CustomPortableText'
import { ChevronLeft } from 'lucide-react'

type Author = {
  name: string;
  slug: string;
  bio?: PortableTextBlock[];
  image?: { url: string; alt?: string };
}

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: { url: string; alt?: string };
}

const authorQuery = defineQuery(/* groq */ `
  *[_type == "author" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    bio,
    "image": image.asset->{ "url": url, "alt": ^.alt }
  }
`)

const authorPostsQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && author->slug.current == $slug] | order(publishedAt desc, _id asc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "mainImage": mainImage.asset->{ "url": url, "alt": ^.alt }
  }
`)

const allAuthorSlugsQuery = defineQuery(/* groq */ `
  *[_type == "author" && defined(slug.current)][].slug.current
`)

export async function generateStaticParams() {
  if (!isSanityConfigured) return []
  const { client } = await import('@/lib/sanity/client')
  const slugs = await client.fetch<string[]>(allAuthorSlugsQuery).catch(() => [])
  return slugs.map(slug => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!isSanityConfigured) return {}
  const { client } = await import('@/lib/sanity/client')
  const author = await client.fetch<Author | null>(authorQuery, { slug }, { cache: 'no-store' }).catch(() => null)
  if (!author) return {}
  return { title: `Posts by ${author.name}`, description: `Read all posts written by ${author.name}.` }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params
  if (!isSanityConfigured) notFound()
  
  const { client } = await import('@/lib/sanity/client')
  const author = await client.fetch<Author | null>(authorQuery, { slug }, { cache: 'no-store' }).catch(() => null)
  
  if (!author) notFound()

  const posts = await client.fetch<Post[]>(authorPostsQuery, { slug }, { cache: 'no-store' }).catch(() => [])

  return (
    <main className="flex-1 bg-white pb-20">
      <header className="bg-slate-50 pt-16 pb-12 sm:pt-24 sm:pb-20 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="mx-auto w-full max-w-4xl px-4 relative z-10 text-center">
          {author.image?.url ? (
            <div className="relative mx-auto h-24 w-24 sm:h-32 sm:w-32 mb-6 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <Image src={author.image.url} alt={author.image.alt || author.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="mx-auto mb-6 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-brand-primary/10 text-4xl sm:text-5xl font-bold text-brand-primary border-4 border-white shadow-lg">
              {author.name.charAt(0)}
            </div>
          )}
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-primary md:text-5xl">
            {author.name}
          </h1>
          {author.bio && author.bio.length > 0 ? (
            <div className="mt-6 mx-auto max-w-2xl text-lg text-text-muted prose prose-slate text-center">
              <CustomPortableText value={author.bio} />
            </div>
          ) : (
            <p className="mt-4 mx-auto max-w-2xl text-lg text-text-muted">
              Author and contributor.
            </p>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-brand-primary">Articles by {author.name}</h2>
          <Link href="/blog" className="text-sm font-semibold text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article 
                key={post._id} 
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-secondary/10 hover:border-brand-secondary/30"
              >
                <div className="flex flex-col h-full">
                  {post.mainImage?.url && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <Image src={post.mainImage.url} alt={post.mainImage.alt || post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-text-muted mb-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px]">📅</span>
                      {post.publishedAt ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(post.publishedAt)) : 'Study guide'}
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-brand-primary">
                      <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-text-muted flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-end pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-sm font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors">
                        Read <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-text-muted">
            <p className="font-semibold text-brand-primary text-xl">{author.name} hasn't published any articles yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
