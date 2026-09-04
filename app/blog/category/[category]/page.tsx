import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { defineQuery } from 'next-sanity'
import { isSanityConfigured } from '@/lib/sanity/config'
import { BlogCategories, BLOG_CATEGORIES } from '@/components/content/BlogCategories'

type Props = {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const categoryData = BLOG_CATEGORIES.find(c => c.slug === category)
  if (!categoryData) return {}
  
  return { 
    title: `${categoryData.label} Study Abroad Blog`, 
    description: `Read our latest practical guides and advice for studying in ${categoryData.label}.` 
  }
}

type Post = { 
  _id: string; 
  title: string; 
  slug: string; 
  excerpt?: string; 
  publishedAt?: string;
  mainImage?: { url: string; alt?: string };
  author?: { name: string; image?: { url: string; alt?: string } };
}

const categoryPostsQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && $topic in coalesce(topics, [])] | order(publishedAt desc, _id asc) {
    _id,
    title,
    "slug":slug.current,
    excerpt,
    publishedAt,
    "mainImage": mainImage.asset->{ "url": url, "alt": ^.alt },
    "author": author->{ name, "image": image.asset->{ "url": url, "alt": ^.alt } }
  }
`)

export async function generateStaticParams() {
  return BLOG_CATEGORIES.filter(c => c.slug !== 'all').map(c => ({
    category: c.slug
  }))
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params
  const categoryData = BLOG_CATEGORIES.find(c => c.slug === category)
  
  if (!categoryData) {
    notFound()
  }

  const topic = `country:${category}`

  let posts: Post[] = []
  if (isSanityConfigured) { 
    const { client } = await import('@/lib/sanity/client')
    posts = await client.fetch<Post[]>(categoryPostsQuery, { topic }, { cache: 'no-store' }).catch(() => []) 
  }
  
  return (
    <main className="flex-1 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="mx-auto max-w-6xl px-4 relative z-10 text-center">
          <p className="mb-4 inline-block rounded-full bg-brand-secondary/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-brand-secondary">
            {categoryData.label} Guides
          </p>
          <h1 className="text-4xl font-extrabold text-brand-primary md:text-5xl lg:text-6xl tracking-tight">
            Study Abroad Blog
          </h1>
          <p className="mx-auto mb-8 mt-6 max-w-2xl text-lg text-text-muted md:text-xl">
            Practical guides and advice for studying in {categoryData.label}.
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="mx-auto max-w-6xl px-4 mt-8 sm:mt-12">
        <BlogCategories activeCategory={category} />

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article 
                key={post._id} 
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-secondary/10 hover:border-brand-secondary/30"
              >
                <div className="flex flex-col h-full">
                  {post.mainImage?.url && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <Image 
                        src={post.mainImage.url} 
                        alt={post.mainImage.alt || post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-8">
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
                      <p className="mt-4 line-clamp-3 text-base leading-relaxed text-text-muted flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
                      {post.author ? (
                        <div className="flex items-center gap-3 relative z-20">
                          {post.author.image?.url ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200">
                              <Image
                                src={post.author.image.url}
                                alt={post.author.image.alt || post.author.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                              {post.author.name.charAt(0)}
                            </div>
                          )}
                          <span className="text-sm font-medium text-text-main">{post.author.name}</span>
                        </div>
                      ) : <div />}
                      
                      <div className="flex items-center gap-2 font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors">
                        Read 
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-brand-primary">Fresh guidance is on the way</h2>
            <p className="mt-3 text-lg text-text-muted">
              We are currently preparing new practical articles for {categoryData.label}.
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
