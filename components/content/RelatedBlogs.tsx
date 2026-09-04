import Link from 'next/link'
import Image from 'next/image'
import { defineQuery } from 'next-sanity'
import { isSanityConfigured } from '@/lib/sanity/config'

type Post = { 
  _id: string; 
  title: string; 
  slug: string; 
  excerpt?: string; 
  publishedAt?: string;
  mainImage?: { url: string; alt?: string };
  author?: { name: string; image?: { url: string; alt?: string } };
}

const relatedPostsQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && $topic in coalesce(topics, [])]
    | order(publishedAt desc, _id asc)[0...3] {
      _id, title, "slug": slug.current, excerpt, publishedAt,
      "mainImage": mainImage.asset->{ "url": url, "alt": ^.alt },
      "author": author->{ name, "image": image.asset->{ "url": url, "alt": ^.alt } }
    }
`)

async function getPosts(topic: string): Promise<Post[]> {
  if (!isSanityConfigured) return []
  const { client } = await import('@/lib/sanity/client')
  return client.fetch<Post[]>(relatedPostsQuery, { topic }).catch(() => [])
}

export async function RelatedBlogs({ topic, title }: { topic: string; title: string }) {
  const posts = await getPosts(topic)
  
  // If there are no related posts, hide the entire section
  if (posts.length === 0) {
    return null;
  }
  
  return (
    <section className="border-t border-slate-200 py-14" aria-labelledby="related-guides">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-secondary">From our blog</p>
          <h2 id="related-guides" className="text-3xl font-bold text-brand-primary">Guides related to {title}</h2>
        </div>
        <Link href="/blog" className="font-semibold text-brand-secondary hover:underline">View all guides →</Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article 
            key={post._id} 
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-secondary/10 hover:border-brand-secondary/30"
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
              
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-2 text-sm font-medium text-text-muted mb-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px]">
                    📅
                  </span>
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
                
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                  {post.author ? (
                    <div className="flex items-center gap-2 relative z-20">
                      {post.author.image?.url ? (
                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-200">
                          <Image
                            src={post.author.image.url}
                            alt={post.author.image.alt || post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-medium text-text-main">{post.author.name}</span>
                    </div>
                  ) : <div />}
                  
                  <div className="flex items-center gap-1 text-sm font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors">
                    Read 
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
